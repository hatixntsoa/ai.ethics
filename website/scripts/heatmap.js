/** Band for a likelihood x impact score (Low 1-4, Medium 5-9, High 10-14, Critical 15-25). */
export const bandOf = (s) => (s <= 4 ? 'low' : s <= 9 ? 'medium' : s <= 14 ? 'high' : 'critical');

/** Render a 5x5 heat map; each cell is a button; clicking calls onCell({l, i, key}). */
export function renderHeatmap(host, risks, key, onCell) {
  host.replaceChildren();
  host.classList.add('heat');
  for (let l = 5; l >= 1; l--) {
    for (let i = 1; i <= 5; i++) {
      const here = risks.filter((r) => r[key].l === l && r[key].i === i);
      const score = l * i, band = bandOf(score);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `heat-cell ${band} reveal`;
      cell.dataset.l = l; cell.dataset.i = i; cell.dataset.ids = here.map((r) => r.id).join(' ');
      cell.style.setProperty('--i', score % 8);
      cell.setAttribute('aria-label', `Likelihood ${l}, impact ${i}, score ${score}, ${band}, ${here.length} risks`);
      const s = Object.assign(document.createElement('span'), { className: 'heat-score', textContent: String(score) });
      const ids = Object.assign(document.createElement('span'), { className: 'heat-ids', textContent: here.map((r) => r.id.replace('R-', '')).join(' ') });
      cell.append(s, ids);
      cell.addEventListener('click', () => onCell({ l, i, key }));
      host.append(cell);
    }
  }
}

/** Highlight the cells holding a risk id on every heat map (null clears). */
export function highlightRisk(id) {
  document.querySelectorAll('.heat-cell').forEach((c) => c.classList.toggle('hl', !!id && c.dataset.ids.split(' ').includes(id)));
}
