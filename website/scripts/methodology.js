import { METHODOLOGY as M } from './data/methodology.js';
import { table, el } from './dom.js';
import { initReveals } from './motion.js';

const $ = (id) => document.getElementById(id);
const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Process loop: steps are always visible; play moves a highlight every 1.6 s (no auto-start). */
function loop() {
  const host = $('loop');
  M.process.forEach((p, i) => { const li = el('li', 'loop-step', p.step); li.dataset.next = i < M.process.length - 1 ? '→' : '↺'; host.append(li); });
  let timer = null, idx = 0;
  const btn = $('loop-toggle');
  const paint = () => [...host.children].forEach((c, i) => c.classList.toggle('on', i === idx));
  const stop = () => { clearInterval(timer); timer = null; btn.textContent = 'Play loop'; btn.setAttribute('aria-pressed', 'false'); };
  btn.addEventListener('click', () => {
    if (timer) return stop();
    btn.textContent = 'Pause loop'; btn.setAttribute('aria-pressed', 'true');
    paint();
    timer = reduced() ? setInterval(() => {}, 1 << 30) : setInterval(() => { idx = (idx + 1) % M.process.length; paint(); }, 1600);
  });
  addEventListener('pagehide', stop);
}

/** Crosswalk with live text filter. */
function crosswalk() {
  const cols = [['aiAct', 'AI Act'], ['iso42001', 'ISO/IEC 42001:2023'], ['iso27001', 'ISO/IEC 27001:2022 Annex A'], ['nistAiRmf', 'NIST AI RMF']];
  const rows = [...table($('t-cross'), 'Framework crosswalk', cols, M.crosswalk).rows];
  const count = (n) => { $('cw-count').textContent = `${n} of ${rows.length} rows shown`; };
  $('cw-filter').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    let n = 0;
    rows.forEach((r) => { const hit = !q || r.textContent.toLowerCase().includes(q); r.hidden = !hit; if (hit) n++; });
    count(n);
  });
  count(rows.length);
}

table($('t-lens'), 'Two lenses', [['lens', 'Lens'], ['question', 'Question'], ['source', 'Source'], ['harm', 'Harm measured on']], M.lenses);
table($('t-proc'), 'Process steps and outputs', [['step', 'Step'], ['output', 'Output in this repository']], M.process);
table($('t-like'), 'Likelihood scale (12-month horizon)', [['level', 'Level'], ['label', 'Label'], ['guide', 'Guide']], M.likelihood);
table($('t-impact'), 'Impact scale (highest applicable dimension)', [['level', 'Level'], ['label', 'Label'], ['persons', 'Persons'], ['compliance', 'Compliance'], ['business', 'Business']], M.impact);
const tbBands = table($('t-bands'), 'Rating bands: score = likelihood x impact', [['score', 'Score'], ['band', 'Band'], ['action', 'Required action']], M.bands);
[...tbBands.rows].forEach((r) => { const c = r.cells[1]; c.className = `chip-cell ${c.textContent.toLowerCase()}`; });
M.appetite.forEach((a) => $('appetite').append(el('li', '', a)));
loop();
crosswalk();
initReveals();
