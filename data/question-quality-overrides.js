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
      prompt: 'A container holds a solution that is 20% acid by volume. After 15 milliliters of water are added, the solution is 16% acid by volume. How many milliliters of solution were in the container originally?',
      answer: '60',
      explanation: 'Let the original volume be V. The amount of acid is 0.20V, so 0.20V/(V + 15) = 0.16. Solving gives 0.20V = 0.16V + 2.4, so V = 60.'
    },
    MM2HQ20: {
      difficulty: 'hard',
      prompt: 'The function f(x) = 3x² - 12x + 7 has its minimum value at which value of x?',
      answer: '2',
      explanation: 'For a quadratic ax² + bx + c, the x-coordinate of the vertex is -b/(2a). Here, -(-12)/(2·3) = 2.'
    },
    MM2HQ21: {
      difficulty: 'hard',
      prompt: 'For x ≥ 0, if √(x + 5) − √x = 1, what is the value of x?',
      answer: '4',
      explanation: 'Squaring gives x + 5 = x + 1 + 2√x, so 4 = 2√x and x = 4.'
    },
    MM2HQ22: {
      difficulty: 'hard',
      prompt: 'A box contains red and blue tiles in a ratio of 3 to 5. After 8 blue tiles are removed, the ratio of red to blue tiles is 3 to 4. How many tiles were in the box originally?',
      answer: '64',
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

  const letters = ['A', 'B', 'C', 'D'];
  function hash(value) {
    let h = 2166136261;
    for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return h >>> 0;
  }

  groups.flat().forEach((question) => {
    if (question.__azmQualityOverridesApplied === true) return;

    const patch = overrides[question.id];
    if (patch) Object.assign(question, patch);

    // Avoid a predictable “correct answer is usually A” pattern while preserving
    // the question, distractors, and correct answer text. The mapping is deterministic.
    if (question.type !== 'spr' && Array.isArray(question.options) && question.options.length === 4) {
      const originalIndex = letters.indexOf(String(question.answer).toUpperCase());
      if (originalIndex >= 0) {
        const shift = hash(question.id) % 4;
        if (shift) {
          const original = question.options.slice();
          question.options = original.map((_, nextIndex) => original[(nextIndex - shift + 4) % 4]);
          question.answer = letters[(originalIndex + shift) % 4];
        }
      }
    }

    Object.defineProperty(question, '__azmQualityOverridesApplied', {
      value: true,
      enumerable: false,
      configurable: false,
      writable: false
    });
  });
})();
