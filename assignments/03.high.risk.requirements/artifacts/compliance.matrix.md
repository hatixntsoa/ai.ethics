# Compliance matrix: SmartAdvisor AI (high-risk perimeter HR-1 and HR-2)

| | |
|---|---|
| Version | 1.0 (23 November 2026) |
| Scope | Requirement, control, evidence, framework mapping, indicator, owner |
| Applies | HR-2 (M4 Annex III): 2 Dec 2027. HR-1 (M2 via MDR): 2 Aug 2028. Art. 50: applicable since 2 Aug 2026 |
| Status key | Not started / Designed / Implemented / Evidenced |

| # | AI Act | Control objective | Controls (technical and organisational) | Evidence | Framework mapping | KPI / KRI | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Art. 4 | Support AI literacy | Role-based training; competence matrix; onboarding for customers | Training records; matrix | ISO 42001 7.2; ISO 27001 6.3 | Completion rate of required roles | HR / Compliance | Designed |
| 2 | Art. 5 | No prohibited practice | Backlog exclusions; automated scope tests; contract clauses; content-safety filters | Screening record; test reports | NIST GOVERN | Zero prohibited-capability findings | Product / Legal | Designed |
| 3 | Art. 6(4), 49(2) | Documented classification | Classification file per module and use case; quarterly review | Classification records | ISO 42001 6.1.4 | Reviews on schedule | CTO / Legal | Designed |
| 4 | Art. 9 | Continuous risk management | Risk register; foreseeable-misuse analysis; release-gated reviews; metrics and thresholds | Register; review minutes; test plan | ISO 27005; ISO 23894; ISO 42001 6.1.2, 8.2-8.4; NIST MAP/MANAGE | Open critical risks = 0; review cadence met | CTO | Designed |
| 5 | Art. 10 | Quality data governance | Dataset versioning and lineage; data cards; validation pipeline; bias examination; poisoning defences | Data cards; lineage reports; bias reports | ISO 42001 A.7; ISO 27001 5.34, 8.10-8.12 | Datasets with complete data card: 100% | Head of ML | Designed |
| 6 | Art. 11, Annex IV | Complete technical file | Documentation as code; CI completeness gate; traceability matrix | Technical file build; gate logs | ISO 42001 7.5, A.6.2.7 | Missing evidence links at release = 0 | Compliance | Designed |
| 7 | Art. 12 | Automatic event recording | Structured, append-only audit log; time sync; retention; privacy-minimised content | Log schema; retention config; sampling audits | ISO 42001 A.6.2.8; ISO 27001 8.15-8.17 | Log completeness 99.9%+ | CISO | Designed |
| 8 | Art. 13 | Transparency to deployers | Instructions for use generated from the release manifest; in-product limits and confidence display | Instructions for use; UX review | ISO 42001 A.8 | Instructions current at each release | Product | Designed |
| 9 | Art. 14 | Effective human oversight | Risk-tiered routing; oversight console; override and stop controls; operator certification | Policy file; console tests; certification records | ISO 42001 A.9; ISO 27001 5.3 | Override rate monitored; stop control tested quarterly | Medical lead / CTO | Designed |
| 10 | Art. 15(1)-(3) | Accuracy and robustness | Declared metrics; subgroup testing; OOD detection; safe failure; feedback-loop controls | Test reports; thresholds | ISO 42001 A.6.2.4; NIST MEASURE | Metrics within declared bounds | Head of ML | Designed |
| 11 | Art. 15(4)-(5) | Cybersecurity and AI-specific attacks | TLS 1.3; AES-256 with managed keys; segmentation; adversarial and injection testing; signed artefacts; AIBOM; PAM and MFA | Pen-test and red-team reports; crypto configuration | ISO 27001 8.5, 8.8, 8.24, 8.25, 8.28, 8.29; OWASP LLM; MITRE ATLAS | Red-team success below threshold; no open critical vulnerability | CISO | Designed |
| 12 | Arts. 16-17 | Quality management system | QMS integrated with ISMS and AIMS; internal audit; management review | QMS manual; audit reports | ISO 42001 clauses 4-10; ISO 27001 clauses 4-10 | Audit findings closed on time | Compliance | Not started |
| 13 | Arts. 18-19 | Retention of documentation and logs | 10-year documentation retention; logs at least 6 months | Retention policy; storage evidence | ISO 27001 5.33 | Retention checks passed | CISO / Compliance | Designed |
| 14 | Arts. 20-21 | Corrective action; cooperation | Corrective-action procedure; authority contact protocol | Procedure; contact list | ISO 42001 10.2 | Actions closed within SLA | Compliance | Not started |
| 15 | Art. 22 | Authorised representative (if non-EU) | Written mandate with an EU representative; documents available | Signed mandate | n/a | Mandate in place before placement | Legal | Not started |
| 16 | Arts. 25, 53 | Value-chain assurance | Vendor due diligence; contract clauses (documentation, change notices, no training on customer data, EU region); fallback vendor | Contracts; vendor assessments | ISO 42001 A.10; ISO 27001 5.19-5.23 | Vendors with complete assessment: 100% | CTO / Legal | Designed |
| 17 | Arts. 26-27 | Enable deployer compliance | Deployer onboarding; log access; oversight tooling; FRIA pack | Onboarding checklists; FRIA template | ISO 42001 A.10 | Deployers onboarded with checklist | Product / Legal | Designed |
| 18 | Art. 43 | Conformity assessment | Annex VI internal control for HR-2; MDR notified body for HR-1; substantial-modification gate | Assessment report; change records | ISO 42001 9.2 | Assessment passed before date | Compliance | Not started |
| 19 | Arts. 47-49 | Declaration, marking, registration | EU declaration; CE marking; EU database entry | Declaration; registration record | n/a | Completed before placement | Compliance | Not started |
| 20 | Art. 50 | User transparency | AI disclosure at first interaction; machine-readable marking of synthetic voice and generated content; notices for any emotion or biometric features | UX evidence; marking tests | ISO 42001 A.8 | Disclosure shown in 100% of sessions | Product | **Priority: applicable now** |
| 21 | Art. 72 | Post-market monitoring | Monitoring plan; drift, fairness, override and complaint analytics; review cycle | Plan; monthly reports | ISO 42001 9.1; NIST MEASURE | Reports on schedule | Head of ML | Designed |
| 22 | Art. 73 | Serious incident reporting | Taxonomy; 24x7 triage; playbook with 2, 10, 15-day clocks; exercises | Playbook; exercise reports | ISO 27001 5.24-5.28 | Exercise held twice a year; clock compliance | CISO / Legal | Designed |
| 23 | Art. 86 | Explanation to affected persons | Explanation service; reason codes; deployer procedure | Service spec; samples | ISO 42001 A.8 | Explanation delivered within agreed time | Product / ML | Designed |
| 24 | GDPR | Lawful, minimal processing | DPIA; legal basis; minimisation; transfer mechanism | DPIA; records of processing | ISO 27001 5.34 | DPIA complete before launch | DPO | Designed |

## Reading the matrix

- **Evidence** is what an auditor or authority can ask for; if an item cannot be produced on demand, the control is not yet effective.
- **Status** is updated at each steering committee; the roadmap tracks dependencies.
- ISO references indicate where existing management-system evidence can be reused; they do not by themselves demonstrate AI Act conformity.
