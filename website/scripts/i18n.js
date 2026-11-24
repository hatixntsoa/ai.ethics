const KEY = 'lang';
const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const set = (v) => { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } };
/** Show elements with matching `data-lang`, hide the others. */
export function applyLang(lang) {
  document.documentElement.dataset.lang = lang;
  document.querySelectorAll('[data-lang]').forEach((e) => { e.hidden = e.dataset.lang !== lang; });
  document.querySelectorAll('[data-lang-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)));
}
/** Buttons `[data-lang-btn="en|fr"]`; default French (the original). */
export function initI18n() {
  applyLang(get() || 'fr');
  document.querySelectorAll('[data-lang-btn]').forEach((b) => b.addEventListener('click', () => { set(b.dataset.langBtn); applyLang(b.dataset.langBtn); }));
}
