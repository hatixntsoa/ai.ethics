/** Copy text to the clipboard; resolves true on success (textarea fallback). */
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
  const ta = Object.assign(document.createElement('textarea'), { value: text });
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.append(ta); ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  return ok;
}
/** Wire every `button[data-copy="#selector"]`. */
export function initCopyButtons(scope = document) {
  scope.querySelectorAll('button[data-copy]').forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    const label = b.textContent;
    b.addEventListener('click', async () => {
      const src = document.querySelector(b.dataset.copy);
      if (src && await copyText(src.textContent)) { b.textContent = '✓ Copied'; setTimeout(() => { b.textContent = label; }, 1500); }
    });
  });
}
