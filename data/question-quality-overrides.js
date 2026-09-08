(() => {
  'use strict';

  const prompts = {
    RWM1Q1: "Which choice best summarizes the text's main point?",
    RW2E9: 'Which inference is best supported by the information given?',
    RWM2HQ2: 'Which conclusion can be reasonably drawn from the passage?',
    RWM2HQ9: 'Which choice most accurately captures the passage’s central idea?'
  };

  const groups = [window.SAT_QUESTIONS?.rw1 || [], window.SAT_QUESTIONS?.rw2?.easy || [], window.SAT_QUESTIONS?.rw2?.hard || []];
  const byId = new Map(groups.flat().map((question) => [question.id, question]));
  Object.entries(prompts).forEach(([id, prompt]) => {
    const question = byId.get(id);
    if (question) question.prompt = prompt;
  });
})();
