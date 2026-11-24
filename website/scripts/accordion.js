/** Wire `[data-accordion] > h3 > button` disclosures (grid-rows animation in components.css). */
export function initAccordions(scope = document) {
  scope.querySelectorAll('[data-accordion] > h3 > button').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.closest('[data-accordion]').classList.toggle('is-open', !open);
    });
  });
}
