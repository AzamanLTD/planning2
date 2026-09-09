(() => {
  'use strict';

  const question = window.SAT_QUESTIONS?.rw1?.find((item) => item.id === 'RWM1Q20');
  if (!question || question.__azmMediaOverrideApplied) return;
  question.media = {
    type: 'image',
    src: 'assets/media/rainfall-chart.svg',
    alt: 'Bar chart showing monthly rainfall of 42 millimeters in January, 58 in February, 51 in March, and 49 in April.',
    caption: 'Monthly rainfall totals used in this original practice question.'
  };
  Object.defineProperty(question, '__azmMediaOverrideApplied', { value: true, enumerable: false });
})();
