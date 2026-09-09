const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('results-enhancement.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
for (const phrase of [
  'results-domain-breakdown', 'domainAccuracy', 'results-domain-bar', 'aria-valuenow',
  'aria-valuemin', 'aria-valuemax', 'renderQuestionReview', 'results-review',
  'Review answer', 'resultsReviewFilter', 'numericAnswer', 'denominator === 0',
  'Math.abs(an - bn) <= 1e-9'
]) assert(source.includes(phrase), `results report contract missing: ${phrase}`);
assert(index.includes('results-domain-report.css'), 'domain report stylesheet must be loaded');
assert(index.includes('results-question-review.css'), 'question review stylesheet must be loaded');
console.log('RESULTS DOMAIN AND QUESTION REVIEW CONTRACT PASSED');
