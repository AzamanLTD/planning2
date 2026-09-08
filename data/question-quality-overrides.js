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
    MM2HQ14: {
      difficulty: 'hard',
      prompt: 'A tank is 18% full. After 35 liters of water are added, the tank is 32% full. What is the capacity of the tank, in liters?',
      options: ['175', '200', '250', '280'],
      answer: 'C',
      explanation: 'The 35 liters increase the fill level by 14% of the tank capacity, so 0.14C = 35 and C = 250.'
    },
    MM2HQ20: {
      difficulty: 'hard',
      prompt: 'The function f(x) = 3x² - 12x + 7 has its minimum value at which value of x?',
      options: ['1', '2', '3', '4'],
      answer: 'B',
      explanation: 'For a quadratic ax² + bx + c, the x-coordinate of the vertex is -b/(2a). Here, -(-12)/(2·3) = 2.'
    },
    MM2HQ21: {
      difficulty: 'hard',
      prompt: 'For x ≥ 0, if √(x + 5) − √x = 1, what is the value of x?',
      options: ['1', '2', '4', '9'],
      answer: 'C',
      explanation: 'Squaring gives x + 5 = x + 1 + 2√x, so 4 = 2√x and x = 4.'
    },
    MM2HQ22: {
      difficulty: 'hard',
      prompt: 'A box contains red and blue tiles in a ratio of 3 to 5. After 8 blue tiles are removed, the ratio of red to blue tiles is 3 to 4. How many tiles were in the box originally?',
      options: ['48', '56', '64', '72'],
      answer: 'C',
      explanation: 'Let the numbers be 3k and 5k. Then 3k/(5k − 8) = 3/4, which gives 12k = 15k − 24 and k = 8. The original total was 8k = 64.'
    }
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

  // Avoid a predictable “correct answer is usually A” pattern while preserving
  // the underlying question, distractors, and correct answer text. The mapping is
  // deterministic so the same item has the same answer position on every run.
  const letters = ['A', 'B', 'C', 'D'];
  function hash(value) {
    let h = 2166136261;
    for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return h >>> 0;
  }
  groups.flat().forEach((question) => {
    if (question.type === 'spr' || !Array.isArray(question.options) || question.options.length !== 4) return;
    if (question.__azmAnswerPositionBalanced === true) return;
    const originalIndex = letters.indexOf(String(question.answer).toUpperCase());
    if (originalIndex < 0) return;
    const shift = hash(question.id) % 4;
    if (shift) {
      const original = question.options.slice();
      question.options = original.map((_, nextIndex) => original[(nextIndex - shift + 4) % 4]);
      question.answer = letters[(originalIndex + shift) % 4];
    }
    Object.defineProperty(question, '__azmAnswerPositionBalanced', {
      value: true,
      enumerable: false,
      configurable: false,
      writable: false
    });
  });
})();
