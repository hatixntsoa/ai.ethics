# Technical specifications

| | |
|---|---|
| Version | 1.0 (23 November 2026) |
| Purpose | Concrete, implementable formats that support Arts. 9-15 and 72 |
| Note | Values are **illustrative defaults** to be calibrated in the pilot |

## 1. Audit log event schema

Principles: one event per inference and per human decision; **hashes and references instead of raw content**; append-only; time-synchronised; tenant-scoped access.

```json
{
  "event_id": "01J9ZK6V3Q8W2M4N7P0R5T1XAB",
  "timestamp": "2027-03-14T09:21:07.412Z",
  "tenant_id": "t-0421",
  "module": "M2",
  "system_version": "smartadvisor-2.4.1",
  "model": { "id": "vision-derm-v7", "weights_sha256": "9f2c...e1", "prompt_version": null },
  "dataset_versions": ["train-2027-01@c41a", "valid-2027-01@77de"],
  "request": { "input_sha256": "3b8a...90", "input_ref": "obj://tenant/t-0421/in/8812", "input_type": "image/dicom" },
  "output": { "output_sha256": "a1c0...5d", "label": "suspect", "confidence": 0.87, "abstained": false },
  "policy": { "version": "pol-12", "results": ["ai_disclosure:ok", "ood_check:pass", "filter:pass"] },
  "oversight": { "required": true, "reviewer_id": "u-77", "decision": "modified", "decision_ts": "2027-03-14T09:24:40.100Z", "override_reason": "clinical_context" },
  "correlation_id": "c-5a39d2",
  "latency_ms": 640
}
```

| Property | Specification |
|---|---|
| Transport | Asynchronous queue to a write-once store; failure to log triggers an alert and, for HR modules, a safe-failure mode |
| Integrity | Hash chaining or signed batches; periodic verification |
| Retention | At least 6 months (Art. 19(1)); 10 years for documentation (Art. 18); longer if sector law requires |
| Privacy | No raw prompts or images by default; access to references only through audited retrieval |
| Clock | Synchronised time source on all hosts (ISO 27001 8.17) |

## 2. Human oversight routing policy

```yaml
policy_id: oversight-pol-12
modules:
  M2:
    purpose: diagnostic_support
    review: always            # qualified professional before any output reaches a patient
    abstain_below_confidence: 0.60
    ood_score_max: 0.35       # above this: refuse to interpret, route to a human
    display: [confidence, saliency, model_version, limits_notice]
    stop_control: tenant_and_global
  M4:
    purpose: decision_support
    annex_iii_uses_enabled: false      # default off; enabled per tenant after assessment
    review:
      when: ["annex_iii_use == true", "confidence < 0.75"]
      by: authorised_reviewer
    explanation: reason_codes
  M1:
    disclosure: first_interaction
    voice_marking: machine_readable
    tool_actions: require_confirmation
global:
  kill_switch: { owner: cto, tested_every_days: 90 }
  override_logging: mandatory
```

| Review rule | Rationale |
|---|---|
| M2 always reviewed | Health outcome; Art. 14(4)(b) automation bias |
| Abstention below a confidence bound | Avoids presenting weak outputs as findings |
| Annex III uses off by default | Enforces the ring-fencing decision D-3 |
| Overrides logged | Feeds monitoring (Art. 72) and detects drift in operator behaviour |

## 3. Release manifest

```yaml
release: smartadvisor-2.4.1
date: 2027-03-10
code: { repo: git, commit: "e5b1c7a", sbom: "sbom-2.4.1.json" }
models:
  - { id: vision-derm-v7, weights_sha256: "9f2c...e1", eval_report: "eval/vision-derm-v7.md" }
  - { id: reco-rank-v12,  weights_sha256: "52ab...07", eval_report: "eval/reco-rank-v12.md" }
llm_vendor: { name: "vendor-x", model: "pinned-2026-09", change_notice_ack: true }
prompts: { version: "p-38" }
datasets: ["train-2027-01@c41a", "valid-2027-01@77de"]
policy: pol-12
risk_register: { version: "rr-1.7", open_critical: 0 }
substantial_modification: { assessed: true, result: "no", approver: "compliance" }
approvals: [cto, head_of_ml, compliance, ciso]
```

## 4. Test plan (illustrative acceptance criteria)

| Area | Test | Pass criterion | Frequency | Risk |
|---|---|---|---|---|
| Accuracy | Held-out and subgroup performance on the declared metrics | At or above declared values; no subgroup below the agreed floor | Each release | R-04, R-05 |
| Robustness | Corrupted, out-of-distribution and low-quality inputs | Safe failure or abstention; no confident wrong output | Each release | R-07 |
| Adversarial (images, audio) | Perturbation suites | Degradation within the agreed bound | Each release | R-07 |
| Prompt injection | Direct and indirect injection corpus through chat and documents | No data exfiltration and no unauthorised action; critical findings = 0 | Each release; quarterly red team | R-02 |
| Data leakage | Canary secrets and PII probes | No leakage | Each release | R-03, R-16 |
| Fairness | Metrics per relevant subgroup and proxy analysis | Gap within the agreed bound | Each release and monthly in production | R-05 |
| Drift | PSI and KS on key features; performance on labelled samples | PSI below 0.2; alerts handled | Continuous | R-08 |
| Logging | Event completeness vs. request count | 99.9% or better | Daily | R-10 |
| Transparency | Disclosure and marking presence | 100% of sessions | Each release | R-11 |
| Resilience | Load, DoS, cost-cap tests | Service degrades gracefully; budget limits hold | Quarterly | R-15 |
| Oversight | Kill switch and fallback drill | Recovery within target | Quarterly | R-04, R-14 |

Fairness bounds, subgroup definitions and clinical performance thresholds are set per use case with domain experts; a generic ratio such as the "four-fifths" rule is only a screening heuristic and not a legal safe harbour.

## 5. Cryptography and key management

| Topic | Specification |
|---|---|
| In transit | TLS 1.3 everywhere, including service-to-service; certificate automation |
| At rest | AES-256 (authenticated mode) with envelope encryption; per-tenant keys for high-risk data |
| Keys | Managed KMS or HSM; rotation; separation of duties; no keys in code or prompts |
| Secrets | Vault with short-lived credentials |
| Backups | Encrypted, access-logged, restore-tested |

## 6. Explainability and transparency artefacts

| Artefact | Content | Audience |
|---|---|---|
| Model card | Purpose, data, metrics, limits, subgroup performance, version | Deployers, auditors |
| Data card | Source, licence, preparation, bias checks | Auditors |
| Instructions for use | Art. 13 content, generated from the release manifest | Deployers |
| Reason codes | Top factors per M4 recommendation | Reviewers, affected persons |
| AI notice | "Generated by AI" and limits | End users |
