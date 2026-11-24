import { TIMELINE } from './data/timeline.js';
import { initReveals } from './motion.js';
import { el } from './dom.js';

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const parse = (s) => { const [d, m, y] = s.split(' '); return new Date(+y, MONTHS[m], +d); };

/** Render the timeline from data; a "today" marker is inserted when inside the range. Idempotent. */
function render() {
  const host = document.getElementById('timeline');
  if (!host || host.childElementCount) return;
  document.getElementById('tl-status').textContent = TIMELINE.status;
  const items = TIMELINE.milestones.map((m) => ({ ...m, at: parse(m.date) }));
  const now = new Date();
  if (now >= items[0].at && now <= items.at(-1).at) {
    const i = items.findIndex((m) => m.at > now);
    items.splice(i, 0, { today: true, date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), at: now });
  }
  items.forEach((m, idx) => {
    const li = el('li', 'tl-item reveal' + (m.highlight ? ' key' : '') + (m.today ? ' today' : '') + (m.at <= now ? ' past' : ''));
    if (m.today) li.textContent = `${m.date}: today`;
    else {
      const id = `tl-panel-${idx}`;
      const btn = el('button', 'tl-btn'); btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
      btn.append(el('strong', '', m.date), ` ${m.milestone}`);
      const panel = el('p', 'tl-panel', `Relevance to SmartAdvisor AI: ${m.relevance}`); panel.id = id; panel.hidden = true;
      btn.addEventListener('click', () => { const open = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!open)); panel.hidden = open; });
      li.append(btn, panel);
    }
    host.append(li);
  });
  const list = document.getElementById('consequences');
  TIMELINE.consequences.forEach((c) => list.append(el('li', '', c.replace(/\*\*/g, ''))));
  initReveals();
}
render();
