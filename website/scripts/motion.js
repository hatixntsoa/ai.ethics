/** Shared motion helpers: reveal, counters, progress bar. Idempotent. */
const reduced = () =>
  document.documentElement.dataset.motion === 'reduce' ||
  matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer;

/** Reveal `.reveal` elements once when they enter the viewport, with stagger via --i. Safe to call again after rendering. */
export function initReveals(scope = document) {
  observer?.disconnect();
  const items = [...scope.querySelectorAll('.reveal:not(.is-in)')];
  items.forEach((el, i) => el.style.setProperty('--i', i % 8));
  if (reduced() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); observer.unobserve(e.target); }
    }
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));
}

/** Count a number up to its data-count value. The text always ends on the final value. */
export function countUp(el, duration = 700) {
  const end = Number(el.dataset.count);
  if (reduced() || Number.isNaN(end)) { el.textContent = end; return; }
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / duration);
    el.textContent = Math.round(end * p);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Reading progress bar tied to scroll position. */
export function initProgress() {
  const bar = document.querySelector('.progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

document.addEventListener('visibilitychange', () =>
  document.documentElement.classList.toggle('tab-hidden', document.hidden));
