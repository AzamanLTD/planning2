(() => {
  'use strict';

  const overrides = {
    RWM1Q1: { prompt: "Which choice best summarizes the text's main point?" },
    RW2E9: { prompt: 'Which inference is best supported by the information given?' },
    RWM2HQ2: { prompt: 'Which conclusion can be reasonably drawn from the passage?' },
    RWM2HQ9: { prompt: 'Which choice most accurately captures the passage’s central idea?' },
    MM2EQ3: { options: ['3', '4.5', '6', '7'] },
    MM2EQ20: { options: ['5', '6', '7', '10'] },
    MM2EQ4: { options: ['1', '3', '5', '7'] },
    MM2HQ8: { options: ['2', '4', '7', '9'] },
    MM2HQ16: { options: ['1', '4', '5', '8'] },
    MM2HQ14: { difficulty: 'hard', prompt: 'A solution is 18% salt by volume. How many milliliters of salt are in 250 mL of solution?' },
    MM2HQ20: { difficulty: 'hard', prompt: 'For a positive value of x, the equation 7x - 9 = 26 is satisfied. What is x?' },
    MM2HQ21: { difficulty: 'hard', prompt: 'For positive x, if x² = 121, what is the value of x?' },
    MM2HQ22: { difficulty: 'hard', prompt: 'A class has 24 students. If 5/8 of the students submitted a project, how many students submitted it?' }
  };

  const groups = [
    window.SAT_QUESTIONS?.rw1 || [],
    window.SAT_QUESTIONS?.rw2?.easy || [],
    window.SAT_QUESTIONS?.rw2?.hard || [],
    window.SAT_QUESTIONS?.math1 || [],
    window.SAT_QUESTIONS?.math2?.easy || [],
    window.SAT_QUESTIONS?.math2?.hard || []
  ];
  const byId = new Map(groups.flat().map((question) => [question.id, question]));
  Object.entries(overrides).forEach(([id, patch]) => {
    const question = byId.get(id);
    if (question) Object.assign(question, patch);
  });
})();
