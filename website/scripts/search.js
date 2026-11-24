import { el } from './dom.js';
let index = null;
const base = location.pathname.includes('/pages/') ? '' : 'pages/';

/** Append `text` to `parent`, wrapping matches of any term in <mark>. */
function mark(parent, text, terms) {
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  text.split(re).forEach((part, i) => { if (i % 2) parent.append(el('mark', '', part)); else if (part) parent.append(part); });
}

/** Header search: `/` focuses it; results are grouped by page; the index loads on first use. */
export function initSearch(host) {
  if (!host || host.dataset.bound) return;
  host.dataset.bound = '1';
  const input = Object.assign(el('input'), { type: 'search', placeholder: 'Search ( / )', id: 'site-search-input' });
  input.setAttribute('aria-label', 'Search the site'); input.setAttribute('autocomplete', 'off');
  const panel = el('div', 'search-panel'); panel.hidden = true;
  const live = el('p', 'visually-hidden'); live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
  host.append(input, panel, live);
  const run = async () => {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    panel.replaceChildren();
    if (!terms.length) { panel.hidden = true; live.textContent = ''; return; }
    if (!index) { try { index = (await import('./data/searchIndex.js')).SEARCH_INDEX; } catch { index = []; } }
    const hits = index.filter((e) => terms.every((t) => `${e[3]} ${e[4]}`.toLowerCase().includes(t)));
    live.textContent = `${hits.length} results`;
    const groups = new Map(); hits.forEach((h) => { if (!groups.has(h[0])) groups.set(h[0], { title: h[1], items: [] }); groups.get(h[0]).items.push(h); });
    if (!hits.length) panel.append(el('p', '', 'No results.'));
    groups.forEach((g, page) => {
      panel.append(el('h3', '', g.title));
      const ul = el('ul'); g.items.slice(0, 6).forEach((h) => {
        const li = el('li'), a = Object.assign(el('a'), { href: `${base}${page}.html${h[2] ? '#' + h[2] : ''}` });
        a.append(el('strong')); mark(a.firstChild, h[3] || g.title, terms); a.append(el('span', 'snip')); mark(a.lastChild, h[4], terms); li.append(a); ul.append(li);
      }); panel.append(ul);
    });
    panel.hidden = false;
  };
  input.addEventListener('input', run);
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { input.value = ''; run(); input.blur(); } });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) { e.preventDefault(); input.focus(); } });
  document.addEventListener('click', (e) => { if (!host.contains(e.target)) panel.hidden = true; });
}
