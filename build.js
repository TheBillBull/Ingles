// Une src/* en un único docs/index.html (HTML + CSS + JS en línea) para que funcione sin servidor.
const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, 'src', p), 'utf8');
const script = ['data-quiz.js', 'data-reading-listening.js', 'data-writing-speaking.js', 'data-cards.js', 'app.js']
  .map(read)
  .join('\n');

const html = read('template.html')
  .replace('/*STYLE*/', () => read('style.css'))
  .replace('/*SCRIPT*/', () => "(function () {\n'use strict';\n" + script + '\n})();');

fs.mkdirSync(path.join(__dirname, 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'docs', 'index.html'), html);
console.log('docs/index.html', (html.length / 1024).toFixed(1) + ' KB');
