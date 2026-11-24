import { el } from './dom.js';
import { renderInline } from './md.js';
import { highlight } from './highlight.js';
import { initCopyButtons } from './copy.js';
import { initReveals } from './motion.js';
import { initToc } from './toc.js';

let codeN = 0;
/** Heading with a "copy link to section" anchor. Markdown h2 becomes h3 etc. (the page sections own the h2). */
function heading(b) {
  const h = el(`h${Math.min(b.l + 1, 6)}`); h.id = b.id;
  renderInline(h, b.text);
  const a = Object.assign(el('a', 'anchor', '#'), { href: `#${b.id}` });
  a.setAttribute('aria-label', 'Link to this section');
  a.addEventListener('click', () => { try { navigator.clipboard?.writeText(location.href.split('#')[0] + '#' + b.id); } catch { /* ignore */ } });
  h.append(' ', a);
  return h;
}

function tableBlock(b, caption) {
  const wrap = el('div', 'table-wrap reveal'); const t = el('table');
  t.append(el('caption', 'visually-hidden', caption || 'Table'));
  if (b.head.some((c) => c)) {
    const tr = el('tr'); b.head.forEach((c) => { const th = el('th'); th.scope = 'col'; renderInline(th, c); tr.append(th); });
    const th = el('thead'); th.append(tr); t.append(th);
  }
  const tb = el('tbody');
  b.rows.forEach((r) => { const tr = el('tr'); r.forEach((c, i) => { const cell = el(i === 0 ? 'th' : 'td'); if (i === 0) cell.scope = 'row'; renderInline(cell, c); tr.append(cell); }); tb.append(tr); });
  t.append(tb); wrap.append(t); return wrap;
}

function codeBlock(b) {
  if (b.lang === 'mermaid') {
    const d = el('details', 'diagram-src'); d.append(el('summary', '', 'Diagram source (Mermaid). Shown as text; not redrawn as SVG on this site yet.'));
    d.append(Object.assign(el('pre'), { textContent: b.text })); return d;
  }
  const fig = el('figure', 'code reveal'); const id = `code-${++codeN}`;
  const cap = el('figcaption', '', b.lang || 'text');
  const btn = Object.assign(el('button', 'btn', 'Copy'), { type: 'button' }); btn.dataset.copy = `#${id}`;
  cap.append(btn);
  const pre = el('pre'), code = el('code'); code.id = id; code.append(highlight(b.text, b.lang)); pre.append(code);
  pre.tabIndex = 0; fig.append(cap, pre); return fig;
}

/**
 * Render parsed markdown blocks into `host`. `slots` maps slot names (matrix, gantt, raci) to render functions.
 * The first h1 of each document is skipped (the page has its own).
 */
export function renderBlocks(host, blocks, slots = {}) {
  let last = '';
  blocks.forEach((b) => {
    if (b.t === 'h') { if (b.l === 1) return; last = b.text.replace(/[*`]/g, ''); host.append(heading(b)); }
    else if (b.t === 'p') { const p = el('p', 'reveal'); renderInline(p, b.text); host.append(p); }
    else if (b.t === 'quote') { const q = el('blockquote', 'banner'); renderInline(q, b.text); host.append(q); }
    else if (b.t === 'ul' || b.t === 'ol') { const l = el(b.t); b.items.forEach((i) => { const li = el('li'); renderInline(li, i); l.append(li); }); host.append(l); }
    else if (b.t === 'table') host.append(tableBlock(b, last));
    else if (b.t === 'code') host.append(codeBlock(b));
    else if (b.t === 'slot') { const d = el('div', 'slot'); d.id = `h-${b.name}`; host.append(d); slots[b.name]?.(d, b); }
  });
}

/** A titled page section (h2) holding rendered blocks. */
export function section(host, id, title, blocks, slots) {
  const s = el('section'); s.setAttribute('aria-labelledby', id);
  const h = el('h2', '', title); h.id = id; s.append(h);
  renderBlocks(s, blocks, slots); host.append(s); return s;
}

const ORDER = [['ai-act-summary', 'AI Act summary'], ['assignment-1', 'Assignment 1'], ['assignment-2', 'Assignment 2'], ['assignment-3', 'Assignment 3']];
/** Previous / next navigation between the four assignments. */
export function pager(host, slug) {
  const i = ORDER.findIndex(([s]) => s === slug); if (i < 0) return;
  const nav = el('nav', 'pager'); nav.setAttribute('aria-label', 'Previous and next assignment');
  if (ORDER[i - 1]) nav.append(Object.assign(el('a', '', `← ${ORDER[i - 1][1]}`), { href: `${ORDER[i - 1][0]}.html` }));
  if (ORDER[i + 1]) nav.append(Object.assign(el('a', 'next', `${ORDER[i + 1][1]} →`), { href: `${ORDER[i + 1][0]}.html` }));
  host.append(nav);
}

/** Finish a doc page: reveals, copy buttons, TOC. */
export function finishDoc() { initCopyButtons(); initReveals(); initToc(document.getElementById('toc')); }
