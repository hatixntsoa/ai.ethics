import { AI_ACT_SUMMARY as S } from './data/aiActSummary.js';
import { TIMELINE } from './data/timeline.js';
import { CLASSIFICATION } from './data/classification.js';
import { el } from './dom.js';
import { renderInline } from './md.js';
import { initAccordions } from './accordion.js';
import { initReveals } from './motion.js';
import { initToc } from './toc.js';

const NS = 'http://www.w3.org/2000/svg';
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

/** Risk pyramid built from the four tiers (bottom tier first in the DOM order of animation). */
function pyramid(host) {
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 420 220'); svg.setAttribute('class', 'diagram pyramid'); svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Four risk tiers: unacceptable at the top, then high, limited and minimal');
  const order = ['Minimal', 'Limited', 'High', 'Unacceptable'], cls = ['low', 'medium', 'high', 'critical'];
  order.forEach((name, i) => {
    const tier = CLASSIFICATION.tiers.find((t) => t.tier === name); if (!tier) return;
    const y = 165 - i * 55, wB = 400 - i * 90, wT = 400 - (i + 1) * 90, cx = 210;
    const p = document.createElementNS(NS, 'polygon'); p.setAttribute('points', `${cx - wB / 2},${y + 50} ${cx + wB / 2},${y + 50} ${cx + wT / 2},${y} ${cx - wT / 2},${y}`);
    p.setAttribute('class', `pyr ${cls[i]}`); p.style.setProperty('--i', i);
    const t = document.createElementNS(NS, 'text'); t.setAttribute('x', cx); t.setAttribute('y', y + 30); t.setAttribute('text-anchor', 'middle'); t.setAttribute('class', 'pyr-t'); t.textContent = `${name}: ${tier.anchor.replace(/\*\*/g, '')}`.slice(0, 44);
    svg.append(p, t);
  });
  host.append(svg);
}

function ring(done, total) {
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'ring'); svg.setAttribute('aria-hidden', 'true');
  const bg = document.createElementNS(NS, 'circle'), fg = document.createElementNS(NS, 'circle');
  [bg, fg].forEach((c) => { c.setAttribute('cx', 12); c.setAttribute('cy', 12); c.setAttribute('r', 9); });
  bg.setAttribute('class', 'ring-bg'); fg.setAttribute('class', 'ring-fg'); svg.append(bg, fg);
  svg.update = (d) => fg.style.strokeDashoffset = String(56.5 * (1 - (total ? d / total : 0)));
  svg.update(done); return svg;
}

function chapter(ch) {
  const wrap = el('div', 'chapter reveal'); wrap.dataset.accordion = ''; wrap.id = `ch-${ch.number}`;
  const h = el('h3'); const btn = el('button'); btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', `p-${ch.number}`);
  btn.append(el('span', 'ch-num', `CHAPTER ${ch.number}`), ` ${ch.title}`);
  const checks = ch.blocks.filter((b) => b.kind === 'checklist').flatMap((b) => b.items);
  const prog = el('span', 'prog'); const count = el('span', '', ''); btn.append(prog);
  h.append(btn);
  const panel = el('div', 'acc-panel'); panel.id = `p-${ch.number}`; panel.setAttribute('role', 'region'); panel.setAttribute('aria-labelledby', btn.id = `b-${ch.number}`);
  const inner = el('div', 'acc-inner'); const body = el('div', 'ch-body');
  const link = el('p'); link.append(Object.assign(el('a', '', `Chapter ${ch.number} on artificialintelligenceact.eu`), { href: ch.url, rel: 'noopener' })); body.append(link);
  let done = 0; const r = ring(0, checks.length); prog.append(r, count);
  const upd = () => { r.update(done); count.textContent = checks.length ? `${done}/${checks.length}` : ''; };
  ch.blocks.forEach((b) => {
    const sec = el('div', `blk blk-${b.kind}`); const t = el('h4'); t.append(el('span', 'ico', ICON[b.kind] || '•'), ' '); renderInline(t, b.label); sec.append(t);
    const ul = el('ul', b.kind === 'checklist' ? 'checks' : '');
    b.items.forEach((it, i) => {
      const li = el('li');
      if (b.kind === 'checklist') {
        const key = `chk-${ch.number}-${i}`, id = `${key}-${Math.random().toString(36).slice(2, 6)}`;
        const cb = el('input'); cb.type = 'checkbox'; cb.id = id; cb.checked = store.get(key) === '1'; if (cb.checked) done++;
        cb.addEventListener('change', () => { store.set(key, cb.checked ? '1' : '0'); done += cb.checked ? 1 : -1; li.classList.toggle('done', cb.checked); upd(); });
        const lab = el('label'); lab.htmlFor = id; renderInline(lab, it); li.append(cb, lab); li.classList.toggle('done', cb.checked);
      } else renderInline(li, it);
      ul.append(li);
    });
    sec.append(ul); body.append(sec);
  });
  upd(); inner.append(body); panel.append(inner); wrap.append(h, panel); return wrap;
}

/** Render the AI Act summary reader. Content is the French original (the repository has no English chapter text). */
const host = document.getElementById('reader');
if (host) {
  const u = document.getElementById('update-note');
  u.append(el('h3', '', 'Update note (Nov 2026): what the Digital Omnibus changed'));
  u.append(el('p', '', TIMELINE.status + '.'));
  const ul = el('ul'); TIMELINE.milestones.filter((m) => m.highlight || /Omnibus/.test(m.milestone)).forEach((m) => ul.append(el('li', '', `${m.date}: ${m.milestone}. ${m.relevance}`))); u.append(ul);
  pyramid(document.getElementById('pyramid'));
  S.chapters.forEach((c) => host.append(chapter(c)));
  initAccordions(); initReveals(); initToc(document.getElementById('toc'));
  const hash = location.hash.slice(1); const target = hash ? document.getElementById(hash) : null; target?.querySelector('button')?.click();
}
