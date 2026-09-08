// Session state: the exam run, answers, scoring, adaptive routing, persistence.
// The localStorage key is stable so a refresh mid-exam restores the run.

import { EXAM } from "./config.js";
import { getModuleQuestions } from "./data/bank.js";

const STORAGE_KEY = "bb-replica-session-v1";

export function blankResponse() {
  return { choice: null, spr: null, marked: false, eliminated: [], note: "", highlights: [] };
}

export function newSession(studentName, testCode) {
  return {
    studentName,
    testCode,
    startedAt: new Date().toISOString(),
    phase: "setup", // setup | instructions | module | review | break | finish
    moduleIndex: 0,
    questionIndex: 0,
    variant: { "rw-m2": null, "math-m2": null }, // chosen when Module 1 completes
    timeRemaining: MODULE_SECONDS(),
    responses: {}, // questionId -> response object
    calcMinutesUsed: 0,
    finishedAt: null
  };
}

export function MODULE_SECONDS(minutes) {
  return (minutes !== undefined ? minutes : 32) * 60;
}

export function saveSession(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) { /* storage full or unavailable; exam continues in memory */ }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---- SPR answer equivalence -------------------------------------------------
// Student-produced responses accept integers, decimals, and fractions.
// "3/4", "0.75", ".75" all match an answer keyed as "3/4".
export function sprValue(text) {
  if (text === null || text === undefined) return NaN;
  let t = String(text).trim().replace(/\s+/g, "");
  if (t === "") return NaN;
  let num;
  if (t.includes("/")) {
    const [a, b] = t.split("/");
    if (b === undefined || b === "" || isNaN(+a) || isNaN(+b) || +b === 0) return NaN;
    num = +a / +b;
  } else {
    num = +t;
  }
  return num;
}

export function sprMatches(sprText, key) {
  const given = sprValue(sprText);
  const expected = sprValue(key);
  if (isNaN(given) || isNaN(expected)) return false;
  return Math.abs(given - expected) < 1e-9;
}

// ---- scoring ----------------------------------------------------------------
export function isCorrect(question, response) {
  if (!response) return false;
  if (question.type === "mcq") {
    return response.choice !== null && response.choice === question.answer;
  }
  return response.spr !== null && response.spr !== "" && sprMatches(response.spr, question.spr.answer);
}

export function scoreModule(moduleKey, variant, responses) {
  const questions = getModuleQuestions(moduleKey, variant);
  let correct = 0;
  const perDomain = {};
  for (const q of questions) {
    const r = responses[q.id] || blankResponse();
    const ok = isCorrect(q, r);
    if (ok) correct++;
    if (!perDomain[q.domain]) perDomain[q.domain] = { correct: 0, total: 0 };
    perDomain[q.domain].total++;
    if (ok) perDomain[q.domain].correct++;
  }
  return { correct, total: questions.length, perDomain };
}

// Adaptive routing: Module 2 variant from Module 1 performance.
export function routeVariant(module1Key, m2Key, responses) {
  const { correct, total } = scoreModule(module1Key, null, responses);
  return correct / total >= EXAM.adaptiveThreshold ? "hard" : "easy";
}

export function moduleSummary(session) {
  const mods = [
    { key: "rw-m1", label: "Reading and Writing Module 1", variant: null },
    { key: "rw-m2", label: "Reading and Writing Module 2", variant: session.variant["rw-m2"] },
    { key: "math-m1", label: "Math Module 1", variant: null },
    { key: "math-m2", label: "Math Module 2", variant: session.variant["math-m2"] }
  ];
  return mods.map((m) => ({ ...m, ...scoreModule(m.key, m.variant, session.responses) }));
}

// Rough converted score (350-750 per section, 400-1600 total), like the real scale.
export function estimatedScore(session) {
  const rwMods = [scoreModule("rw-m1", null, session.responses), scoreModule("rw-m2", session.variant["rw-m2"], session.responses)];
  const mathMods = [scoreModule("math-m1", null, session.responses), scoreModule("math-m2", session.variant["math-m2"], session.responses)];
  const rwCorrect = rwMods[0].correct + rwMods[1].correct;
  const mathCorrect = mathMods[0].correct + mathMods[1].correct;
  const rw = Math.round(200 + (rwCorrect / 54) * 550 + 150);
  const math = Math.round(200 + (mathCorrect / 44) * 550 + 150);
  const clamp = (n) => Math.max(200, Math.min(800, n));
  return { rw: clamp(rw), math: clamp(math), total: clamp(rw) + clamp(math) };
}
