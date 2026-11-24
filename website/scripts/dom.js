/** Create an element with a class and text content (never HTML). */
export const el = (tag, cls = '', text = '') => Object.assign(document.createElement(tag), { className: cls, textContent: text });

/**
 * Render a real <table> (caption, scoped headers) into `host`, replacing its content.
 * @param {HTMLElement} host @param {string} caption @param {[string,string][]} cols [key,label] @param {object[]} rows
 * @returns {HTMLTableSectionElement} the tbody
 */
export function table(host, caption, cols, rows) {
  const t = document.createElement('table');
  const cap = el('caption', 'visually-hidden', caption);
  const tr0 = document.createElement('tr');
  cols.forEach(([, l]) => { const th = el('th', '', l); th.scope = 'col'; tr0.append(th); });
  const thead = document.createElement('thead'); thead.append(tr0);
  const tb = document.createElement('tbody');
  rows.forEach((r) => {
    const tr = document.createElement('tr');
    cols.forEach(([k], c) => { const cell = el(c === 0 ? 'th' : 'td', '', r[k]); if (c === 0) cell.scope = 'row'; tr.append(cell); });
    tb.append(tr);
  });
  t.append(cap, thead, tb);
  host.replaceChildren(t);
  return tb;
}
