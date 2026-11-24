import { TIMELINE } from './data/timeline.js';
import { el } from './dom.js';
import { renderInline } from './md.js';

const NS = 'http://www.w3.org/2000/svg';
const S = (tag, a = {}, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); if (text) e.textContent = text; return e; };
const mi = (ym) => { const [y, m] = ym.split('-').map(Number); return y * 12 + m - 1; };
const MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

/** Interactive Gantt as pure SVG, driven by the phases parsed from the roadmap. Bars grow in sequence (CSS). */
export function renderGantt(host, { phases }) {
  const first = Math.min(...phases.map((p) => mi(p.start))), last = Math.max(...phases.map((p) => mi(p.start) + p.months));
  const LW = 200, MW = 20, RH = 34, W = LW + (last - first) * MW + 20, H = phases.length * RH + 70;
  const x = (m) => LW + (m - first) * MW;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'gantt diagram', role: 'img', 'aria-labelledby': 'gt-t gt-d' });
  svg.append(S('title', { id: 'gt-t' }, 'SmartAdvisor AI compliance programme (indicative)'),
    S('desc', { id: 'gt-d' }, `${phases.map((p) => `${p.label}: ${p.start}, ${p.months} months`).join('. ')}. The phases table below gives the same information as text.`));
  for (let m = first; m <= last; m++) if (m % 12 === 0 || m === first) {
    svg.append(S('line', { x1: x(m), x2: x(m), y1: 30, y2: H - 20, class: 'g-grid' }), S('text', { x: x(m) + 3, y: 22, class: 'g-axis' }, String(Math.floor(m / 12))));
  }
  phases.forEach((p, i) => {
    const y = 40 + i * RH;
    svg.append(S('text', { x: 4, y: y + 18, class: 'g-label' }, p.label));
    const g = S('g', { class: `g-bar sec-${p.section.startsWith('HR-1') ? 1 : p.section.startsWith('HR-2') ? 2 : 0}`, style: `--i:${i}`, tabindex: 0 });
    g.append(S('title', {}, `${p.label}: ${p.start}, ${p.months} months`), S('rect', { x: x(mi(p.start)), y, width: p.months * MW, height: 24, rx: 5 }),
      S('text', { x: x(mi(p.start)) + 6, y: y + 16, class: 'g-id' }, p.id));
    svg.append(g);
  });
  // Deadline flags come from the highlighted (bold) milestones of the timeline data: 2 Dec 2027 and 2 Aug 2028.
  TIMELINE.milestones.filter((m) => m.highlight).forEach((m) => {
    const [d, mon, yr] = m.date.split(' '); const pos = x(+yr * 12 + MON[mon] - 1) + (MW * (+d - 1)) / 30;
    svg.append(S('line', { x1: pos, x2: pos, y1: 30, y2: H - 20, class: 'g-flag' }), S('text', { x: pos - 4, y: H - 6, 'text-anchor': 'end', class: 'g-flag-t' }, `⚑ ${m.date}`));
  });
  const now = new Date(), nm = now.getFullYear() * 12 + now.getMonth();
  if (nm >= first && nm <= last) svg.append(S('line', { x1: x(nm) + (MW * (now.getDate() - 1)) / 30, x2: x(nm) + (MW * (now.getDate() - 1)) / 30, y1: 30, y2: H - 20, class: 'g-today' }), S('text', { x: x(nm) + 2, y: H - 6, class: 'g-today-t' }, 'Today'));
  const wrap = el('div', 'table-wrap'); wrap.append(svg); host.append(wrap);
}

/** RACI matrix with row and column highlighting on hover and keyboard focus (row/column headers are focusable). */
export function renderRaci(host, { head, rows }) {
  const t = el('table', 'raci'); t.append(el('caption', 'visually-hidden', 'RACI matrix'));
  const thead = el('thead'), tr0 = el('tr');
  head.forEach((h, c) => { const th = el('th', c ? 'col-h' : '', h); th.scope = 'col'; if (c) th.tabIndex = 0; th.dataset.c = c; tr0.append(th); });
  thead.append(tr0); t.append(thead);
  const tb = el('tbody');
  rows.forEach((r) => { const tr = el('tr'); r.forEach((cell, c) => { const d = el(c ? 'td' : 'th'); if (!c) { d.scope = 'row'; d.tabIndex = 0; } d.dataset.c = c; renderInline(d, cell); tr.append(d); }); tb.append(tr); });
  t.append(tb);
  const mark = (row, col) => { t.querySelectorAll('.hl-r,.hl-c').forEach((e) => e.classList.remove('hl-r', 'hl-c')); if (row) row.classList.add('hl-r'); if (col) t.querySelectorAll(`[data-c="${col}"]`).forEach((e) => e.classList.add('hl-c')); };
  const on = (e) => { const c = e.target.closest('td,th'); if (!c || !tb.contains(c) && !thead.contains(c)) return; mark(c.parentElement.parentElement === tb ? c.parentElement : null, c.dataset.c !== '0' ? c.dataset.c : null); };
  t.addEventListener('mouseover', on); t.addEventListener('focusin', on); t.addEventListener('mouseleave', () => mark());
  const wrap = el('div', 'table-wrap'); wrap.append(t); host.append(wrap);
}
