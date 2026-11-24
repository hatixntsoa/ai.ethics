import { RISKS } from './data/riskRegister.js';
import { renderHeatmap, highlightRisk } from './heatmap.js';
import { countUp, initReveals } from './motion.js';
import { el } from './dom.js';

const state = { view: 'inherent', band: '', cat: '', mod: '', owner: '', cell: null, sort: { key: 'id', dir: 1 } };
const $ = (id) => document.getElementById(id);
const chip = (x) => el('span', `chip ${x.band.toLowerCase()}`, `${x.score} ${x.band}`);

function fill(sel, values) {
  const all = el('option', '', 'All'); all.value = ''; sel.append(all);
  values.forEach((v) => { const o = el('option', '', v); o.value = v; sel.append(o); });
}

/** Counters are computed from the data, never hard-coded. */
function counters() {
  const n = (k, b) => RISKS.filter((r) => r[k].band === b).length;
  [['c-crit-in', n('inherent', 'Critical')], ['c-high-in', n('inherent', 'High')],
   ['c-crit-out', n('residual', 'Critical')], ['c-high-out', n('residual', 'High')]].forEach(([id, v]) => {
    const e = $(id); e.dataset.count = v; countUp(e);
  });
}

function visible() {
  const k = state.view;
  const rows = RISKS.filter((r) =>
    (!state.band || r[k].band === state.band) && (!state.cat || r.category === state.cat) &&
    (!state.mod || r.modules.includes(state.mod)) && (!state.owner || r.owner === state.owner) &&
    (!state.cell || (r[state.cell.key].l === state.cell.l && r[state.cell.key].i === state.cell.i)));
  const { key, dir } = state.sort;
  const val = (r) => (key === 'id' ? r.id : r[key].score);
  return rows.sort((a, b) => (val(a) > val(b) ? dir : val(a) < val(b) ? -dir : 0));
}

function renderTable() {
  const body = $('rr-body'); body.replaceChildren();
  const rows = visible();
  rows.forEach((r) => {
    const tr = document.createElement('tr');
    const idCell = el('th', '', r.id); idCell.scope = 'row'; idCell.tabIndex = 0;
    idCell.addEventListener('mouseenter', () => highlightRisk(r.id));
    idCell.addEventListener('mouseleave', () => highlightRisk(null));
    idCell.addEventListener('focus', () => highlightRisk(r.id));
    idCell.addEventListener('blur', () => highlightRisk(null));
    const delta = el('td'); delta.append(chip(r.inherent), ' → ', chip(r.residual));
    if (r.boardAcceptance) delta.append(el('div', 'flag', '⚑ Requires board acceptance'));
    const btn = el('button', 'btn', 'Details'); btn.type = 'button'; btn.setAttribute('aria-expanded', 'false');
    const more = document.createElement('tr'); more.hidden = true;
    const td = el('td'); td.colSpan = 7;
    td.append(el('p', '', `Treatment and controls: ${r.treatment}`), el('p', '', `References: ${r.refs}`));
    more.append(td);
    btn.addEventListener('click', () => { const o = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!o)); more.hidden = o; });
    const last = el('td'); last.append(btn);
    tr.append(idCell, el('td', '', r.risk), el('td', '', r.modules.join(', ')), el('td', '', r.category), delta, el('td', '', r.owner), last);
    body.append(tr, more);
  });
  $('rr-count').textContent = `${rows.length} of ${RISKS.length} risks shown`;
}

function init() {
  fill($('f-band'), ['Low', 'Medium', 'High', 'Critical']);
  fill($('f-cat'), ['CY', 'AI', 'CO', 'TP', 'PR']);
  fill($('f-mod'), ['M1', 'M2', 'M3', 'M4']);
  fill($('f-owner'), [...new Set(RISKS.map((r) => r.owner))].sort());
  const bind = (id, k) => $(id).addEventListener('change', (e) => { state[k] = e.target.value; renderTable(); });
  bind('f-view', 'view'); bind('f-band', 'band'); bind('f-cat', 'cat'); bind('f-mod', 'mod'); bind('f-owner', 'owner');
  document.querySelectorAll('[data-sort]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.sort;
    state.sort = { key: k, dir: state.sort.key === k ? -state.sort.dir : 1 };
    document.querySelectorAll('[data-sort]').forEach((x) => x.closest('th').removeAttribute('aria-sort'));
    b.closest('th').setAttribute('aria-sort', state.sort.dir === 1 ? 'ascending' : 'descending');
    renderTable();
  }));
  const onCell = (c) => {
    const same = state.cell && state.cell.l === c.l && state.cell.i === c.i && state.cell.key === c.key;
    state.cell = same ? null : c;
    document.querySelectorAll('.heat-cell').forEach((x) => x.classList.remove('sel'));
    if (!same) document.querySelector(`#heat-${c.key} [data-l="${c.l}"][data-i="${c.i}"]`)?.classList.add('sel');
    renderTable();
  };
  renderHeatmap($('heat-inherent'), RISKS, 'inherent', onCell);
  renderHeatmap($('heat-residual'), RISKS, 'residual', onCell);
  counters(); renderTable(); initReveals();
}
init();
