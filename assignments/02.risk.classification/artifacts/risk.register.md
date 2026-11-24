# Risk register: SmartAdvisor AI

| | |
|---|---|
| Version | 1.0 (23 November 2026) |
| Method | [methodology.md](../../../docs/methodology.md): Likelihood (L) x Impact (I), 1-5 each |
| Bands | Low 1-4, Medium 5-9, High 10-14, Critical 15-25 |
| Appetite | No residual risk above Medium without board acceptance; zero tolerance for Art. 5 practices |

Category key: **CY** cyber, **AI** AI-specific, **CO** compliance, **TP** third party, **PR** privacy.

## 1. Register

| ID | Risk (cause, event, consequence) | Mod. | Cat. | L | I | Inherent | Treatment and key controls | Refs | L | I | Residual | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-01 | Intended purpose drifts or is misjudged; M2 or M4 is treated as non-high-risk; regulator finds non-compliance; fines and withdrawal | M2, M4 | CO | 4 | 4 | **16 Critical** | Reduce: documented classification (Art. 6(4)); intended-purpose lock; tenant feature gating; quarterly review | Arts. 6, 9(2)(b); ISO 42001 6.1.4, A.5 | 2 | 4 | 8 Medium | CTO / Legal |
| R-02 | Direct or indirect prompt injection through chat or uploaded documents; agent leaks data or misuses tools | M1, M3 | CY | 5 | 4 | **20 Critical** | Reduce: input and output filtering; privilege separation; no autonomous sensitive actions; content provenance tags; recurring red team | Art. 15(5); OWASP LLM01, LLM05, LLM06; ISO 27001 8.28, 8.29 | 3 | 3 | 9 Medium | CISO |
| R-03 | Personal, confidential or health data sent to third-party LLM or cloud; breach or unlawful transfer | M1, M2, M3 | PR | 4 | 5 | **20 Critical** | Reduce: DPA and zero-retention terms; EU region; redaction and pseudonymisation gateway; DLP; encryption of images | GDPR Arts. 28, 32, 44-46; ISO 27001 5.23, 8.12 | 2 | 4 | 8 Medium | DPO / CISO |
| R-04 | Diagnostic false negative or over-reliance (automation bias) harms a patient | M2 | AI | 3 | 5 | **15 Critical** | Reduce: mandatory qualified review; confidence thresholds and abstention; uncertainty display; clinical validation; post-market surveillance. **Residual needs board acceptance** | Arts. 14(4)(b), 15(1), 72; ISO 42001 A.6.2.4 | 2 | 5 | **10 High** | Medical lead / CTO |
| R-05 | Biased or discriminatory recommendations (protected attributes or proxies) in sensitive use cases | M4 | AI | 4 | 4 | **16 Critical** | Reduce: bias examination; fairness metrics and proxy analysis; human review; FRIA support pack for deployers | Art. 10(2)(f)-(g); ISO 42001 A.7; NIST MEASURE | 2 | 4 | 8 Medium | Head of ML |
| R-06 | Poisoned data or compromised pretrained weights; model behaves maliciously | M2, M4 | CY | 3 | 4 | 12 High | Reduce: provenance and signed artefacts; trusted registries; anomaly checks; isolated training; AI bill of materials | Arts. 10, 15(5); OWASP LLM03, LLM04; ISO 27001 5.21, 8.25 | 2 | 3 | 6 Medium | Head of ML / CISO |
| R-07 | Adversarial or malformed images cause misclassification | M2 | AI | 3 | 4 | 12 High | Reduce: adversarial robustness tests; input validation; out-of-distribution detection; ensembles | Art. 15(5); MITRE ATLAS | 2 | 3 | 6 Medium | Head of ML |
| R-08 | Data or concept drift degrades accuracy unnoticed | M1-M4 | AI | 4 | 3 | 12 High | Reduce: drift monitors (PSI, KS); labelled sampling; thresholds and rollback; post-market monitoring plan | Art. 72; ISO 42001 9.1 | 2 | 3 | 6 Medium | Head of ML |
| R-09 | LLM vendor updates, deprecates or has an outage; behaviour and compliance change silently | M1, M3 | TP | 4 | 3 | 12 High | Reduce: version pinning; regression evaluation suite; fallback vendor; contractual change notice | Art. 53(1)(b); ISO 42001 A.10 | 2 | 3 | 6 Medium | CTO |
| R-10 | Insufficient logs; decisions cannot be reconstructed; compliance and incidents cannot be evidenced | M1-M4 | CO | 3 | 4 | 12 High | Reduce: structured audit log; immutable storage; correlation IDs; time sync; retention of at least 6 months | Arts. 12, 19; ISO 27001 8.15-8.17 | 2 | 3 | 6 Medium | CISO |
| R-11 | Users not told they face an AI; synthetic voice not marked | M1 | CO | 4 | 3 | 12 High | Reduce: AI disclosure at first interaction; machine-readable voice marking; UX tests | Art. 50(1)-(2); Art. 99(4)(g) | 1 | 3 | 3 Low | Product |
| R-12 | Emotion inference in workplace or education triggers a prohibited practice | M1 | CO | 2 | 5 | 10 High | Avoid: remove capability; contractual prohibition; automated scope tests | Art. 5(1)(f) | 1 | 5 | 5 Medium | Product / Legal |
| R-13 | Manipulative or exploitative recommendations (dark patterns, vulnerable users) | M1, M4 | AI | 2 | 5 | 10 High | Reduce: objective-function audit; vulnerability safeguards; kill switch | Art. 5(1)(a)-(b) | 1 | 5 | 5 Medium | Product / Head of ML |
| R-14 | Weak access control on admin, model-registry, prompt and dataset planes | M1-M4 | CY | 3 | 5 | **15 Critical** | Reduce: phishing-resistant MFA; privileged access management; least privilege and just-in-time; segregation of duties; secrets vault | ISO 27001 5.15-5.18, 8.2, 8.5 | 2 | 4 | 8 Medium | CISO |
| R-15 | Denial of service or cost exhaustion ("denial of wallet") on LLM endpoints | M1, M3 | CY | 4 | 3 | 12 High | Reduce: rate limits; quotas; WAF; budget alerts; autoscaling caps | OWASP LLM10; ISO 27001 8.6 | 2 | 2 | 4 Low | SRE |
| R-16 | Model extraction or system-prompt leakage; IP loss | M1, M4 | CY | 3 | 3 | 9 Medium | Reduce: API limits; query anomaly monitoring; no secrets in prompts; access control | OWASP LLM07 | 2 | 2 | 4 Low | CISO |
| R-17 | Serious incident not detected or reported within Art. 73 deadlines | M1-M4 | CO | 3 | 4 | 12 High | Reduce: incident taxonomy aligned to Art. 3(49); 24x7 triage; playbook with 2, 10 and 15-day clocks; legal on call; GDPR 72-hour coordination | Art. 73; ISO 27001 5.24-5.28 | 2 | 3 | 6 Medium | CISO / Legal |
| R-18 | Annex IV technical file incomplete or stale at conformity assessment; delay to market | M2, M4 | CO | 4 | 3 | 12 High | Reduce: documentation as code; CI gate; requirement-to-test-to-evidence traceability; pre-assessment internal audit | Arts. 11, 43; Annex IV | 2 | 3 | 6 Medium | Compliance |
| R-19 | Customers use the system beyond intended purpose or ignore instructions for use | M2, M4 | CO | 3 | 4 | 12 High | Reduce: clear instructions (Art. 13); contract restrictions; onboarding checks; use-case telemetry; right to suspend | Arts. 13, 26 | 2 | 3 | 6 Medium | Product / Legal |
| R-20 | Staff and customers lack AI literacy; oversight is weak | M1-M4 | CO | 4 | 3 | 12 High | Reduce: role-based training; competence matrix; certified oversight operators | Arts. 4, 26(2) | 2 | 2 | 4 Low | HR / Compliance |
| R-21 | Training data lacks a lawful basis or licence; privacy or copyright action | M2, M3, M4 | PR | 3 | 4 | 12 High | Reduce: data inventory; DPIA; legal basis; dataset licensing; minimisation | GDPR Arts. 5-6, 35; Art. 10 | 2 | 3 | 6 Medium | DPO |
| R-22 | Provider established outside the EU without an authorised representative | M2, M4 | CO | 3 | 4 | 12 High | Reduce: appoint EU authorised representative by written mandate; keep documentation available | Art. 22 | 1 | 4 | 4 Low | Legal |

