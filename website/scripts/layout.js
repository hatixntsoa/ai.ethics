import { el } from './dom.js';
const NAV = [['ai-act-summary', 'AI Act'], ['scenario', 'Scenario'], ['methodology', 'Method'], ['timeline', 'Timeline'],
  ['assignment-1', 'Scope'], ['assignment-2', 'Risk'], ['assignment-3', 'Requirements'], ['references', 'References']];

/** Build the shared header and footer into #site-header / #site-footer (pages/ only; index.html has its own). */
export function initLayout() {
  const hd = document.getElementById('site-header');
  const ft = document.getElementById('site-footer');
  if (hd && !hd.childElementCount) {
    const wrap = el('div', 'container');
    const brand = Object.assign(el('a', 'brand', 'AI Ethics'), { href: '../index.html' });
    const search = Object.assign(el('div', 'search'), { id: 'site-search' });
    const nav = el('nav', 'nav'); nav.setAttribute('aria-label', 'Main');
    const here = location.pathname.split('/').pop();
    for (const [slug, label] of NAV) {
      const a = Object.assign(el('a', '', label), { href: `${slug}.html` });
      if (here === `${slug}.html`) a.setAttribute('aria-current', 'page');
      nav.append(a);
    }
    wrap.append(brand, search, nav);
    hd.append(wrap);
  }
  if (ft && !ft.childElementCount) {
    const wrap = el('div', 'container');
    const copy = el('p', 'copyright');
    const year = el('span', '', String(new Date().getFullYear())); year.dataset.year = '';
    copy.append('© ', year, ' Hatix Ntsoa');
    const legal = el('p', 'legal', 'Educational case study, not legal advice. Dates as of November 2026; verify against the Official Journal. MIT licence · ');
    legal.append(Object.assign(el('a', '', 'GitHub repository'), { href: 'https://github.com/hatixntsoa/ai.ethics' }));
    wrap.append(copy, legal);
    ft.append(wrap);
  }
}
