import { initReveals } from '../motion.js';
import { el, table } from '../dom.js';
import { TIMELINE } from '../data/timeline.js';

/** The five headline conclusions (README of the repository). */
const CONCLUSIONS = [
  ['All four modules are in scope.', 'Each meets the Art. 3(1) definition of an AI system. The company is the provider, its customers are deployers, and the LLM vendor is a general-purpose AI model provider upstream.'],
  ['Nothing is prohibited by design, but there are two tripwires.', 'Emotion inference from voice (Art. 5(1)(f)) and manipulative recommendation (Art. 5(1)(a)-(b)) must be engineered out and contractually excluded.'],
  ['Classification follows intended purpose, not technology.', 'Chat agent: limited risk (Art. 50). Document analysis: minimal, until it is used for creditworthiness, hiring or insurance. Image analysis: high-risk through the medical-device route (Art. 6(1), Annex I) when the purpose is diagnostic. Recommendation engine: high-risk when used in an Annex III domain.'],
  ['The calendar has moved.', 'Under the Digital Omnibus (Regulation (EU) 2026/1744), Annex III high-risk obligations apply from 2 December 2027 and Annex I from 2 August 2028. Art. 50 transparency has applied since 2 August 2026.'],
  ['Risk picture.', '22 risks assessed: 6 critical and 15 high before treatment; after treatment no critical risk remains and one high risk (diagnostic false negatives) needs formal board acceptance.'],
];

/** Conclusions as an editorial numbered list (textContent only). Idempotent. */
function buildConclusions() {
  const host = document.getElementById('conclusions');
  if (!host || host.childElementCount) return;
  CONCLUSIONS.forEach(([t, b], i) => {
    const a = el('article', 'conclusion reveal');
    a.append(el('p', 'num', String(i + 1)), el('h3', '', t), el('p', '', b));
    host.append(a);
  });
}

/** Key dates table, straight from the timeline data. Idempotent. */
function buildDates() {
  const host = document.getElementById('key-dates');
  if (!host || host.childElementCount) return;
  table(host, 'Regulatory key dates', [['date', 'Date'], ['milestone', 'Milestone'], ['relevance', 'Relevance to SmartAdvisor AI']], TIMELINE.milestones);
}

buildConclusions();
buildDates();
initReveals();
