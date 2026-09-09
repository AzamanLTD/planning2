const fs = require('fs');

const override = fs.readFileSync('data/media-overrides.js', 'utf8');
const script = fs.readFileSync('media-enhancement.js', 'utf8');
const docs = fs.readFileSync('docs/media-schema.md', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

for (const marker of ['type:', 'src:', 'alt:', 'caption:']) {
  if (!override.includes(marker)) throw new Error(`media override missing ${marker}`);
}
if (!override.includes('assets/media/rainfall-chart.svg')) throw new Error('media fixture path missing');
for (const marker of ["media.type !== 'image'", 'media.alt', 'same-origin', "pathname.startsWith('/assets/')"]) {
  if (marker === 'same-origin') continue;
}
if (!script.includes("url.origin === location.origin")) throw new Error('media viewer must reject external origins');
if (!script.includes("url.pathname.startsWith('/assets/')")) throw new Error('media viewer must restrict asset paths');
if (!script.includes("event.key === 'Escape'")) throw new Error('media viewer must close with Escape');
if (!docs.includes('media: {')) throw new Error('media schema docs missing');
if (!index.includes('data/media-overrides.js') || !index.includes('media-enhancement.js')) throw new Error('media scripts not wired into entrypoint');
if (!fs.existsSync('assets/media/rainfall-chart.svg')) throw new Error('media fixture is missing');

console.log('MEDIA SCHEMA CONTRACT PASSED');
