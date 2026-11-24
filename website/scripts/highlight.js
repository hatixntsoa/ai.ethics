const RULES = {
  json: /(?<key>"(?:[^"\\]|\\.)*"(?=\s*:))|(?<str>"(?:[^"\\]|\\.)*")|(?<num>-?\b\d+(?:\.\d+)?\b)|(?<kw>\b(?:true|false|null)\b)/g,
  yaml: /(?<com>#.*$)|(?<key>^[ \t]*-?[ \t]*[\w.\-]+(?=:))|(?<str>"(?:[^"\\]|\\.)*"|'[^']*')|(?<num>\b-?\d+(?:\.\d+)?\b)|(?<kw>\b(?:true|false|null)\b)/gm,
};
/** Lightweight syntax highlighter (json, yaml). Returns a fragment of text nodes and <span class="tok-*">; never uses innerHTML. */
export function highlight(code, lang) {
  const frag = document.createDocumentFragment();
  const re = RULES[lang];
  if (!re) { frag.append(code); return frag; }
  re.lastIndex = 0;
  let last = 0, m;
  while ((m = re.exec(code))) {
    if (m[0] === '') { re.lastIndex++; continue; }
    if (m.index > last) frag.append(code.slice(last, m.index));
    const kind = Object.keys(m.groups).find((k) => m.groups[k] !== undefined);
    const s = document.createElement('span'); s.className = `tok-${kind}`; s.textContent = m[0];
    frag.append(s); last = re.lastIndex;
  }
  if (last < code.length) frag.append(code.slice(last));
  return frag;
}
