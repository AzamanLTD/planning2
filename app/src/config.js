// Central configuration for the replica.
// Deployment/owner settings live here so no other file needs editing.

export const EXAM = {
  title: "SAT Practice Test",
  sections: [
    {
      id: "rw",
      name: "Reading and Writing",
      modules: 2,
      questionsPerModule: 27,
      minutesPerModule: 32
    },
    {
      id: "math",
      name: "Math",
      modules: 2,
      questionsPerModule: 22,
      minutesPerModule: 35
    }
  ],
  breakMinutes: 10,
  adaptiveThreshold: 0.65, // fraction correct on Module 1 that routes to the harder Module 2
  warningAtSeconds: 300 // timer turns alert color with 5 minutes left (official behavior)
};

// Test codes the proctor hands out. Edit this list to rotate codes.
export const VALID_TEST_CODES = ["BLUEBOOK", "SAT2026", "AZAMAN"];

// The order of modules for the full run: 0=R&W M1, 1=R&W M2, 2=Math M1, 3=Math M2
export const MODULE_FLOW = [
  { key: "rw-m1", section: "rw", name: "Reading and Writing Module 1", questions: 27, minutes: 32, calculator: false, hasBreak: false },
  { key: "rw-m2", section: "rw", name: "Reading and Writing Module 2", questions: 27, minutes: 32, calculator: false, hasBreak: false },
  { key: "math-m1", section: "math", name: "Math Module 1", questions: 22, minutes: 35, calculator: true, hasBreak: true },
  { key: "math-m2", section: "math", name: "Math Module 2", questions: 22, minutes: 35, calculator: true, hasBreak: false }
];
