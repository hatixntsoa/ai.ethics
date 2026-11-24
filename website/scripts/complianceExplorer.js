import { COMPLIANCE as C } from './data/complianceMatrix.js';
import { el } from './dom.js';

const COLS = [['n', '#'], ['article', 'AI Act'], ['objective', 'Control objective'], ['controls', 'Controls'], ['evidence', 'Evidence'], ['frameworks', 'Framework mapping'], ['kpi', 'KPI / KRI'], ['owner', 'Owner'], ['status', 'Status']];
const ST = { 'Not started': '○', Designed: '◐', Implemented: '◕', Evidenced: '●' };
const FW = ['ISO 42001', 'ISO 27001', 'NIST', 'GDPR', 'OWASP'];
const csvCell = (s) => `"${String(s).replace(/"/g, '""')}"`;

/** Matrix explorer: filter by article, owner, status, framework; full-text search; CSV export of visible rows. */
export function complianceExplorer(host) {
  const sel = (label, opts) => { const l = el('label', '', `${label} `); const s = el('select'); const a = el('option', '', 'All'); a.value = ''; s.append(a); opts.forEach((o) => { const x = el('option', '', o); x.value = o; s.append(x); }); l.append(s); return [l, s]; };
  const uniq = (k) => [...new Set(C.map((r) => r[k]))];
  const [lA, sA] = sel('AI Act article', uniq('article')), [lO, sO] = sel('Owner', uniq('owner')), [lS, sS] = sel('Status', uniq('status')), [lF, sF] = sel('Framework', FW);
  const q = Object.assign(el('input'), { type: 'search', placeholder: 'Search the matrix' }); q.setAttribute('aria-label', 'Search the compliance matrix');
  const csv = Object.assign(el('button', 'btn', 'Export visible rows (CSV)'), { type: 'button' });
  const bar = el('div', 'filters'); bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Compliance matrix filters');
  bar.append(lA, lO, lS, lF, q, csv);
  const count = el('p'); count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite');
  const wrap = el('div', 'table-wrap'), t = el('table'); t.append(el('caption', 'visually-hidden', 'Compliance matrix'));
  const tr0 = el('tr'); COLS.forEach(([, l]) => { const th = el('th', '', l); th.scope = 'col'; tr0.append(th); });
  const th = el('thead'); th.append(tr0); t.append(th);
  const tb = el('tbody');
  const rows = C.map((r) => {
    const tr = el('tr', 'mx-row');
    COLS.forEach(([k], i) => {
      const c = el(i === 0 ? 'th' : 'td'); if (i === 0) c.scope = 'row';
      if (k === 'status') c.append(el('span', `st st-${r.status.replace(/[^a-z]/gi, '').toLowerCase()}`, `${ST[r.status] || '⚑'} ${r.status}`)); else c.textContent = r[k];
      tr.append(c);
    });
    tb.append(tr); return { r, tr, hay: Object.values(r).join(' ').toLowerCase() };
  });
  t.append(tb); wrap.append(t); host.append(bar, count, wrap);
  let shown = rows;
  const apply = () => {
    const term = q.value.trim().toLowerCase();
    shown = rows.filter(({ r, hay }) => (!sA.value || r.article === sA.value) && (!sO.value || r.owner === sO.value) && (!sS.value || r.status === sS.value) &&
      (!sF.value || r.frameworks.includes(sF.value)) && (!term || hay.includes(term)));
    rows.forEach((x) => { const on = shown.includes(x); x.tr.classList.toggle('is-out', !on); x.tr.hidden = !on; });
    count.textContent = `${shown.length} of ${rows.length} controls shown`;
  };
  [sA, sO, sS, sF].forEach((s) => s.addEventListener('change', apply)); q.addEventListener('input', apply);
  csv.addEventListener('click', () => {
    const body = [COLS.map(([, l]) => csvCell(l)).join(','), ...shown.map(({ r }) => COLS.map(([k]) => csvCell(r[k])).join(','))].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob(['\ufeff' + body], { type: 'text/csv;charset=utf-8' })), download: 'compliance-matrix.csv' });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  apply();
}
