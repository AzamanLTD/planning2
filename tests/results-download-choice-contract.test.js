const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('results-download-enhancement.js', 'utf8');
assert(source.includes('question.options?.slice(0, 4)'), 'downloaded report should enumerate four MCQ choices');
assert(source.includes('Your answer'), 'downloaded report should label the selected answer');
assert(source.includes('Correct answer'), 'downloaded report should label the correct choice');
assert(source.includes('Question review'), 'downloaded report should retain full question review');
console.log('RESULTS DOWNLOAD CHOICE CONTRACT PASSED');
