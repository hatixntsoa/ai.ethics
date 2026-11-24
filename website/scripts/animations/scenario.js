import { SCENARIO } from '../data/scenario.js';
import { table } from '../dom.js';

const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}, text) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text) e.textContent = text;
  return e;
};

/** Layout transcribed from the Mermaid flowchart in docs/scenario.md, section 4. */
const NODES = {
  U: [10, 125, 'Users: web, mobile, API'], GW: [160, 125, 'API gateway / WAF'], BE: [310, 125, 'Backend services'],
  M1: [450, 20, 'M1 Conversation'], M2: [450, 90, 'M2 Vision service'], M3: [450, 160, 'M3 Document pipeline'], M4: [450, 230, 'M4 Recommendation'],
  STT: [610, 10, 'Speech-to-text / TTS'], LLM: [610, 65, 'Third-party LLM API'], CV: [610, 120, 'Vision models'],
  OCR: [610, 175, 'OCR / NLP'], ML: [610, 230, 'Ranking models'],
  DB: [190, 310, 'Operational data stores'], OBJ: [340, 310, 'Object storage'], LOG: [490, 310, 'Application logs'],
};
const EDGES = [['U', 'GW'], ['GW', 'BE'], ['BE', 'M1'], ['BE', 'M2'], ['BE', 'M3'], ['BE', 'M4'], ['M1', 'LLM'], ['M3', 'LLM'],
  ['M3', 'OCR'], ['M1', 'STT'], ['M2', 'CV'], ['M4', 'ML'], ['BE', 'DB'], ['BE', 'OBJ'], ['BE', 'LOG']];
const W = 130, H = 36;
const cx = (k) => NODES[k][0] + W / 2, cy = (k) => NODES[k][1] + H / 2;

/** Draw the architecture: edges (with flow dashes), then nodes that pop in one by one. Idempotent. */
function drawArchitecture() {
  const svg = document.getElementById('arch');
  if (!svg || svg.querySelector('.edges')) return;
  const defs = svgEl('defs'), marker = svgEl('marker', { id: 'ah', viewBox: '0 0 8 8', refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: 'auto' });
  marker.append(svgEl('path', { d: 'M0 0L8 4L0 8z', class: 'arrow-head' }));
  defs.append(marker); svg.append(defs);
  const edges = svgEl('g', { class: 'edges' });
  for (const [a, b] of EDGES) {
    const down = NODES[b][1] - NODES[a][1] > 150, right = !down && NODES[b][0] > NODES[a][0];
    const x1 = down ? cx(a) : right ? NODES[a][0] + W : cx(a), y1 = down ? NODES[a][1] + H : cy(a);
    const x2 = down ? cx(b) : right ? NODES[b][0] : cx(b), y2 = down ? NODES[b][1] : cy(b), mx = (x1 + x2) / 2;
    edges.append(svgEl('path', { d: down ? `M${x1} ${y1}L${x2} ${y2}` : `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`, class: 'edge flow', 'marker-end': 'url(#ah)' }));
  }
  svg.append(edges);
  Object.entries(NODES).forEach(([k, [x, y, label]], i) => {
    const mod = /^M\d$/.test(k), ext = ['STT', 'LLM', 'CV', 'OCR', 'ML'].includes(k);
    const g = svgEl('g', { class: `node${mod ? ' module' : ''}${ext ? ' external' : ''}`, style: `--i:${i}` });
    g.append(svgEl('rect', { x, y, width: W, height: H, rx: 8 }), svgEl('text', { x: x + W / 2, y: y + H / 2 + 4, 'text-anchor': 'middle' }, label));
    svg.append(g);
  });
  svg.append(svgEl('rect', { x: 598, y: 0, width: 154, height: 280, rx: 12, class: 'boundary' }));
  svg.append(svgEl('text', { x: 675, y: 296, 'text-anchor': 'middle', class: 'boundary-label' }, 'Third-party boundary'));
}

/** Pause or resume the data-flow dashes. */
function wireFlowToggle() {
  const b = document.getElementById('flow-toggle');
  if (!b || b.dataset.bound) return;
  b.dataset.bound = '1';
  b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') === 'true';
    b.setAttribute('aria-pressed', String(!on));
    b.textContent = on ? 'Play flow animation' : 'Pause flow animation';
    document.getElementById('arch').classList.toggle('paused', on);
  });
}

const $ = (id) => document.getElementById(id);
$('sc-context').textContent = SCENARIO.context;
$('sc-out').textContent = SCENARIO.outOfScope;
table($('t-modules'), 'Modules M1 to M4', [['id', 'ID'], ['module', 'Module'], ['inputs', 'Inputs'], ['outputs', 'Outputs'], ['technique', 'Typical technique']], SCENARIO.modules);
table($('t-roles'), 'Roles under the AI Act', [['actor', 'Actor'], ['role', 'Role'], ['basis', 'Basis']], SCENARIO.roles);
table($('t-assumptions'), 'Assumptions A-01 to A-07', [['id', 'ID'], ['assumption', 'Assumption'], ['why', 'Why it matters']], SCENARIO.assumptions);
drawArchitecture();
wireFlowToggle();
