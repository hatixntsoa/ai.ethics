import { CLASSIFICATION as C } from './data/classification.js';
import { el } from './dom.js';

/** Questions [text, nextIfYes, nextIfNo], transcribed from the decision procedure in the Assignment 2 solution (section 3). */
const Q = {
  q1: ['Art. 5: prohibited practice?', 'x', 'q2'],
  q2: ['Art. 6(1): safety component of, or itself, a product under Annex I law needing third-party conformity assessment?', 'h1', 'q3'],
  q3: ['Art. 6(2): use case listed in Annex III?', 'q4', 'q5'],
  q4: ['Art. 6(3): no significant risk of harm and a narrow-task condition met, and no profiling of natural persons?', 'note', 'h2'],
  q5: ['Art. 50: interacts with persons, generates synthetic content, infers emotions or categorises biometrically?', 'l', 'm'],
};
const NOTE = 'Not high-risk: document the assessment (Art. 6(4)) and register (Art. 49(2)). Then continue to the Art. 50 question.';
const OUT = {
  x: ['Unacceptable', 'critical', 'Art. 5', 'Do not place on the market. Redesign or remove.'],
  h1: ['High', 'high', 'Art. 6(1), Annex I', 'HIGH-RISK via Annex I'],
  h2: ['High', 'high', 'Art. 6(2)-(3), Annex III', 'HIGH-RISK via Annex III'],
  l: ['Limited', 'medium', 'Art. 50', 'LIMITED RISK: transparency obligations'],
  m: ['Minimal', 'low', 'Residual', 'MINIMAL RISK: voluntary measures'],
};

/** Mount the interactive decision tree into `host`. All choices are native buttons (keyboard operable). */
export function initDecisionTree(host) {
  if (!host || host.dataset.bound) return;
  host.dataset.bound = '1';
  const pick = el('select');
  C.modules.forEach((m, i) => { const o = el('option', '', `${m.module}: ${m.useCase}`); o.value = i; pick.append(o); });
  const label = el('label', '', 'Module and use case '); label.append(pick);
  const ref = el('p', 'banner');
  const path = el('ol', 'dt-path');
  const stage = el('div', 'dt-stage'); stage.setAttribute('aria-live', 'polite');
  const back = el('button', 'btn', 'Back'); back.type = 'button';
  const reset = el('button', 'btn', 'Restart'); reset.type = 'button';
  host.append(label, ref, path, stage, back, ' ', reset);

  let trail = [], current = 'q1';
  const showRef = () => { const m = C.modules[+pick.value]; ref.textContent = `Repository classification for this use case: ${m.tier}. Route: ${m.route}.`; };
  const render = () => {
    path.replaceChildren(...trail.map(([k, a]) => el('li', 'dt-step', k === 'note' ? a : `${Q[k][0]} ${a ? 'Yes' : 'No'}`)));
    stage.replaceChildren();
    back.disabled = !trail.length;
    if (Q[current]) {
      stage.append(el('p', 'dt-q', Q[current][0]));
      const yes = el('button', 'btn', 'Yes'), no = el('button', 'btn', 'No');
      yes.type = no.type = 'button';
      yes.addEventListener('click', () => answer(true)); no.addEventListener('click', () => answer(false));
      stage.append(yes, ' ', no);
    } else {
      const [tier, band, anchor, text] = OUT[current];
      stage.append(el('span', `chip ${band} dt-result`, tier), el('p', '', `Legal anchor: ${anchor}.`), el('p', '', text));
    }
  };
  const answer = (yes) => {
    const [, onYes, onNo] = Q[current];
    trail.push([current, yes]);
    current = yes ? onYes : onNo;
    if (current === 'note') { trail.push(['note', NOTE]); current = 'q5'; }
    render();
  };
  back.addEventListener('click', () => {
    while (trail.length && trail.at(-1)[0] === 'note') trail.pop();
    const last = trail.pop(); if (last) current = last[0];
    render();
  });
  const restart = () => { trail = []; current = 'q1'; render(); };
  reset.addEventListener('click', restart);
  pick.addEventListener('change', () => { showRef(); restart(); });
  showRef(); render();
}
