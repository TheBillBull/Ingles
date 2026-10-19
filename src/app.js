/* ===== Utilidades ===== */
const $ = (s, r = document) => r.querySelector(s);
function el(tag, props, ...kids) {
  const n = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (v === true) n.setAttribute(k, '');
      else n.setAttribute(k, v);
    }
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return n;
}
function fmt(text) {
  const frag = document.createDocumentFragment();
  String(text).split('*').forEach((p, i) => { if (p) frag.append(i % 2 ? el('em', null, p) : document.createTextNode(p)); });
  return frag;
}
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pct = (c, t) => (t ? Math.round((100 * c) / t) : 0);
const mmss = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const norm = s => String(s == null ? '' : s).toLowerCase().replace(/[‘’]/g, "'").replace(/[.,;:!?"]+$/g, '').replace(/\s+/g, ' ').trim();
const LETTERS = 'ABCDEFGH';
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ===== Almacenamiento local (con respaldo en memoria) ===== */
const KEY = 'guiri-pass-v1';
const Store = {
  d: {},
  load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { d = null; }
    if (!d || typeof d !== 'object') d = {};
    for (const k of ['q', 'cards', 'listen', 'passage', 'write', 'plan']) if (!d[k] || typeof d[k] !== 'object') d[k] = {};
    if (!d.speak || typeof d.speak !== 'object') d.speak = { n: 0, runs: [] };
    if (!Array.isArray(d.speak.runs)) d.speak.runs = [];
    if (!Array.isArray(d.sims)) d.sims = [];
    this.d = d;
  },
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch (e) { /* sin almacenamiento */ } },
  reset() { try { localStorage.removeItem(KEY); } catch (e) { /* nada */ } this.d = {}; this.load(); }
};
function recQ(id, ok) {
  const s = Store.d.q[id] || (Store.d.q[id] = { a: 0, c: 0, w: false });
  s.a++; if (ok) s.c++; s.w = !ok; s.t = Date.now(); Store.save();
}
function recL(id, ok) {
  const s = Store.d.listen[id] || (Store.d.listen[id] = { a: 0, c: 0 });
  s.a++; if (ok) s.c++; Store.save();
}
const sumStats = obj => Object.values(obj).reduce((a, s) => { a.a += s.a || 0; a.c += s.c || 0; return a; }, { a: 0, c: 0 });

function stamps() {
  const r = sumStats(Store.d.q), l = sumStats(Store.d.listen);
  const wOk = Object.values(Store.d.write).filter(w => w && w.ok).length;
  const known = Object.values(Store.d.cards).filter(c => c && c.b >= 2).length;
  const sp = Store.d.speak.n || 0;
  return [
    { ic: '📖', name: 'Reading', done: r.a >= 15 && pct(r.c, r.a) >= 75, prog: Math.min(1, r.a / 15), hint: `Reading: ${r.a}/15 respuestas, ${pct(r.c, r.a)}% de aciertos (meta 75%)` },
    { ic: '🎧', name: 'Listening', done: l.a >= 8 && pct(l.c, l.a) >= 70, prog: Math.min(1, l.a / 8), hint: `Listening: ${l.a}/8 respuestas, ${pct(l.c, l.a)}% (meta 70%)` },
    { ic: '✍️', name: 'Writing', done: wOk >= 2, prog: Math.min(1, wOk / 2), hint: `Writing: ${wOk}/2 textos completos y casi sin errores` },
    { ic: '🎤', name: 'Speaking', done: sp >= 5, prog: Math.min(1, sp / 5), hint: `Speaking: ${sp}/5 respuestas habladas` },
    { ic: '🃏', name: 'Vocab', done: known >= 40, prog: Math.min(1, known / 40), hint: `Vocabulario: ${known}/40 cartas dominadas` }
  ];
}

/* ===== Voz (Listening) ===== */
const TTS = {
  ok: typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined',
  voices: [], tok: 0, playing: false,
  init() {
    if (!this.ok) return;
    const load = () => { this.voices = (speechSynthesis.getVoices() || []).filter(v => /^en([-_]|$)/i.test(v.lang)); };
    load();
    try { speechSynthesis.addEventListener('voiceschanged', load); } catch (e) { /* nada */ }
  },
  voiceFor(role) {
    const v = this.voices; if (!v.length) return null;
    const gb = v.filter(x => /en[-_]GB/i.test(x.lang));
    const pool = gb.length ? gb : v;
    const fem = /female|zira|samantha|susan|hazel|libby|sonia|karen|serena|victoria|amy|emma|joanna/i;
    const mal = /\bmale\b|david|mark|daniel|george|ryan|alex|oliver|brian|arthur|james/i;
    if (role === 'F') return pool.find(x => fem.test(x.name)) || pool[0];
    if (role === 'M') return pool.find(x => mal.test(x.name)) || pool[Math.min(1, pool.length - 1)];
    return pool[0];
  },
  stop() { this.tok++; this.playing = false; if (this.ok) { try { speechSynthesis.cancel(); } catch (e) { /* nada */ } } },
  play(items, rate, onEnd) {
    this.stop();
    const tok = this.tok; this.playing = true;
    const q = items.slice();
    const same = this.voiceFor('F') === this.voiceFor('M');
    const step = () => {
      if (tok !== this.tok) return;
      const it = q.shift();
      if (!it) { this.playing = false; if (onEnd) onEnd(); return; }
      const u = new SpeechSynthesisUtterance(it.text);
      const v = this.voiceFor(it.role);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
      u.rate = rate;
      u.pitch = (!v || same) ? (it.role === 'F' ? 1.18 : it.role === 'M' ? 0.82 : 1) : 1;
      u.onend = () => setTimeout(step, it.pause || 120);
      u.onerror = () => { if (tok === this.tok) setTimeout(step, 60); };
      speechSynthesis.speak(u);
    };
    setTimeout(step, 90);
  }
};
function ttsItems(item) {
  const out = [];
  item.lines.forEach(line => {
    const role = item.speakers[line.s] || 'F';
    if (line.label) out.push({ text: line.label.replace('Speaker ', 'Speaker number '), role: 'N', pause: 250 });
    const parts = line.t.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [line.t];
    parts.forEach((p, i) => out.push({ text: p.trim(), role, pause: i === parts.length - 1 ? 520 : 90 }));
  });
  return out;
}

