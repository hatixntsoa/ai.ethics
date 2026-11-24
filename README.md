# ⚖️ AI Ethics

**Cyber risk management applied to the EU AI Act: the *SmartAdvisor AI* case.**

Live website link: [ethics.hatixntsoa.me](https://ethics.hatixntsoa.me)

> **Academic context.** This repository gathers two school assignments completed during **M1 OCC 2026**, in the **AI Ethics** course. The first is a chapter-by-chapter **summary of the EU AI Act**. The second, the exercise "TD AI Act I-II-III", asked for a 2 to 3 page analysis of the SmartAdvisor AI case across Chapters I, II and III of the AI Act. I extended the second into a full cyber risk management case study: a risk register, a compliance matrix, technical specifications and a roadmap, updated to the regulatory position as of November 2026.

The repository starts with a summary of the AI Act, then follows a three-assignment case study that takes a multi-modal AI product (conversational agent, image analysis, document analysis, recommendation engine) through **scoping, risk classification and high-risk compliance** under Regulation (EU) 2024/1689 (the *AI Act*).

It is written the way Cyber GRC work is delivered in practice: scope statement, risk assessment, treatment plan, control mapping, evidence, roadmap. The AI Act is read together with the standards a risk function actually uses: ISO/IEC 27005, ISO/IEC 27001:2022, ISO/IEC 42001, ISO/IEC 23894, NIST AI RMF, NIST SP 800-39 and the GDPR.

> **Position taken throughout:** CTO / head of cyber risk of the *provider* of SmartAdvisor AI, accountable to the board for putting a compliant product on the EU market.

---

## The assignments

| # | Assignment | AI Act focus | Main deliverables |
|---|---|---|---|
| 0 | [AI Act summary](assignments/00.ai.act.summary/) | All chapters (I to XIII) | Chapter-by-chapter summary: scope, key obligations, compliance checklist, definitions, sanctions; update note on the Digital Omnibus |
| 1 | [Scope and definition](assignments/01.scope.and.definition/) | Chapter I (Arts. 1-4) | Definition test, role qualification, technical decomposition, data flows |
| 2 | [Risk classification](assignments/02.risk.classification/) | Chapter II (Art. 5) and the classification rules of Chapter III (Art. 6, Annexes I and III), plus Art. 50 | Prohibited-practice screening, module-by-module classification, [22-risk register](assignments/02.risk.classification/artifacts/risk.register.md) |
| 3 | [High-risk requirements](assignments/03.high.risk.requirements/) | Chapter III Sections 2-4 (Arts. 8-27, 40-49), Arts. 72-73, 86 | Control design, [compliance matrix](assignments/03.high.risk.requirements/artifacts/compliance.matrix.md), [technical specifications](assignments/03.high.risk.requirements/artifacts/technical.specifications.md), [roadmap](assignments/03.high.risk.requirements/artifacts/implementation.roadmap.md) |

Each assignment folder holds a `problem.md` (the brief, deliverables and marking grid) and a `solution.md` (the worked answer).

## Headline conclusions

1. **All four modules are in scope.** Each meets the Art. 3(1) definition of an AI system. The company is the **provider**, its customers are **deployers**, and the LLM vendor is a **general-purpose AI model provider** upstream.
2. **Nothing is prohibited by design, but there are two tripwires.** Emotion inference from voice (Art. 5(1)(f)) and manipulative recommendation (Art. 5(1)(a)-(b)) must be engineered out and contractually excluded.
3. **Classification follows intended purpose, not technology.** Chat agent: limited risk (Art. 50). Document analysis: minimal, until it is used for creditworthiness, hiring or insurance. Image analysis: high-risk through the **medical-device route** (Art. 6(1), Annex I) when the purpose is diagnostic. Recommendation engine: high-risk when used in an **Annex III** domain.
4. **The calendar has moved.** Under the Digital Omnibus (Regulation (EU) 2026/1744), Annex III high-risk obligations apply from **2 December 2027** and Annex I from **2 August 2028**. Art. 50 transparency has applied since **2 August 2026**. See [regulatory.timeline.md](docs/regulatory.timeline.md).
5. **Risk picture.** 22 risks assessed: 6 critical and 15 high before treatment; after treatment no critical risk remains and one high risk (diagnostic false negatives) needs formal board acceptance.

## Repository map

```text
ai.ethics/
├── README.md
├── LICENSE.md
├── docs/
│   ├── scenario.md                 # SmartAdvisor AI: modules, roles, architecture, assumptions
│   ├── methodology.md              # Risk method, scales, framework crosswalk
│   ├── regulatory.timeline.md      # Application dates after the Digital Omnibus
│   └── references.md
└── assignments/
    ├── 00.ai.act.summary/
    │   ├── problem.md
    │   └── solution.md             # Chapter-by-chapter summary (French) + update note
    ├── 01.scope.and.definition/
    │   ├── problem.md
    │   └── solution.md
    ├── 02.risk.classification/
    │   ├── problem.md
    │   ├── solution.md
    │   └── artifacts/risk.register.md
    └── 03.high.risk.requirements/
        ├── problem.md
        ├── solution.md
        └── artifacts/
            ├── compliance.matrix.md
            ├── technical.specifications.md
            └── implementation.roadmap.md
```

## How to read it

- Start with the [AI Act summary](assignments/00.ai.act.summary/solution.md) for the map of the regulation, then [docs/scenario.md](docs/scenario.md) and [docs/methodology.md](docs/methodology.md).
- Read assignments 1 to 3 in order; each ends with a hand-off to the next.
- Every control in the artifacts is mapped to an AI Act article, an ISO/IEC or NIST reference, evidence, an owner and a KPI/KRI.

## Disclaimer

This is an educational case study on a fictitious product. It is **not legal advice**. Regulatory dates and citations reflect the position as of **November 2026**, including secondary commentary on Regulation (EU) 2026/1744; confirm against the Official Journal before relying on them.
