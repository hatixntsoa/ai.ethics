import { initLayout } from './layout.js';
import { initReveals, initProgress } from './motion.js';
import { initSearch } from './search.js';

initLayout();
initProgress();
initReveals();
initSearch(document.getElementById('site-search'));
document.querySelectorAll('[data-year]').forEach((e) => { e.textContent = String(new Date().getFullYear()); });
