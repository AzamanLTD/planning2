// Question bank access. Questions are original content authored for this
// project (see docs/question-set-guidelines.md). JSON lives next to this file.

import rwM1 from "./rw-m1.json";
import rwM2Easy from "./rw-m2-easy.json";
import rwM2Hard from "./rw-m2-hard.json";
import mathM1 from "./math-m1.json";
import mathM2Easy from "./math-m2-easy.json";
import mathM2Hard from "./math-m2-hard.json";

const BANK = {
  "rw-m1": rwM1,
  "rw-m2-easy": rwM2Easy,
  "rw-m2-hard": rwM2Hard,
  "math-m1": mathM1,
  "math-m2-easy": mathM2Easy,
  "math-m2-hard": mathM2Hard
};

export function getModuleQuestions(moduleKey, variant) {
  let key = moduleKey;
  if (variant) key = `${moduleKey}-${variant}`;
  const qs = BANK[key];
  if (!qs) throw new Error("no bank for " + key);
  return qs;
}

export function bankStats() {
  return Object.fromEntries(Object.entries(BANK).map(([k, v]) => [k, v.length]));
}
