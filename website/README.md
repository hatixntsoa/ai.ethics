# AI Ethics website (static)

Static site presenting the `ai.ethics` repository: raw HTML, CSS and vanilla JavaScript (ES modules). No framework, no build step, no external request, no web font.

## Pages
`index.html` (home), and in `pages/`: `ai-act-summary` (12 chapters, tickable checklists, risk pyramid), `scenario` (modules, roles, architecture diagram), `methodology` (scales, appetite, filterable crosswalk), `timeline`, `assignment-1`, `assignment-2` (decision tree, risk register explorer, two heat maps), `assignment-3` (compliance matrix explorer with CSV export, code blocks with copy and highlighting, Gantt, RACI), `references`.
Header search (press `/`) covers all pages.

## Structure
- `styles/`: tokens (light/dark), base, layout, components, pages, motion, print.
- `scripts/`: ES modules. `scripts/data/*.js` is generated content. `scripts/animations/` holds per-page entry points.
- `tools/build-data.py`: optional build-time helper (Python 3, standard library only).

## Updating content
`scripts/data/*.js` is generated from the markdown. After editing the markdown, from this folder:

    python3 tools/build-data.py ../ai.ethics

(`../ai.ethics` is the unzipped source repository.) The site itself never runs Python, and GitHub Pages does not need it.

## Running locally
ES modules do not load from `file://` in Chrome-based browsers. Serve the folder instead:

    python3 -m http.server 8000     # then open http://localhost:8000

## Deploying on GitHub Pages
All paths are relative, so the site works under a project URL (`user.github.io/repo/`). Either make this folder the repository root, or put it in `/docs` and choose "Deploy from a branch", `/docs`.

## Known gaps against the original brief
- Mermaid diagrams in the assignment solutions (and the Assignment 1 data-flow and roles diagrams) are shown as collapsible diagram source, not redrawn as SVG. Only the scenario architecture diagram and the Gantt are hand-drawn SVG.
- No EN/FR toggle: the repository has the French original only, with no English chapter text.
- Not built: audit-log typing animation, human-oversight routing animation, FLIP animation between inherent and residual heat maps, penalty bars, E1-E7 sweep animation, the autonomy-scale marker, the per-chapter scroll-drawn path.
- Not measured: Lighthouse scores and a WCAG audit. The pages were smoke-tested in jsdom (render counts and interactions), not in a real browser.
- Total JS and CSS is about 237 KB uncompressed (76 KB hand-written code, 160 KB generated data), under the 300 KB target.

## Notes for the author
- The AI Act summary has no Chapter XI (it goes from X to XII), so the data has 12 chapters.
- The repository README mentions an English update note at the end of `00.ai.act.summary/solution.md`; it is not in that file. The "Update note (Nov 2026)" panel is built from `docs/regulatory.timeline.md` instead.
- Control 20 (Art. 50) in the compliance matrix has the status "Priority: applicable now" instead of a status value like the others; kept as is.
- The "Third-party boundary" box in the architecture diagram is an addition; the Mermaid source has no boundary.