/* ===== Corrector de Writing ===== */
const AUX = new Set(['does', 'did', 'do', 'will', 'would', 'can', 'could', 'should', 'must', 'may', 'might', 'let', 'make', 'makes', 'made', 'help', 'helps']);
function analyzeWriting(text, p) {
  const t = text || '';
  const n = (t.match(/[A-Za-z][A-Za-z'’-]*|\d+/g) || []).length;
  const issues = [];
  LINT_RULES.forEach(([re, msg]) => { const m = t.match(re); if (m) issues.push({ snip: m[0].trim(), msg }); });
  const re = /\b(he|she|it)\s+(have|go|do)\b/gi;
  let m;
  while ((m = re.exec(t))) {
    const pw = ((t.slice(Math.max(0, m.index - 14), m.index).match(/(\w+)\s+$/) || [])[1] || '').toLowerCase();
    if (!AUX.has(pw)) issues.push({ snip: m[1] + ' ' + m[2], msg: 'Con he/she/it: "has / goes / does".' });
  }
  const found = LINKERS.filter(l => new RegExp('\\b' + l.replace(/ /g, '\\s+') + '\\b', 'i').test(t));
  const struct = {
    cond: /\bif\b[^.!?]*\b(?:would|could|might|will)\b|\bif\b[^.!?]*['’](?:d|ll)\b/i.test(t),
    passive: /\b(?:is|are|was|were|be|been|being)\s+(?:\w+ed|taken|given|seen|known|written|broken|chosen|driven|eaten|forgotten|hidden|spoken|stolen|worn|made|done|built|held|kept|sold|paid|found|told|left|lost|bought|brought|sent|shown)\b/i.test(t),
    relative: /\b(?:who|whom|whose|which|where)\b/i.test(t),
    contrast: /\b(?:however|although|though|whereas|despite|in spite of|nevertheless|on the other hand|even though)\b/i.test(t)
  };
  const contractions = (t.match(/\b\w+(?:n['’]t|['’](?:m|re|ve|ll|d))\b/gi) || []).length;
  const first = t.trim().slice(0, 40), last = t.trim().slice(-90);
  const formal = p && p.register === 'formal';
  const isEmail = p && p.kind === 'email';
  const greeting = isEmail ? (formal ? /^\s*(?:dear|to whom)/i.test(first) : /^\s*(?:hi|hello|hey|dear)\b/i.test(first)) : null;
  const signoff = isEmail ? /(?:sincerely|faithfully|regards|best wishes|take care|cheers|love|see you|write soon|all the best|looking forward)/i.test(last) : null;
  const tips = [];
  if (formal && contractions > 0) tips.push('Registro formal: evita contracciones (' + contractions + ' encontradas). Escribe "I am", "do not"…');
  if (p && p.register === 'informal' && n >= 30 && contractions === 0) tips.push('Registro informal: algunas contracciones (I\'m, don\'t) suenan más natural.');
  if (p && p.part === 2 && n >= 60 && found.length < 4) tips.push('Usa más conectores variados (ahora ' + found.length + '). Meta: 4 o más.');
  if (p && p.part === 1 && n >= 30 && found.length < 2) tips.push('Añade 2 conectores sencillos (because, so, also, however).');
  if (n >= 50 && !isEmail && !/[.!?]\s*$/.test(t.trim())) tips.push('Termina la última frase con punto.');
  const long = t.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length > 35).length;
  if (long) tips.push('Hay ' + long + ' frase(s) muy larga(s). Divídelas para evitar errores.');
  return { n, min: p ? p.min : 0, issues, tips, found, struct, contractions, greeting, signoff, ok: !!p && n >= p.min && issues.length <= 2 };
}

/* ===== Análisis de Speaking ===== */
function analyzeSpeech(text, secs) {
  const words = (text.toLowerCase().match(/[a-z']+/g) || []);
  const n = words.length;
  const fill = FILLERS.map(f => [f, (text.toLowerCase().match(new RegExp('\\b' + f + '\\b', 'g')) || []).length]).filter(x => x[1] > 0);
  const linkers = LINKERS.filter(l => new RegExp('\\b' + l.replace(/ /g, '\\s+') + '\\b', 'i').test(text));
  return {
    n, wpm: secs > 0 ? Math.round((n / secs) * 60) : 0, fill, linkers,
    hasReason: /\b(because|since|so that|that's why|the reason)\b/i.test(text),
    hasExample: /\b(for example|for instance|such as|last (?:week|year|summer|weekend|month)|once|one day|when i was)\b/i.test(text),
    uniq: new Set(words).size
  };
}

/* ===== Enrutado ===== */
let route = { name: 'home' };
let cleanups = [];
let deferredInstall = null;
function onLeave(fn) { cleanups.push(fn); }
function go(r) {
  cleanups.forEach(f => { try { f(); } catch (e) { /* nada */ } });
  cleanups = [];
  TTS.stop();
  route = r;
  render();
  window.scrollTo(0, 0);
}
const VIEWS = {};
function render() {
  const main = $('#main');
  main.replaceChildren(VIEWS[route.name](route));
  const tab = { home: 'home', quiz: 'quiz', 'quiz-run': 'quiz', 'quiz-end': 'quiz', passage: 'quiz', listen: 'listen', 'listen-item': 'listen', write: 'write', 'write-edit': 'write', speak: 'speak', 'speak-run': 'speak', cards: 'cards', 'cards-run': 'cards', 'cards-end': 'cards' }[route.name];
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
}
const header = (title, sub) => el('div', { class: 'hdr' }, el('div', { class: 'logo' }, 'GP'), el('div', null, el('h1', null, title), sub && el('p', null, sub)));
const back = (to, label) => el('button', { class: 'btn small ghost', onclick: () => go(to) }, '← ' + (label || 'Volver'));

/* ===== Conjunto de preguntas reutilizable (Listening y lecturas) ===== */
function isOk(q, a) {
  if (q.type === 'mc') return a === q.ans;
  if (q.type === 'gap') return q.answers.map(norm).includes(norm(a));
  return q.ans.map((x, k) => !!a && a[k] === x);
}
function qset(qs, st, rerender) {
  const wrap = el('div');
  qs.forEach((q, i) => {
    const card = el('div', { class: 'card' });
    card.append(el('span', { class: 'chip plain' }, 'Pregunta ' + (i + 1)), el('p', { class: 'q' }, q.q));
    if (q.type === 'mc') {
      const box = el('div', { class: 'opts' });
      q.opts.forEach((o, j) => {
        let cls = 'opt';
        if (st.checked) cls += j === q.ans ? ' correct' : (st.ans[i] === j ? ' wrong' : '');
        else if (st.ans[i] === j) cls += ' sel';
        box.append(el('button', { class: cls, disabled: st.checked, onclick: () => { st.ans[i] = j; rerender(); } }, el('b', null, LETTERS[j]), el('span', null, o)));
      });
      card.append(box);
    } else if (q.type === 'gap') {
      const inp = el('input', { type: 'text', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', placeholder: 'Escribe la palabra…', value: st.ans[i] || '', disabled: st.checked, 'aria-label': 'Respuesta ' + (i + 1) });
      inp.addEventListener('input', () => { st.ans[i] = inp.value; });
      card.append(el('div', { style: 'margin-top:10px' }, inp));
    } else {
      st.ans[i] = st.ans[i] || [];
      q.ans.forEach((correct, k) => {
        const sel = el('select', { disabled: st.checked, 'aria-label': 'Speaker ' + (k + 1) }, el('option', { value: '' }, '— elige —'), q.opts.map((o, j) => el('option', { value: LETTERS[j], selected: st.ans[i][k] === LETTERS[j] }, LETTERS[j] + ' · ' + o)));
        sel.addEventListener('change', () => { st.ans[i][k] = sel.value; });
        const row = el('div', { class: 'match-row' }, el('label', null, 'Speaker ' + (k + 1)), sel);
        if (st.checked) row.append(el('span', { class: 'chip ' + (st.ans[i][k] === correct ? 'ok' : 'bad') }, st.ans[i][k] === correct ? '✓' : '✗ ' + correct));
        card.append(row);
      });
    }
    if (st.checked) {
      const ok = isOk(q, st.ans[i]);
      if (q.type === 'match') {
        card.append(el('div', { class: 'fb ok' }, el('b', null, 'Por qué:'), el('ul', { style: 'margin:4px 0 0 18px;padding:0' }, q.why.map((w, k) => el('li', null, 'Speaker ' + (k + 1) + ' → ' + q.ans[k] + ': ', fmt(w))))));
      } else {
        card.append(el('div', { class: 'fb ' + (ok ? 'ok' : 'bad') }, el('b', null, ok ? '✓ Correcto' : '✗ Respuesta: ' + (q.type === 'mc' ? q.opts[q.ans] : q.answers[0])), fmt(q.why)));
      }
    }
    wrap.append(card);
  });
  return wrap;
}
function checkQset(qs, st, prefix, rec) {
  let c = 0, t = 0;
  qs.forEach((q, i) => {
    const ok = isOk(q, st.ans[i]);
    if (q.type === 'match') ok.forEach((o, k) => { t++; if (o) c++; rec(prefix + i + '-' + k, o); });
    else { t++; if (ok) c++; rec(prefix + i, ok); }
  });
  st.checked = true; st.score = { c, t };
  return st.score;
}
const scoreBadge = s => el('div', { class: 'card tight row between' }, el('div', null, el('span', { class: 'score' }, s.c + '/' + s.t), el('span', { class: 'muted' }, '  ' + pct(s.c, s.t) + '%')), pct(s.c, s.t) >= 75 ? el('span', { class: 'stamp' }, 'Aprobado') : el('span', { class: 'chip warn' }, 'Repásalo y repite'));

/* ===== Home ===== */
VIEWS.home = function () {
  const root = el('div');
  root.append(header('Guiri Pass', 'Entrena. Aprueba. Sella el pasaporte.'));
  const st = stamps();
  const done = st.filter(s => s.done).length;
  root.append(el('div', { class: 'card' },
    el('div', { class: 'row between' }, el('h2', null, '🛂 Pasaporte guiri'), el('span', { class: 'chip ' + (done === 5 ? 'ok' : 'plain') }, done + '/5 sellos')),
    el('p', { class: 'muted small' }, done === 5 ? '¡Pasaporte concedido! Estás listo para mañana.' : 'Consigue los 5 sellos practicando. Cada uno tiene una meta.'),
    el('div', { class: 'passport' }, st.map(s => el('div', { class: 'stampbox' + (s.done ? ' done' : '') }, el('span', { class: 'ic' }, s.ic), el('span', null, s.name), el('div', { class: 'bar' + (s.done ? ' ok' : '') }, el('i', { style: 'width:' + Math.round(s.prog * 100) + '%' }))))),
    el('div', { class: 'small muted', style: 'margin-top:10px' }, st.map(s => el('div', null, (s.done ? '✓ ' : '· ') + s.hint)))
  ));
  const wrong = QUIZ.filter(q => Store.d.q[q.id] && Store.d.q[q.id].w);
  const due = DECKS.reduce((n, d) => n + d.cards.filter((c, i) => { const s = Store.d.cards[d.id + ':' + i]; return !s || s.d <= Date.now(); }).length, 0);
  root.append(el('div', { class: 'card' },
    el('h2', null, 'Empieza ya'),
    el('div', { class: 'grid2' },
      el('button', { class: 'btn primary', onclick: () => startQuiz(pickSim(), { title: 'Simulacro express', exam: true, limit: 900 }) }, '⏱️ Simulacro express'),
      el('button', { class: 'btn', disabled: !wrong.length, onclick: () => startQuiz(shuffle(wrong), { title: 'Repaso de fallos' }) }, '🔁 Mis fallos (' + wrong.length + ')'),
      el('button', { class: 'btn', onclick: () => go({ name: 'cards' }) }, '🃏 Cartas (' + due + ')'),
      el('button', { class: 'btn', onclick: () => go({ name: 'speak' }) }, '🎤 Hablar 1 minuto'))
  ));
  const plan = el('div', { class: 'card' }, el('h2', null, '✅ Plan de esta noche'));
  PLAN.forEach((t, i) => {
    const cb = el('input', { type: 'checkbox', id: 'plan' + i });
    cb.checked = !!Store.d.plan[i];
    const row = el('label', { class: 'todo' + (cb.checked ? ' done' : ''), for: 'plan' + i }, cb, el('span', null, t));
    cb.addEventListener('change', () => { Store.d.plan[i] = cb.checked; Store.save(); row.classList.toggle('done', cb.checked); });
    plan.append(row);
  });
  root.append(plan);
  const ch = el('div', null, el('h2', null, '📌 Chuleta rápida'));
  CHEATS.forEach(([title, items]) => ch.append(el('details', null, el('summary', null, title), el('ul', null, items.map(i => el('li', null, fmt(i)))))));
  root.append(ch);
  const foot = el('div', { class: 'row wrap', style: 'margin-top:14px' });
  if (deferredInstall) foot.append(el('button', { class: 'btn small', onclick: async () => { deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) { /* nada */ } deferredInstall = null; render(); } }, '📲 Instalar app'));
  foot.append(el('button', { class: 'btn small ghost', onclick: () => { if (confirm('¿Borrar todo tu progreso en este dispositivo?')) { Store.reset(); render(); } } }, 'Borrar progreso'));
  root.append(foot, el('p', { class: 'muted small' }, 'Tu progreso se guarda solo en este dispositivo. Preguntas y textos originales para practicar; no son del examen oficial.'));
  return root;
};

/* ===== Quiz ===== */
function pickSim() {
  const by = {};
  shuffle(QUIZ).forEach(q => (by[q.topic] = by[q.topic] || []).push(q));
  const keys = shuffle(Object.keys(by)), out = [];
  while (out.length < 20) {
    let added = false;
    for (const k of keys) { if (by[k].length && out.length < 20) { out.push(by[k].pop()); added = true; } }
    if (!added) break;
  }
  return shuffle(out);
}
function startQuiz(items, o) {
  go({ name: 'quiz-run', items, i: 0, res: [], title: o.title, exam: !!o.exam, limit: o.limit || 0, t0: Date.now(), fb: null });
}
VIEWS.quiz = function () {
  const root = el('div');
  root.append(header('Reading y Use of English', 'Gramática, vocabulario y textos con corrección'));
  root.append(el('div', { class: 'card' }, el('h2', null, '⏱️ Simulacro express'), el('p', { class: 'muted' }, '20 preguntas mezcladas en 15 minutos. Sin pistas hasta el final, como en el examen.'), el('button', { class: 'btn primary block', onclick: () => startQuiz(pickSim(), { title: 'Simulacro express', exam: true, limit: 900 }) }, 'Empezar simulacro')));
  const wrong = QUIZ.filter(q => Store.d.q[q.id] && Store.d.q[q.id].w);
  if (wrong.length) root.append(el('div', { class: 'card' }, el('h2', null, '🔁 Mis fallos'), el('p', { class: 'muted' }, wrong.length + ' pregunta(s) que fallaste la última vez.'), el('button', { class: 'btn block', onclick: () => startQuiz(shuffle(wrong), { title: 'Repaso de fallos' }) }, 'Repasar ahora')));
  root.append(el('h2', null, '📚 Textos de lectura'));
  PASSAGES.forEach(p => {
    const s = Store.d.passage[p.id];
    root.append(el('button', { class: 'item', onclick: () => go({ name: 'passage', p, st: { ans: [], checked: false } }) }, el('div', { class: 'grow' }, el('b', null, p.title), el('span', { class: 'muted small' }, p.type === 'gapped' ? 'Frases en los huecos' : 'Comprensión · ' + p.qs.length + ' preguntas')), el('span', { class: 'chip' }, p.level), s ? el('span', { class: 'chip ok' }, s.c + '/' + s.t) : null));
  });
  root.append(el('h2', { style: 'margin-top:16px' }, '🎯 Por tema'));
  Object.keys(TOPICS).forEach(k => {
    const items = QUIZ.filter(q => q.topic === k);
    const st = sumStats(Object.fromEntries(items.filter(q => Store.d.q[q.id]).map(q => [q.id, Store.d.q[q.id]])));
    root.append(el('button', { class: 'item', onclick: () => startQuiz(shuffle(items), { title: TOPICS[k] }) }, el('div', { class: 'grow' }, el('b', null, TOPICS[k]), el('div', { class: 'bar', style: 'margin-top:6px' }, el('i', { style: 'width:' + pct(st.c, st.a) + '%' }))), el('span', { class: 'muted small' }, st.a ? pct(st.c, st.a) + '%' : items.length + ' pregs.')));
  });
  return root;
};
function finishQuiz(r) {
  for (let k = r.res.length; k < r.items.length; k++) r.res.push({ it: r.items[k], val: null, ok: false, skipped: true });
  if (r.exam) { Store.d.sims.push({ t: Date.now(), c: r.res.filter(x => x.ok).length, n: r.res.length }); Store.save(); }
  go({ name: 'quiz-end', r });
}
function checkItem(it, val) { return it.type === 'mc' ? val === it.ans : it.answers.map(norm).includes(norm(val)); }
function answerQuiz(r, val) {
  const it = r.items[r.i];
  const ok = checkItem(it, val);
  r.res.push({ it, val, ok });
  recQ(it.id, ok);
  if (r.exam) nextQuiz(r); else { r.fb = { ok, val }; render(); }
}
function nextQuiz(r) {
  r.i++; r.fb = null;
  if (r.i >= r.items.length) finishQuiz(r); else render();
}
VIEWS['quiz-run'] = function (r) {
  const it = r.items[r.i];
  const root = el('div');
  const tm = r.limit ? el('span', { class: 'chip warn', id: 'qtimer' }, '⏱ ' + mmss(r.limit - (Date.now() - r.t0) / 1000)) : null;
  if (tm && !r.iv) {
    r.iv = setInterval(() => {
      const left = r.limit - (Date.now() - r.t0) / 1000;
      const node = $('#qtimer');
      if (node) node.textContent = '⏱ ' + mmss(left);
      if (left <= 0) { clearInterval(r.iv); finishQuiz(r); }
    }, 500);
    onLeave(() => clearInterval(r.iv));
  }
  root.append(el('div', { class: 'row between', style: 'margin-bottom:10px' }, back({ name: 'quiz' }, 'Salir'), tm));
  root.append(el('div', { class: 'row between' }, el('strong', null, r.title), el('span', { class: 'muted small' }, (r.i + 1) + ' / ' + r.items.length)));
  root.append(el('div', { class: 'bar', style: 'margin:6px 0 12px' }, el('i', { style: 'width:' + (100 * r.i / r.items.length) + '%' })));
  const card = el('div', { class: 'card' });
  card.append(el('div', { class: 'row' }, el('span', { class: 'chip' }, TOPICS[it.topic]), el('span', { class: 'chip plain' }, it.level)));
  card.append(el('p', { class: 'q' }, it.q));
  if (it.type === 'mc') {
    const box = el('div', { class: 'opts' });
    it.opts.forEach((o, j) => {
      let cls = 'opt';
      if (r.fb) cls += j === it.ans ? ' correct' : (j === r.fb.val ? ' wrong' : '');
      box.append(el('button', { class: cls, disabled: !!r.fb, onclick: () => answerQuiz(r, j) }, el('b', null, LETTERS[j]), el('span', null, o)));
    });
    card.append(box);
  } else {
    const inp = el('input', { type: 'text', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', placeholder: 'Escribe la palabra o palabras…', disabled: !!r.fb, value: r.fb ? String(r.fb.val || '') : '', 'aria-label': 'Respuesta' });
    const go1 = () => { if (inp.value.trim()) answerQuiz(r, inp.value); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go1(); });
    card.append(el('div', { style: 'margin-top:12px' }, inp));
    if (!r.fb) { card.append(el('button', { class: 'btn primary block', style: 'margin-top:10px', onclick: go1 }, r.exam ? 'Siguiente' : 'Comprobar')); setTimeout(() => inp.focus(), 50); }
  }
  if (r.fb) {
    card.append(el('div', { class: 'fb ' + (r.fb.ok ? 'ok' : 'bad'), role: 'status' }, el('b', null, r.fb.ok ? '✓ Correcto' : '✗ Respuesta correcta: ' + (it.type === 'mc' ? it.opts[it.ans] : it.answers[0])), fmt(it.why)));
    card.append(el('button', { class: 'btn primary block', style: 'margin-top:10px', onclick: () => nextQuiz(r) }, r.i + 1 >= r.items.length ? 'Ver resultado' : 'Siguiente'));
  }
  root.append(card);
  return root;
};
VIEWS['quiz-end'] = function (route0) {
  const r = route0.r;
  const c = r.res.filter(x => x.ok).length, t = r.res.length;
  const root = el('div');
  root.append(header('Resultado', r.title));
  root.append(el('div', { class: 'card', style: 'text-align:center' }, el('div', { class: 'score' }, c + ' / ' + t), el('p', { class: 'muted' }, pct(c, t) + '% de aciertos'), pct(c, t) >= 75 ? el('span', { class: 'stamp' }, 'Aprobado') : el('span', { class: 'chip warn' }, 'Casi: repasa tus fallos')));
  const wrong = r.res.filter(x => !x.ok);
  if (wrong.length) {
    root.append(el('div', { class: 'row wrap', style: 'margin-bottom:10px' }, el('button', { class: 'btn primary', onclick: () => startQuiz(shuffle(wrong.map(x => x.it)), { title: 'Repaso de fallos' }) }, '🔁 Repetir fallos (' + wrong.length + ')'), el('button', { class: 'btn', onclick: () => go({ name: 'quiz' }) }, 'Menú')));
    root.append(el('h2', null, 'Revisa lo que fallaste'));
    wrong.forEach(x => {
      const it = x.it;
      root.append(el('div', { class: 'card' }, el('p', { class: 'q' }, it.q), el('p', { class: 'small' }, x.skipped ? 'Sin contestar' : 'Tu respuesta: ' + (it.type === 'mc' ? it.opts[x.val] : x.val)), el('div', { class: 'fb ok' }, el('b', null, '✓ ' + (it.type === 'mc' ? it.opts[it.ans] : it.answers[0])), fmt(it.why))));
    });
  } else root.append(el('button', { class: 'btn primary block', onclick: () => go({ name: 'quiz' }) }, 'Volver al menú'));
  return root;
};

/* ===== Textos de lectura ===== */
VIEWS.passage = function (r) {
  const p = r.p, st = r.st;
  const root = el('div');
  root.append(el('div', { style: 'margin-bottom:10px' }, back({ name: 'quiz' })), el('h1', null, p.title), el('p', { class: 'muted small' }, '💡 ' + p.tip));
  if (p.type === 'mc') {
    root.append(el('div', { class: 'passage' }, p.text.join('\n\n')));
    const qs = p.qs.map(q => Object.assign({ type: 'mc' }, q));
    if (st.checked) root.append(scoreBadge(st.score));
    root.append(qset(qs, st, render));
    if (!st.checked) root.append(el('button', { class: 'btn primary block', disabled: false, onclick: () => { const s = checkQset(qs, st, p.id + '-', recQ); Store.d.passage[p.id] = { c: s.c, t: s.t }; Store.save(); render(); } }, 'Comprobar respuestas'));
  } else {
    root.append(el('ul', { class: 'sentlist' }, Object.entries(p.sentences).map(([k, v]) => el('li', null, el('b', null, k), el('span', null, v)))));
    const box = el('div', { class: 'passage' });
    p.text.forEach((para, pi) => {
      if (pi) box.append('\n\n');
      para.split(/\{(\d)\}/).forEach((seg, k) => {
        if (k % 2 === 0) { box.append(seg); return; }
        const n = +seg, gap = p.gaps.find(g => g.n === n);
        const sel = el('select', { disabled: st.checked, 'aria-label': 'Hueco ' + n }, el('option', { value: '' }, '(' + n + ')'), Object.keys(p.sentences).map(L => el('option', { value: L, selected: st.ans[n] === L }, L)));
        sel.addEventListener('change', () => { st.ans[n] = sel.value; });
        if (st.checked) sel.style.borderColor = st.ans[n] === gap.ans ? 'var(--ok)' : 'var(--bad)';
        box.append(sel);
      });
    });
    root.append(box);
    if (st.checked) {
      root.append(scoreBadge(st.score));
      p.gaps.forEach(g => { const ok = st.ans[g.n] === g.ans; root.append(el('div', { class: 'fb ' + (ok ? 'ok' : 'bad'), style: 'margin-bottom:8px' }, el('b', null, 'Hueco ' + g.n + ': ' + (ok ? '✓ ' : '✗ era ') + g.ans), fmt(g.why))); });
    } else {
      root.append(el('button', { class: 'btn primary block', onclick: () => {
        let c = 0; p.gaps.forEach(g => { const ok = st.ans[g.n] === g.ans; if (ok) c++; recQ(p.id + '-' + g.n, ok); });
        st.checked = true; st.score = { c, t: p.gaps.length }; Store.d.passage[p.id] = { c, t: p.gaps.length }; Store.save(); render();
      } }, 'Comprobar respuestas'));
    }
  }
  return root;
};

/* ===== Listening ===== */
VIEWS.listen = function () {
  const root = el('div');
  root.append(header('Listening', 'La app lee los guiones con voz en inglés'));
  if (!TTS.ok) root.append(el('div', { class: 'fb bad' }, el('b', null, 'Sin voz disponible'), 'Tu navegador no tiene síntesis de voz. Podrás leer la transcripción después de contestar.'));
  root.append(el('p', { class: 'muted' }, 'Lee las preguntas antes, escucha (en modo examen solo 2 veces) y contesta. Al comprobar verás el guion y la explicación.'));
  LISTENING.forEach(it => {
    const done = Object.keys(Store.d.listen).filter(k => k.startsWith(it.id + ':')).length;
    root.append(el('button', { class: 'item', onclick: () => go({ name: 'listen-item', it, st: { ans: [], checked: false }, plays: 0, rate: 1, exam: true }) }, el('div', { class: 'grow' }, el('b', null, it.title), el('span', { class: 'muted small' }, it.qs.reduce((n, q) => n + (q.type === 'match' ? q.ans.length : 1), 0) + ' preguntas')), el('span', { class: 'chip' }, it.level), done ? el('span', { class: 'chip ok' }, '✓') : null));
  });
  return root;
};
VIEWS['listen-item'] = function (r) {
  const it = r.it, st = r.st;
  const root = el('div');
  root.append(el('div', { style: 'margin-bottom:10px' }, back({ name: 'listen' })), el('h1', null, it.title));
  const player = el('div', { class: 'card' });
  const maxPlays = 2;
  const btn = el('button', { class: 'btn primary block' });
  const info = el('p', { class: 'muted small', style: 'margin:8px 0 0' });
  const refreshBtn = () => {
    const left = r.exam ? maxPlays - r.plays : null;
    btn.textContent = TTS.playing ? '⏹ Parar' : (left === 0 ? 'Sin reproducciones' : '▶ Escuchar' + (left != null ? ' (quedan ' + left + ')' : ''));
    btn.disabled = !TTS.ok || (!TTS.playing && left === 0);
  };
  btn.addEventListener('click', () => {
    if (TTS.playing) { TTS.stop(); refreshBtn(); return; }
    if (r.exam) r.plays++;
    TTS.play(ttsItems(it), r.rate, () => { if (r.refresh) r.refresh(); });
    refreshBtn();
  });
  r.refresh = refreshBtn;
  refreshBtn();
  const rateSel = el('select', { 'aria-label': 'Velocidad' }, [[0.8, 'Lenta'], [0.9, 'Algo lenta'], [1, 'Normal'], [1.1, 'Rápida']].map(([v, l]) => el('option', { value: v, selected: v === r.rate }, l)));
  rateSel.addEventListener('change', () => { r.rate = +rateSel.value; });
  const exam = el('input', { type: 'checkbox', id: 'exm' }); exam.checked = r.exam;
  exam.addEventListener('change', () => { r.exam = exam.checked; refreshBtn(); });
  player.append(btn, el('div', { class: 'row wrap', style: 'margin-top:10px' }, el('label', { class: 'row small', for: 'exm' }, exam, 'Modo examen (2 escuchas)'), el('span', { class: 'grow' }), rateSel), info);
  if (!TTS.ok) info.textContent = 'Sin voz en este navegador: contesta con la transcripción al comprobar.';
  else if (!TTS.voices.length) info.textContent = 'Si no oyes nada, comprueba el volumen o instala una voz en inglés en los ajustes del dispositivo.';
  onLeave(() => TTS.stop());
  root.append(player);
  root.append(qset(it.qs, st, render));
  if (!st.checked) {
    root.append(el('button', { class: 'btn primary block', onclick: () => { TTS.stop(); const s = checkQset(it.qs, st, it.id + ':', recL); r.score = s; render(); } }, 'Comprobar respuestas'));
  } else {
    root.append(scoreBadge(st.score));
    root.append(el('details', { open: true }, el('summary', null, 'Transcripción'), el('div', { class: 'transcript' }, it.lines.map(l => (l.label ? l.label + ': ' : '') + l.t).join('\n\n'))));
    root.append(el('div', { class: 'row wrap', style: 'margin-top:10px' }, el('button', { class: 'btn', onclick: () => go({ name: 'listen-item', it, st: { ans: [], checked: false }, plays: 0, rate: r.rate, exam: r.exam }) }, '↺ Repetir'), el('button', { class: 'btn', onclick: () => go({ name: 'listen' }) }, 'Otro audio')));
  }
  return root;
};

/* ===== Writing ===== */
VIEWS.write = function () {
  const root = el('div');
  root.append(header('Writing', 'Editor con corrector de errores típicos'));
  root.append(el('p', { class: 'muted' }, 'Escribe como en el examen. El corrector cuenta palabras, comprueba conectores y estructuras B2, y detecta errores típicos de hispanohablantes.'));
  [1, 2].forEach(part => {
    root.append(el('h2', { style: 'margin-top:14px' }, part === 1 ? 'Parte 1 · Email corto (≥ 50 palabras)' : 'Parte 2 · Texto largo (≥ 180 palabras)'));
    WRITING.filter(w => w.part === part).forEach(w => {
      const s = Store.d.write[w.id];
      root.append(el('button', { class: 'item', onclick: () => go({ name: 'write-edit', w }) }, el('div', { class: 'grow' }, el('b', null, w.title), el('span', { class: 'muted small' }, w.kind + ' · ' + w.register)), s && s.ok ? el('span', { class: 'chip ok' }, '✓') : (s && s.text ? el('span', { class: 'chip warn' }, 'borrador') : null)));
    });
  });
  return root;
};
function insertAtCursor(ta, txt) {
  const s = ta.selectionStart == null ? ta.value.length : ta.selectionStart, e = ta.selectionEnd == null ? s : ta.selectionEnd;
  const before = ta.value.slice(0, s), after = ta.value.slice(e);
  const sp = before && !/\s$/.test(before) ? ' ' : '';
  ta.value = before + sp + txt + ' ' + after;
  const pos = (before + sp + txt + ' ').length;
  ta.focus(); try { ta.setSelectionRange(pos, pos); } catch (err) { /* nada */ }
  ta.dispatchEvent(new Event('input'));
}
VIEWS['write-edit'] = function (r) {
  const w = r.w;
  const root = el('div');
  root.append(el('div', { style: 'margin-bottom:10px' }, back({ name: 'write' })), el('h1', null, w.title));
  const saved = Store.d.write[w.id] || {};
  const checks = saved.pts || [false, false, false];
  root.append(el('div', { class: 'card' },
    el('div', { class: 'row' }, el('span', { class: 'chip' }, 'Parte ' + w.part), el('span', { class: 'chip plain' }, w.kind), el('span', { class: 'chip plain' }, w.register)),
    el('p', { class: 'q', style: 'font-size:1rem' }, w.brief),
    el('p', { class: 'small muted', style: 'margin:6px 0 2px' }, 'Cubre los tres puntos (marca cada uno al terminarlo):'),
    w.points.map((pt, i) => { const cb = el('input', { type: 'checkbox', id: 'pt' + i }); cb.checked = !!checks[i]; cb.addEventListener('change', () => { checks[i] = cb.checked; save(); }); return el('label', { class: 'todo', for: 'pt' + i }, cb, el('span', null, pt)); })
  ));
  /* temporizador */
  const timer = el('span', { class: 'chip warn' }, '⏱ ' + (w.part === 1 ? '15:00' : '25:00'));
  let left = (w.part === 1 ? 15 : 25) * 60, iv = null;
  const tBtn = el('button', { class: 'btn small', onclick: () => {
    if (iv) { clearInterval(iv); iv = null; tBtn.textContent = '▶ Reanudar'; return; }
    iv = setInterval(() => { left--; timer.textContent = '⏱ ' + mmss(left); if (left <= 0) { clearInterval(iv); iv = null; tBtn.textContent = 'Tiempo'; } }, 1000);
    tBtn.textContent = '⏸ Pausa';
  } }, '▶ Cronómetro');
  onLeave(() => { if (iv) clearInterval(iv); });
  const ta = el('textarea', { class: 'editor', placeholder: 'Escribe aquí tu respuesta…', spellcheck: 'false', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'sentences', 'aria-label': 'Tu texto' });
  ta.value = saved.text || '';
  const out = el('div');
  let timeout = null;
  function save() { const a = analyzeWriting(ta.value, w); const was = Store.d.write[w.id] && Store.d.write[w.id].ok; Store.d.write[w.id] = { text: ta.value, pts: checks, ok: !!(was || (a.ok && checks.every(Boolean))), n: a.n }; Store.save(); }
  function draw() {
    const a = analyzeWriting(ta.value, w);
    const enough = a.n >= a.min;
    out.replaceChildren(...[
      el('div', { class: 'stats' },
        el('div', { class: 'stat ' + (enough ? 'ok' : '') }, el('b', null, a.n + ' / ' + a.min), el('span', null, 'palabras')),
        el('div', { class: 'stat ' + (a.found.length >= (w.part === 2 ? 4 : 2) ? 'ok' : '') }, el('b', null, a.found.length), el('span', null, 'conectores')),
        el('div', { class: 'stat ' + (a.issues.length ? 'bad' : (a.n > 20 ? 'ok' : '')) }, el('b', null, a.issues.length), el('span', null, 'errores típicos'))),
      el('div', { class: 'bar ' + (enough ? 'ok' : ''), style: 'margin-bottom:10px' }, el('i', { style: 'width:' + Math.min(100, pct(a.n, a.min)) + '%' })),
      w.part === 2 ? el('div', { class: 'small', style: 'margin-bottom:8px' }, [['cond', 'condicional'], ['passive', 'pasiva'], ['relative', 'relativo'], ['contrast', 'contraste']].map(([k, l]) => el('span', { class: 'chip ' + (a.struct[k] ? 'ok' : 'plain'), style: 'margin:0 4px 4px 0' }, (a.struct[k] ? '✓ ' : '○ ') + l))) : null,
      w.kind === 'email' && a.n > 5 ? el('div', { class: 'small', style: 'margin-bottom:8px' }, el('span', { class: 'chip ' + (a.greeting ? 'ok' : 'warn'), style: 'margin-right:4px' }, a.greeting ? '✓ saludo' : '○ falta saludo'), el('span', { class: 'chip ' + (a.signoff ? 'ok' : 'warn') }, a.signoff ? '✓ despedida' : '○ falta despedida')) : null,
      a.issues.slice(0, 8).map(i => el('div', { class: 'issue' }, '⚠️', el('div', null, el('code', null, i.snip), ' → ', fmt(i.msg)))),
      a.tips.map(t => el('div', { class: 'issue tip' }, '💡', el('div', null, t))),
      !a.issues.length && a.n > 20 ? el('div', { class: 'fb ok' }, '✓ No detecto errores típicos. Revisa igualmente tiempos y ortografía.') : null
    ].flat().filter(Boolean));
  }
  ta.addEventListener('input', () => { draw(); clearTimeout(timeout); timeout = setTimeout(save, 400); });
  const bank = PHRASES[w.register === 'informal' ? 'informal' : 'formal'];
  const tabsBox = el('div', { class: 'tabs' }), phrBox = el('div', { class: 'phr' });
  let cur = Object.keys(bank)[0];
  function drawBank() {
    tabsBox.replaceChildren(...Object.keys(bank).map(k => el('button', { class: k === cur ? 'on' : '', onclick: () => { cur = k; drawBank(); } }, k)));
    phrBox.replaceChildren(...bank[cur].map(ph => el('button', { onclick: () => insertAtCursor(ta, ph) }, ph)));
  }
  drawBank();
  root.append(el('div', { class: 'row between', style: 'margin-bottom:8px' }, timer, tBtn), el('details', null, el('summary', null, '📎 Frases útiles (toca para insertar)'), tabsBox, phrBox), ta, out);
  root.append(el('div', { class: 'row wrap', style: 'margin-top:10px' },
    el('button', { class: 'btn small', onclick: async () => { try { await navigator.clipboard.writeText(ta.value); alert('Copiado. Pégalo en el chat para que te lo corrija.'); } catch (e) { ta.select(); } } }, '📋 Copiar texto'),
    el('button', { class: 'btn small ghost', onclick: () => { if (confirm('¿Borrar este borrador?')) { ta.value = ''; draw(); save(); } } }, 'Borrar')));
  draw();
  return root;
};

/* ===== Speaking ===== */
const SRC = window.SpeechRecognition || window.webkitSpeechRecognition;
VIEWS.speak = function (r) {
  const root = el('div');
  root.append(header('Speaking', 'Responde en voz alta, con tiempo'));
  root.append(el('div', { class: 'card' }, el('p', { style: 'margin:0' }, fmt('*' + SPEAK_TIPS.split(':')[0] + ':*' + SPEAK_TIPS.split(':').slice(1).join(':')))));
  const cats = ['Todas', ...Array.from(new Set(SPEAKING.map(s => s.cat)))];
  const cat = r.cat || 'Todas';
  root.append(el('div', { class: 'tabs' }, cats.map(c => el('button', { class: c === cat ? 'on' : '', onclick: () => go({ name: 'speak', cat: c }) }, c))));
  const list = SPEAKING.filter(s => cat === 'Todas' || s.cat === cat);
  root.append(el('button', { class: 'btn primary block', style: 'margin-bottom:10px', onclick: () => go({ name: 'speak-run', q: list[Math.floor(Math.random() * list.length)], limit: 45 }) }, '🎲 Pregunta al azar'));
  list.forEach(q => root.append(el('button', { class: 'item', onclick: () => go({ name: 'speak-run', q, limit: 45 }) }, el('div', { class: 'grow' }, q.scene ? el('div', null, q.scene) : null, q.q), el('span', { class: 'chip plain' }, q.cat))));
  return root;
};
VIEWS['speak-run'] = function (r) {
  const q = r.q;
  const root = el('div');
  root.append(el('div', { style: 'margin-bottom:10px' }, back({ name: 'speak', cat: 'Todas' })));
  const card = el('div', { class: 'card' }, el('span', { class: 'chip' }, q.cat), q.scene ? el('div', { class: 'scene' }, q.scene) : null, el('p', { class: 'q' }, q.q));
  root.append(card);
  const box = el('div');
  root.append(box);
  const st = { phase: 'ready', mode: SRC ? 'transcribe' : 'record', limit: r.limit, base: '', fin: '', interim: '', audioUrl: null, secs: 0, micErr: false };
  let tick = null, rec = null, mr = null, stream = null, chunks = [];
  const text = () => (st.base + ' ' + st.fin + ' ' + st.interim).replace(/\s+/g, ' ').trim();
  function cleanup() {
    if (tick) { clearInterval(tick); tick = null; }
    st.phase = st.phase === 'rec' ? 'done' : st.phase;
    if (rec) { try { rec.onend = null; rec.stop(); } catch (e) { /* nada */ } rec = null; }
    if (mr && mr.state !== 'inactive') { try { mr.stop(); } catch (e) { /* nada */ } }
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  }
  onLeave(cleanup);
  function draw() {
    if (st.phase === 'ready') {
      const modeRow = SRC ? el('div', { class: 'tabs' },
        el('button', { class: st.mode === 'transcribe' ? 'on' : '', onclick: () => { st.mode = 'transcribe'; draw(); } }, '📝 Transcribir y analizar'),
        el('button', { class: st.mode === 'record' ? 'on' : '', onclick: () => { st.mode = 'record'; draw(); } }, '🔊 Grabar mi voz')) : el('p', { class: 'muted small' }, 'Este navegador no transcribe voz: se grabará tu audio para que te escuches.');
      const lim = el('select', { 'aria-label': 'Duración' }, [30, 45, 60].map(v => el('option', { value: v, selected: v === st.limit }, v + ' segundos')));
      lim.addEventListener('change', () => { st.limit = +lim.value; });
      box.replaceChildren(el('div', { class: 'card' }, modeRow, el('div', { class: 'row between' }, el('span', { class: 'muted' }, 'Tiempo para hablar'), lim), el('button', { class: 'btn primary block', style: 'margin-top:12px', onclick: start }, '🎤 Empezar (10 s para pensar)')));
    } else if (st.phase === 'prep') {
      box.replaceChildren(el('div', { class: 'card', style: 'text-align:center' }, el('p', { class: 'muted' }, 'Piensa tu respuesta: respuesta, razón, ejemplo'), el('div', { class: 'big-timer', id: 'bt' }, '10'), el('button', { class: 'btn', onclick: beginRec }, 'Empezar ya')));
    } else if (st.phase === 'rec') {
      box.replaceChildren(el('div', { class: 'card', style: 'text-align:center' }, el('div', { class: 'big-timer', id: 'bt' }, mmss(st.limit - st.secs)), el('div', { class: 'bar' }, el('i', { id: 'pb', style: 'width:0%' })), el('p', { class: 'transcript', id: 'tr', style: 'text-align:left;min-height:60px' }, st.mode === 'transcribe' ? 'Escuchando… habla con claridad.' : '🔴 Grabando…'), st.micErr ? el('div', { class: 'fb bad' }, 'No pude acceder al micrófono: habla igualmente y evalúate con la lista.') : null, el('button', { class: 'btn primary', onclick: stop }, '⏹ Terminar')));
    } else {
      const secs = Math.max(1, st.secs);
      const a = analyzeSpeech(text(), secs);
      const parts = [];
      if (st.audioUrl) parts.push(el('div', { class: 'card' }, el('b', null, 'Tu grabación'), el('audio', { controls: true, src: st.audioUrl })));
      if (text()) {
        const adv = [];
        if (a.n < 40) adv.push('Respuesta corta: amplía con una razón y un ejemplo.');
        if (a.wpm && a.wpm < 70) adv.push('Ritmo lento (' + a.wpm + ' palabras/min): intenta enlazar ideas sin tantas pausas.');
        if (a.wpm > 170) adv.push('Vas muy rápido (' + a.wpm + ' palabras/min): respira entre ideas.');
        if (!a.hasReason) adv.push('Falta una razón: usa *because…* o *that\'s why…*.');
        if (!a.hasExample) adv.push('Falta un ejemplo: usa *for example…* o cuenta algo concreto.');
        if (a.fill.length) adv.push('Muletillas: ' + a.fill.map(f => f[0] + ' (' + f[1] + ')').join(', ') + '.');
        parts.push(el('div', { class: 'card' }, el('b', null, 'Análisis'), el('div', { class: 'stats' },
          el('div', { class: 'stat' }, el('b', null, a.n), el('span', null, 'palabras')),
          el('div', { class: 'stat' }, el('b', null, a.wpm), el('span', null, 'palabras/min')),
          el('div', { class: 'stat' }, el('b', null, a.linkers.length), el('span', null, 'conectores'))),
          el('div', { class: 'small' }, el('span', { class: 'chip ' + (a.hasReason ? 'ok' : 'warn'), style: 'margin-right:4px' }, a.hasReason ? '✓ razón' : '○ razón'), el('span', { class: 'chip ' + (a.hasExample ? 'ok' : 'warn') }, a.hasExample ? '✓ ejemplo' : '○ ejemplo')),
          adv.map(t => el('div', { class: 'issue tip' }, '💡', el('div', null, fmt(t)))),
          !adv.length ? el('div', { class: 'fb ok', style: 'margin-top:8px' }, '✓ Muy buena respuesta. Prueba otra pregunta.') : null,
          el('p', { class: 'small muted', style: 'margin:8px 0 2px' }, 'Lo que entendió el reconocimiento de voz:'), el('div', { class: 'transcript' }, text())));
      } else {
        parts.push(el('div', { class: 'card' }, el('b', null, 'Autoevaluación'), ['Hablé todo el tiempo sin silencios largos', 'Di respuesta + razón + ejemplo', 'Usé algún conector (because, however, for example)', 'Corregí mis errores sin empezar de nuevo'].map((t, i) => el('label', { class: 'todo', for: 'ev' + i }, el('input', { type: 'checkbox', id: 'ev' + i }), el('span', null, t)))));
      }
      parts.push(el('div', { class: 'row wrap' }, el('button', { class: 'btn primary', onclick: () => go({ name: 'speak-run', q: SPEAKING[Math.floor(Math.random() * SPEAKING.length)], limit: st.limit }) }, '🎲 Otra pregunta'), el('button', { class: 'btn', onclick: () => go({ name: 'speak-run', q, limit: st.limit }) }, '↺ Repetir'), el('button', { class: 'btn ghost', onclick: () => go({ name: 'speak', cat: 'Todas' }) }, 'Lista')));
      box.replaceChildren(...parts);
    }
  }
  function start() {
    st.phase = 'prep'; let n = 10; draw();
    tick = setInterval(() => { n--; const bt = $('#bt'); if (bt) bt.textContent = String(n); if (n <= 0) { clearInterval(tick); tick = null; beginRec(); } }, 1000);
  }
  async function beginRec() {
    if (tick) { clearInterval(tick); tick = null; }
    st.phase = 'rec'; st.secs = 0; st.base = ''; st.fin = ''; st.interim = ''; draw();
    if (st.mode === 'transcribe' && SRC) {
      try {
        rec = new SRC(); rec.lang = 'en-GB'; rec.continuous = true; rec.interimResults = true;
        rec.onresult = e => { let f = '', i2 = ''; for (let k = 0; k < e.results.length; k++) { const res = e.results[k]; if (res.isFinal) f += res[0].transcript + ' '; else i2 += res[0].transcript; } st.fin = f; st.interim = i2; const tr = $('#tr'); if (tr) tr.textContent = text() || 'Escuchando…'; };
        rec.onend = () => { if (st.phase === 'rec' && rec) { st.base = (st.base + ' ' + st.fin).trim(); st.fin = ''; try { rec.start(); } catch (e) { /* nada */ } } };
        rec.onerror = ev => { if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { st.micErr = true; rec = null; const tr = $('#tr'); if (tr) tr.textContent = 'Sin permiso de micrófono.'; } };
        rec.start();
      } catch (e) { st.micErr = true; }
    } else {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mr = new MediaRecorder(stream); chunks = [];
        mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = () => { if (chunks.length) { st.audioUrl = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })); if (st.phase === 'done') draw(); } };
        mr.start();
      } catch (e) { st.micErr = true; draw(); }
    }
    tick = setInterval(() => {
      st.secs++;
      const bt = $('#bt'), pb = $('#pb');
      if (bt) { bt.textContent = mmss(st.limit - st.secs); bt.classList.toggle('low', st.limit - st.secs <= 10); }
      if (pb) pb.style.width = Math.min(100, pct(st.secs, st.limit)) + '%';
      if (st.secs >= st.limit) stop();
    }, 1000);
  }
  function stop() {
    const secs = st.secs;
    st.phase = 'done';
    if (tick) { clearInterval(tick); tick = null; }
    if (rec) { st.base = (st.base + ' ' + st.fin).trim(); st.fin = ''; const rr = rec; rec = null; try { rr.onend = null; rr.stop(); } catch (e) { /* nada */ } }
    if (mr && mr.state !== 'inactive') { try { mr.stop(); } catch (e) { /* nada */ } }
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    if (secs >= 5) { Store.d.speak.n++; Store.d.speak.runs.push({ id: q.id, t: Date.now(), s: secs }); if (Store.d.speak.runs.length > 50) Store.d.speak.runs.shift(); Store.save(); }
    draw();
  }
  draw();
  return root;
};

/* ===== Flashcards ===== */
const INTERVALS = [0, 10, 60, 360, 1440];
function deckStats(d) {
  const now = Date.now();
  let due = 0, known = 0;
  d.cards.forEach((c, i) => { const s = Store.d.cards[d.id + ':' + i]; if (!s || s.d <= now) due++; if (s && s.b >= 2) known++; });
  return { due, known, total: d.cards.length };
}
function startCards(ids, dir) {
  const now = Date.now();
  const pool = [];
  ids.forEach(id => { const d = DECKS.find(x => x.id === id); d.cards.forEach((c, i) => pool.push({ id: id + ':' + i, c, deck: d.title })); });
  let queue = shuffle(pool.filter(x => { const s = Store.d.cards[x.id]; return !s || s.d <= now; })).slice(0, 20);
  if (!queue.length) queue = shuffle(pool).slice(0, 20);
  go({ name: 'cards-run', queue, i: 0, flipped: false, dir, total: queue.length, know: 0, again: 0, req: {} });
}
VIEWS.cards = function (r) {
  const dir = r.dir || 'en';
  const root = el('div');
  root.append(header('Flashcards', 'Repaso espaciado: lo que fallas vuelve antes'));
  root.append(el('div', { class: 'tabs' }, el('button', { class: dir === 'en' ? 'on' : '', onclick: () => go({ name: 'cards', dir: 'en' }) }, 'Inglés → Español'), el('button', { class: dir === 'es' ? 'on' : '', onclick: () => go({ name: 'cards', dir: 'es' }) }, 'Español → Inglés')));
  root.append(el('button', { class: 'btn primary block', style: 'margin-bottom:12px', onclick: () => startCards(DECKS.map(d => d.id), dir) }, '▶ Sesión mixta (20 cartas)'));
  DECKS.forEach(d => {
    const s = deckStats(d);
    root.append(el('button', { class: 'item', onclick: () => startCards([d.id], dir) }, el('span', { style: 'font-size:1.5rem' }, d.icon), el('div', { class: 'grow' }, el('b', null, d.title), el('div', { class: 'bar', style: 'margin-top:6px' }, el('i', { style: 'width:' + pct(s.known, s.total) + '%' }))), el('span', { class: 'chip ' + (s.due ? 'warn' : 'ok') }, s.due + ' pend.')));
  });
  return root;
};
VIEWS['cards-run'] = function (r) {
  const root = el('div');
  const cur = r.queue[r.i];
  root.append(el('div', { class: 'row between', style: 'margin-bottom:10px' }, back({ name: 'cards', dir: r.dir }, 'Salir'), el('span', { class: 'muted small' }, (r.i + 1) + ' / ' + r.queue.length)));
  root.append(el('div', { class: 'bar', style: 'margin-bottom:12px' }, el('i', { style: 'width:' + (100 * r.i / r.queue.length) + '%' })));
  const [en, es, ex] = cur.c;
  const front = r.dir === 'en' ? en : es, backT = r.dir === 'en' ? es : en;
  const card = el('div', { class: 'card flash', role: 'button', tabindex: '0', onclick: () => { if (!r.flipped) { r.flipped = true; render(); } } },
    el('div', null, el('span', { class: 'chip plain' }, cur.deck), el('div', { class: 'front', style: 'margin-top:8px' }, front),
      r.flipped ? el('div', { style: 'margin-top:14px' }, el('div', { class: 'front', style: 'color:var(--accent);font-size:1.35rem' }, backT), ex ? el('div', { class: 'ex' }, ex) : null) : el('div', { class: 'hint', style: 'margin-top:14px' }, 'Toca para ver la respuesta')));
  root.append(card);
  if (r.flipped) {
    const rate = kind => {
      const key = cur.id, s = Store.d.cards[key] || { b: 0, d: 0 };
      if (kind === 'know') { s.b = Math.min(4, s.b + 1); r.know++; }
      else if (kind === 'again') { s.b = 0; r.again++; if (!r.req[key]) { r.req[key] = true; r.queue.push(cur); } }
      s.d = Date.now() + INTERVALS[s.b] * 60000;
      Store.d.cards[key] = s; Store.save();
      r.i++; r.flipped = false;
      if (r.i >= r.queue.length) go({ name: 'cards-end', r }); else render();
    };
    root.append(el('div', { class: 'grid3', style: 'margin-top:12px' }, el('button', { class: 'btn', onclick: () => rate('again') }, '😵 No la sé'), el('button', { class: 'btn', onclick: () => rate('almost') }, '🤔 Casi'), el('button', { class: 'btn primary', onclick: () => rate('know') }, '😎 La sé')));
  }
  return root;
};
VIEWS['cards-end'] = function (route0) {
  const r = route0.r;
  const root = el('div');
  root.append(header('Sesión terminada', 'Buen trabajo'));
  root.append(el('div', { class: 'card', style: 'text-align:center' }, el('div', { class: 'score' }, r.know + ' / ' + r.total), el('p', { class: 'muted' }, 'cartas dominadas en esta sesión'), r.again ? el('p', { class: 'small' }, r.again + ' vez/veces marcaste "No la sé": volverán pronto.') : el('span', { class: 'stamp' }, 'Perfecto')));
  root.append(el('div', { class: 'row wrap' }, el('button', { class: 'btn primary', onclick: () => startCards(DECKS.map(d => d.id), r.dir) }, '▶ Otra sesión'), el('button', { class: 'btn', onclick: () => go({ name: 'cards', dir: r.dir }) }, 'Mazos')));
  return root;
};

/* ===== Arranque ===== */
function boot() {
  Store.load();
  TTS.init();
  document.querySelectorAll('.nav button').forEach(b => b.addEventListener('click', () => go({ name: b.dataset.tab })));
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (route.name === 'home') render(); });
  render();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { /* sin SW */ });
}
window.GP = { QUIZ, PASSAGES, LISTENING, DECKS, WRITING, SPEAKING, LINT_RULES, analyzeWriting, analyzeSpeech, stamps, Store, go, pickSim, isOk, norm, getRoute: () => route };
boot();
