(() => {
  'use strict';

  // This module intentionally does not replace the existing report generator.
  // It augments the generated review table with a deterministic A–D breakdown
  // for MCQs while retaining the existing SPR behavior.
  window.AZAMAN_RESULTS_DOWNLOAD_CHOICES = {
    render(question, selected) {
      if (!question || question.type === 'spr' || !Array.isArray(question.options)) return '';
      const selectedLetter = String(selected ?? '').trim().toUpperCase();
      const correctLetter = String(question.answer ?? '').trim().toUpperCase();
      return question.options.slice(0, 4).map((text, index) => {
        const letter = String.fromCharCode(65 + index);
        const labels = [];
        if (letter === selectedLetter) labels.push('Your answer');
        if (letter === correctLetter) labels.push('Correct answer');
        return `<div><strong>${letter}.</strong> ${text}${labels.length ? ` — ${labels.join(' · ')}` : ''}</div>`;
      }).join('');
    }
  };
})();
