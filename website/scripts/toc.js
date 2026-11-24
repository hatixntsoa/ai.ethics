import { el } from './dom.js';
/** Build a sticky table of contents from h2[id]/h3[id] in #main with scroll-spy. */
export function initToc(host) {
  if (!host || host.dataset.bound) return;
  host.dataset.bound = '1';
  const heads = [...document.querySelectorAll('#main h2[id], #main h3[id]')];
  const nav = el('nav'); nav.setAttribute('aria-label', 'On this page');
  const ul = el('ul');
  const links = new Map();
  heads.forEach((h) => {
    const li = el('li', h.tagName === 'H3' ? 'sub' : '');
    const a = Object.assign(el('a', '', h.textContent.replace(/#$/, '').trim()), { href: `#${h.id}` });
    li.append(a); ul.append(li); links.set(h, a);
  });
  nav.append(el('p', 'toc-title', 'On this page'), ul); host.append(nav);
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.removeAttribute('aria-current')); links.get(e.target)?.setAttribute('aria-current', 'true'); } });
  }, { rootMargin: '0px 0px -75% 0px' });
  heads.forEach((h) => io.observe(h));
}