## 2. Heat maps

**Inherent** (rows: Likelihood 5 to 1; columns: Impact 1 to 5)

| L \ I | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **5** | | | | R-02 | |
| **4** | | | R-08, R-09, R-11, R-15, R-18, R-20 | R-01, R-05 | R-03 |
| **3** | | | R-16 | R-06, R-07, R-10, R-17, R-19, R-21, R-22 | R-04, R-14 |
| **2** | | | | | R-12, R-13 |
| **1** | | | | | |

**Residual**

| L \ I | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **5** | | | | | |
| **4** | | | | | |
| **3** | | | R-02 | | |
| **2** | | R-15, R-16, R-20 | R-06, R-07, R-08, R-09, R-10, R-17, R-18, R-19, R-21 | R-01, R-03, R-05, R-14 | R-04 |
| **1** | | | R-11 | R-22 | R-12, R-13 |

## 3. Risks requiring executive decision

| Risk | Why | Decision needed |
|---|---|---|
| R-04 (residual High) | Harm to health cannot be reduced below a High rating by controls alone | Board acceptance, conditional on clinical validation, mandatory qualified review and post-market surveillance |
| R-01 | Business model depends on the ring-fencing decision | Approve D-3 and D-4 ([Assignment 2](../solution.md)) |
| R-03 | Vendor terms determine feasibility | Approve vendor shortlist with zero-retention and EU-region terms |

## 4. Key risk indicators (KRIs)

| KRI | Threshold | Linked risks |
|---|---|---|
| Prompt-injection red-team success rate | Below 5% of attempts; none critical | R-02 |
| Share of model calls via the redaction gateway | 100% | R-03 |
| Diagnostic override rate by reviewers | Reviewed monthly; sudden shifts investigated | R-04 |
| Fairness metric gap across monitored groups | Within the agreed bound | R-05 |
| Population stability index on key features | Below 0.2 | R-08 |
| Log completeness vs. events | 99.9% or better | R-10 |
| Sessions showing the AI disclosure | 100% | R-11 |
| Tenants flagged for out-of-scope use | Zero unresolved over 30 days | R-19 |
| Training completion for oversight operators | 100% before access | R-20 |
