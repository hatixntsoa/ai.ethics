const PAGES = [[/00\.ai\.act/, 'ai-act-summary.html'], [/01\.scope/, 'assignment-1.html'], [/02\.risk/, 'assignment-2.html'], [/risk\.register/, 'assignment-2.html#h-register'],
  [/03\.high/, 'assignment-3.html'], [/compliance\.matrix/, 'assignment-3.html#h-matrix'], [/technical\.spec/, 'assignment-3.html#artifacts'],
  [/implementation\.roadmap/, 'assignment-3.html#artifacts'], [/scenario/, 'scenario.html'], [/methodology/, 'methodology.html'],
  [/regulatory\.timeline/, 'timeline.html'], [/references/, 'references.html']];
/** Map a relative markdown link to a site page, or null when there is none. */
const internal = (href) => { const hit = PAGES.find(([re]) => re.test(href)); return hit ? hit[1] : null; };

/**
 * Append inline markdown (bold, italic, code, links) to `parent` using DOM nodes only (no innerHTML).
 * Relative links to repository files are mapped to site pages or shown as plain text.
 */
export function renderInline(parent, text) {
  const re = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(?<![*\w])\*([^*\n]+)\*(?![*\w])/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) parent.append(text.slice(last, m.index));
    if (m[1]) { const b = document.createElement('strong'); renderInline(b, m[1]); parent.append(b); }
    else if (m[2]) { const c = document.createElement('code'); c.textContent = m[2]; parent.append(c); }
    else if (m[5]) { const e = document.createElement('em'); e.textContent = m[5]; parent.append(e); }
    else {
      const href = /^https?:/.test(m[4]) ? m[4] : internal(m[4]);
      if (href) { const a = document.createElement('a'); a.href = href; a.textContent = m[3]; if (/^https?:/.test(href)) a.rel = 'noopener'; parent.append(a); }
      else parent.append(m[3]);
    }
    last = re.lastIndex;
  }
  if (last < text.length) parent.append(text.slice(last));
}
