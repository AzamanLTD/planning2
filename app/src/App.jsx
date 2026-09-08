import React, { useEffect, useRef, useState, useCallback } from "react";
import { EXAM, MODULE_FLOW } from "./config.js";
import {
  newSession, loadSession, saveSession, blankResponse,
  routeVariant, MODULE_SECONDS
} from "./exam/session.js";
import { getModuleQuestions } from "./data/bank.js";
import SignIn from "./components/SignIn.jsx";
import Setup from "./components/Setup.jsx";
import Instructions from "./components/Instructions.jsx";
import QuestionScreen from "./components/QuestionScreen.jsx";
import ReviewScreen from "./components/ReviewScreen.jsx";
import BreakScreen from "./components/BreakScreen.jsx";
import FinishScreen from "./components/FinishScreen.jsx";
import BbHeader from "./components/BbHeader.jsx";

export default function App() {
  const [session, setSession] = useState(() => loadSession());
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (session) saveSession(session);
  }, [session]);

  // Global countdown driver: module time and break time tick here.
  useEffect(() => {
    if (!session) return;
    const ticking =
      (session.phase === "module") ||
      (session.phase === "break");
    if (!ticking) return;
    const iv = setInterval(() => {
      setSession((s) => {
        if (!s) return s;
        if (s.timeRemaining > 0) return { ...s, timeRemaining: s.timeRemaining - 1 };
        // time expired
        if (s.phase === "module") return advanceAfterModule(s, true);
        if (s.phase === "break") return startInstructions(s, s.moduleIndex);
        return s;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [session?.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- flow transitions ----------
  const beginSession = (name, code) => {
    setSession(newSession(name, code));
  };

  const startInstructions = (s, moduleIndex) => {
    const mod = MODULE_FLOW[moduleIndex];
    return {
      ...s,
      phase: "instructions",
      moduleIndex,
      questionIndex: 0,
      timeRemaining: mod.minutes * 60
    };
  };

  const goToInstructions = (moduleIndex) => {
    setSession((s) => startInstructions(s, moduleIndex));
  };

  const startModule = () => {
    setSession((s) => ({
      ...s,
      phase: "module",
      questionIndex: 0,
      timeRemaining: s.timeRemaining || MODULE_FLOW[s.moduleIndex].minutes * 60
    }));
  };

  const goReview = () => {
    setSession((s) => ({ ...s, phase: "review" }));
  };

  // After a module's review is submitted (or timer expires mid-module).
  const advanceAfterModule = (s, timedOut = false) => {
    const idx = s.moduleIndex;
    const mod = MODULE_FLOW[idx];
    if (mod.key === "rw-m1") {
      return {
        ...s,
        variant: { ...s.variant, "rw-m2": routeVariant("rw-m1", "rw-m2", s.responses) },
        phase: "instructions",
        moduleIndex: 1,
        questionIndex: 0,
        timeRemaining: MODULE_FLOW[1].minutes * 60
      };
    }
    if (mod.key === "rw-m2") {
      // break before Math Module 1
      return { ...s, phase: "break", moduleIndex: 2, timeRemaining: EXAM.breakMinutes * 60 };
    }
    if (mod.key === "math-m1") {
      return {
        ...s,
        variant: { ...s.variant, "math-m2": routeVariant("math-m1", "math-m2", s.responses) },
        phase: "instructions",
        moduleIndex: 3,
        questionIndex: 0,
        timeRemaining: MODULE_FLOW[3].minutes * 60
      };
    }
    // math-m2 finished
    return { ...s, phase: "finish", finishedAt: new Date().toISOString() };
  };

  const submitModule = () => {
    setSession((s) => advanceAfterModule(s, false));
  };

  const finishBreak = () => {
    setSession((s) => startInstructions(s, s.moduleIndex));
  };

  // ---------- response mutations ----------
  const mutateResponse = useCallback((qId, mut) => {
    setSession((s) => {
      const prev = s.responses[qId] || blankResponse();
      return { ...s, responses: { ...s.responses, [qId]: mut(prev) } };
    });
  }, []);

  const setQuestionIndex = (i) => setSession((s) => ({ ...s, questionIndex: i }));
  const restart = () => {
    if (window.confirm("Start a new session? The current session will be cleared.")) {
      setSession(null);
      localStorage.removeItem("bb-replica-session-v1");
    }
  };

  if (!session) {
    return <SignIn onSignIn={beginSession} />;
  }

  const mod = MODULE_FLOW[session.moduleIndex];
  const questions = (() => {
    try {
      const variant = mod.key.endsWith("-m2") ? session.variant[mod.key] : null;
      return getModuleQuestions(mod.key, variant);
    } catch (e) {
      return [];
    }
  })();

  return (
    <div style={{ fontSize: `${zoom}em` }}>
      <BbHeader
        phase={session.phase}
        moduleName={mod.name}
        timeRemaining={session.phase === "module" || session.phase === "break" ? session.timeRemaining : null}
        student={session.studentName}
        onZoom={(d) => setZoom((z) => Math.min(1.5, Math.max(0.85, z + d)))}
      />
      {session.phase === "setup" && <Setup session={session} onReady={() => goToInstructions(0)} />}
      {session.phase === "instructions" && (
        <Instructions module={mod} questionsCount={questions.length} onStart={startModule} />
      )}
      {session.phase === "module" && (
        <QuestionScreen
          key={mod.key + (session.variant[mod.key] || "")}
          session={session}
          module={mod}
          questions={questions}
          onRespond={mutateResponse}
          onGoIndex={setQuestionIndex}
          onGoReview={goReview}
        />
      )}
      {session.phase === "review" && (
        <ReviewScreen
          session={session}
          module={mod}
          questions={questions}
          onGoIndex={(i) => {
            setSession((s) => ({ ...s, phase: "module", questionIndex: i }));
          }}
          onSubmit={submitModule}
        />
      )}
      {session.phase === "break" && <BreakScreen session={session} onContinue={finishBreak} />}
      {session.phase === "finish" && <FinishScreen session={session} onNewSession={restart} />}
    </div>
  );
}
