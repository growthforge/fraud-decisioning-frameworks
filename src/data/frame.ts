/* Generated from the content workflow, then reviewed and applied by hand.
   Do not regenerate without re-running scripts/verify.ts — the swimlane geometry
   is asserted there and a longer node label will silently clip. */

export interface Actor { name: string; brings: string; wants: string; blindSpot: string; friction: string }
export interface Handoff { from: string; to: string; what: string; failsHow: string }
export interface Metric { name: string; means: string; limitation: string; useWhen: string; refuseWhen: string }
export interface Technique { name: string; what: string; whyItMatters: string; askedAbout: string }

export const FRAME: {
  overview: string
  thesis: string
  builtFrom: string[]
  notDoing: string[]
  actors: Actor[]
  handoffs: Handoff[]
  fraudVsAml: string
  closing: string
} = {
  "overview": "This is an analytical work product about how fraud rules get proposed, tested, deployed, monitored, tuned and reversed. It is built from a published role description, from public regulatory and industry sources, and from the public shape of a spend-management card product. It holds no firm's internal material, because none of that is public.\n\nRead it as a set of positions rather than a syllabus. Section two sets out who sits around a decisioning function and what each of them is measured on, because most rule disputes are not analytical disputes at all. Section three walks the lifecycle and names the failure mode at each stage. Section four pairs every typology with the innocent behaviour that trips the same rule. Section five lets you move a threshold and watch what it costs. Sections six to nine cover the artefacts a decisioning team produces, a worked change on synthetic data, how rules decay, and the varied outcomes of a rule review.\n\nEvery number in a worked example is synthetic and labelled where it appears. Every claim carries its class: confirmed from a primary source, researched from a reliable secondary one, or inference marked as reasoning rather than fact. Where something is not public, the site says so and stops.",
  "thesis": "A fraud rule is never right or wrong, only a position on a curve, and the job is knowing which curve you are on, where you sit on it, what you paid to get there, and how to get back.",
  "builtFrom": [
    "The published role description for the position, read closely and taken at its word where the title and the body of the advert disagree.",
    "Pleo's own published legal documents: the EEA and UK Master Service Agreements, the UK overdraft terms and conditions effective 13 March 2026, and the US prepaid cardholder agreement.",
    "Pleo's public company material and the public company and regulatory registers, including Companies House and the regulatory references Pleo itself publishes.",
    "Public UK and EU regulatory sources: the FCA Financial Crime Guide, FCA FG24/6, the FCA multi-firm review on the proceeds of fraud and money mules, EBA/GL/2019/04, the PSD2 regulatory technical standards (Commission Delegated Regulation (EU) 2018/389), ECCTA 2023, POCA 2002 and MLR 2017.",
    "Public supervisory and industry standards: Federal Reserve SR 11-7 on model risk management, the Wolfsberg Group's 2024 statement on effective monitoring for suspicious activity, and published card scheme programme material.",
    "Peer-reviewed literature on fraud detection under class imbalance: Dal Pozzolo, Boracchi, Caelen, Alippi and Bontempi in IEEE Transactions on Neural Networks and Learning Systems, and Saito and Rehmsmeier in PLOS ONE, 2015.",
    "Synthetic data, generated for this site, for every worked example, every threshold sweep and every chart."
  ],
  "notDoing": [
    "It does not state any firm's actual fraud rules, thresholds, scenarios or risk logic. Thresholds in particular are portfolio-specific, so quoting one would be worse than useless.",
    "It does not name any firm's decisioning platform, rules engine, vendors or internal systems.",
    "It does not quote or estimate any firm's fraud rate, loss figures, alert volumes, false-positive rate or decline rate. A plausible-looking fabricated number is the fastest way to lose the trust of anyone who has the real one.",
    "It does not describe any firm's approval routes, service levels, escalation paths or team structure.",
    "It does not claim any firm has a particular fraud problem. Where it reasons from a product's public shape, such as prefunded e-money, virtual and vendor cards, multi-entity accounts, auto top-up with an authorised negative balance, or a new UK overdraft, it says plainly that it is reasoning and not reporting.",
    "It does not present any threshold as an industry standard, because there is no such thing, and saying so is itself part of the argument.",
    "It does not offer a recommendation to any named firm, because a recommendation made without that firm's own data is a preference delivered in a confident tone."
  ],
  "actors": [
    {
      "name": "FraudOps",
      "brings": "The only direct read on what an alert looks like when a human actually opens it. FraudOps knows which rules produce cases that resolve in ninety seconds and which produce cases nobody can close, which merchants keep reappearing across unrelated customers, and which customers ring in furious and why. None of that texture survives into a dashboard.",
      "wants": "Measured on queue health: alerts worked, ageing, backlog, time to decision, and confirmed fraud stopped. A rule that doubles the queue makes every one of those numbers worse this week, whatever it does for detection this quarter. That is why the pressure to loosen is constant and legitimate.",
      "blindSpot": "It sees the alerts a rule produced. It cannot see the fraud the same rule stopped silently at the decline layer, and it cannot see what would come through if the rule were loosened. The queue is a sample of the world, and the rules chose the sample.",
      "friction": "FraudOps asks for the rule to be loosened because the alerts are almost all noise, and from inside the queue that is true. Decision Intelligence can see that most of the rule's value sits in declines nobody reviews, so loosening costs detection that never appears in queue statistics. Both readings are accurate about the data each side can see. The only way to settle it is to run the loosened version in shadow mode and count what it would have let through."
    },
    {
      "name": "Decision Intelligence",
      "brings": "The measured view across the whole estate: what each rule fires on, what it catches, what it overlaps with, and what it costs in genuine customers. It is the only function that can attribute an outcome to a rule version rather than to a month.",
      "wants": "Measured on whether changes are evidenced, whether the estate performs as specified, and whether post-deployment reality matches the expected impact written before deployment. That is why it slows things down. A change with no stated expectation cannot be reviewed afterwards, and an unreviewable change is not really a controlled one.",
      "blindSpot": "It works in aggregates, so it can miss the single case that changes the read. It also inherits alert-feedback bias: it only holds labels for what the estate already flagged, so its own evidence has been quietly selected by the rules it is trying to evaluate.",
      "friction": "Its standing friction with everyone else is time. Every other function has a good reason to want the change today, and Decision Intelligence contributes by insisting on the test that makes tomorrow's version defensible. That is a real cost, not a procedural one. Pretending it is free is how governance gets resented instead of used."
    },
    {
      "name": "AML / MLRO",
      "brings": "The legal obligation and the suspicion standard. The MLRO knows when an alert has stopped being a loss question and become a reporting question, and knows what a narrative must contain to hold up years later when nobody remembers the case.",
      "wants": "Measured on coverage, timeliness, the quality of suspicion reporting and the defensibility of the risk assessment. Not on money saved. An outcome where the firm loses money and files a good report is a success by that measure, which is genuinely hard for a loss-driven function to absorb.",
      "blindSpot": "It usually cannot see the decisioning estate's suppression effects. If a threshold moves and a class of behaviour stops generating alerts, the AML function experiences that as quiet rather than as a change, and quiet does not generate a ticket.",
      "friction": "The MLRO may need a customer not to be told why they were stopped, while the fraud instinct is to warn them at once so they stop losing money. On the same alert, the two playbooks point in opposite directions. Decision Intelligence sits between them, because it owns the change that decides whether the alert exists at all."
    },
    {
      "name": "Product",
      "brings": "Ownership of activation, conversion and the shape of the journey. Product knows where customers drop out, what a step-up actually looks like on a phone at a supplier's counter, and which segments the company has staked the year on.",
      "wants": "Measured on activation, conversion, retention and time to first value. Every challenge, hold and decline is a funnel loss, and that loss is immediate, attributable and visible in a weekly review. The fraud prevented is counterfactual and never appears anywhere near the funnel.",
      "blindSpot": "It sees the friction it added. It rarely sees the friction it avoided, and it never sees the loss curve of the version of the product that had no control at all.",
      "friction": "Product argues that a step-up on new customers is killing activation, and it can prove the drop with a clean before-and-after. Decision Intelligence argues that the same population carries a disproportionate share of onboarding fraud, and can prove that too. Neither number is wrong. The resolution is segmentation and a written appetite, not a winner."
    },
    {
      "name": "Engineering",
      "brings": "The latency budget, the data actually available at decision time, and the reality of what the platform can compute inside an authorisation window. Engineering knows which features exist in real time and which exist only in the warehouse several hours later.",
      "wants": "Measured on availability, latency, error rates and change safety. A rule that adds a synchronous lookup to an authorisation path is a reliability risk before it is a fraud control, and a decisioning platform that times out declines everything or approves everything, both of which are catastrophic.",
      "blindSpot": "It sees the cost of shipping the rule. It does not usually see the pattern the rule was written for or how fast that pattern moves, so a two-quarter delivery slot can look perfectly reasonable for a control with a six-week shelf life.",
      "friction": "Engineering says the feature the rule needs cannot be computed in time, so the rule is not shippable however good it is. Decision Intelligence has a backtest proving the rule works, but that backtest ran on warehouse data with no latency constraint. The honest conclusion is often that the rule was never real, and the right response is to redesign it around available features rather than to escalate it upwards."
    },
    {
      "name": "Data",
      "brings": "Ownership of the replay environment, feature definitions and lineage. Data knows whether the field used in a backtest means the same thing in production, and whether it was actually populated at the moment the decision was made.",
      "wants": "Measured on pipeline reliability, correctness and parity between environments. It resists one-off features because every ad hoc definition becomes a permanent liability that somebody will backtest against in two years without knowing what it meant.",
      "blindSpot": "It sees a divergence as a data-quality ticket with a severity rating. It may not see that the same divergence has invalidated the evidence behind a change that is already approved and live, so the urgency reads completely differently from either side of the conversation.",
      "friction": "When the replay environment and production diverge, the backtest was measuring a different world and every number in the approved specification is now unsupported. Data can usually say when the divergence started but not what it changed. Decision Intelligence then has to decide between re-running the analysis and reversing the rule, and there is rarely a clean answer to that."
    },
    {
      "name": "Compliance",
      "brings": "The regulatory expectation and the audit memory. Compliance knows what an examiner will ask for and in what form, and it knows which of last year's changes cannot currently be evidenced at all.",
      "wants": "Measured on whether the control environment is documented, approved and reconstructable. The FCA lists unclear rule rationale and poorly calibrated thresholds as poor practice, so an undocumented change is a finding regardless of how well it performed in production.",
      "blindSpot": "It sees the artefact rather than the behaviour. A rule with an immaculate specification can be decaying badly in live traffic, and nothing in the change record will ever say so.",
      "friction": "Compliance needs the rationale written before the change ships, not reconstructed afterwards. Under an active attack the fraud instinct is to ship now and write it up later, and a reconstructed rationale is always a slightly tidier version of the actual reasoning. Decision Intelligence has to hold the line on the emergency path staying genuinely exceptional, because a bypass used routinely has stopped being a control."
    },
    {
      "name": "Legal",
      "brings": "What can lawfully be said to a customer about a decision, what must be said, and what cannot. Legal owns the contractual grounds for suspension or refusal, tipping-off exposure, the complaints and redress position, and the exact wording of a decline message.",
      "wants": "Measured on avoided liability and defensibility. It prefers decisions resting on a contractual term the firm can point to, and language that is accurate without disclosing detection logic to the person who may be probing it.",
      "blindSpot": "It sees the individual case and the wording. It is not positioned to see that a decline reason generic enough to be safe teaches the customer nothing, generates a complaint, and returns as re-contact volume in the same queue the rule already loaded.",
      "friction": "Legal restricts what a declined customer is told, which is correct and often required. Decision Intelligence needs the customer's response as a labelling signal, and a vague message produces a vague response that is worthless as a label. The workable settlement is usually a structured internal disposition code that is never shown to the customer, kept deliberately separate from the customer-facing wording."
    }
  ],
  "handoffs": [
    {
      "from": "FraudOps",
      "to": "Decision Intelligence",
      "what": "A pattern seen in the queue, written up as a request for a new rule or a threshold change.",
      "failsHow": "It arrives as a description of cases rather than a hypothesis with a population. 'We are seeing a lot of this' cannot be sized, so the first act is to reconstruct the request, which delays it and quietly changes it into something the originator did not ask for. The proposals that survive intact are the ones that named the target population and the action wanted at the point of writing."
    },
    {
      "from": "Decision Intelligence",
      "to": "Data",
      "what": "A request to replay candidate logic over a historic window with mature labels, at feature parity with production.",
      "failsHow": "The window gets chosen for data convenience rather than label maturity, so recent weeks are included where chargebacks and confirmed-fraud labels have not yet arrived. Fraud looks lower than it was and precision looks better than it will be. Nothing reveals the error until the rule goes live and precision falls without anything having changed."
    },
    {
      "from": "Decision Intelligence",
      "to": "Engineering",
      "what": "The approved specification, handed over to be built in the decisioning platform.",
      "failsHow": "The specification is written in analytical language and implemented in platform language, and nobody reconciles the two. Nulls, currency conversion, timezone boundaries and the behaviour when a feature is unavailable all get decided during implementation and never travel back into the document. The live rule and the approved rule then differ, and the difference surfaces only when somebody has to reconstruct a decline months later."
    },
    {
      "from": "Engineering",
      "to": "Decision Intelligence",
      "what": "Confirmation that the rule is live, on what share of traffic, from exactly when.",
      "failsHow": "The effective timestamp gets recorded as the release date rather than the moment the rule began evaluating, and a staged rollout makes those differ by days. Every before-and-after measurement is then computed against the wrong boundary, and a real effect gets attributed to the wrong version of the rule."
    },
    {
      "from": "Decision Intelligence",
      "to": "Compliance",
      "what": "The change record for approval: rationale, logic, scope, expected impact, test evidence, monitoring plan, rollback trigger, owner and version.",
      "failsHow": "The expected impact is written as a direction rather than a number, so the post-implementation review has nothing to test against. 'Expected to reduce false positives' cannot fail. A stated range can fail, and being able to fail is the entire reason for writing it down beforehand."
    },
    {
      "from": "Decision Intelligence",
      "to": "FraudOps",
      "what": "Notice of what changed, what to expect in the queue, and what a triggered alert now means.",
      "failsHow": "The queue notices before the notice arrives. Analysts work new alerts against the old disposition guidance, so dispositions are inconsistent across the change boundary. Those dispositions are the labels that will be used to evaluate the rule, so a communication failure has now contaminated the evidence that decides whether the change worked."
    },
    {
      "from": "FraudOps",
      "to": "AML / MLRO",
      "what": "Escalation of a case that has stopped being a loss question and become a suspicion.",
      "failsHow": "The escalation is treated as the end of the fraud case rather than a parallel obligation, and the fraud action goes first. Telling the customer why they were blocked, which is right in fraud terms, can compromise a live suspicion. The escalation trigger needs to be defined in the rule specification, before any case exists to argue about."
    },
    {
      "from": "AML / MLRO",
      "to": "Decision Intelligence",
      "what": "Notice of which alert populations feed a reporting obligation, so a decisioning change does not silently remove an input to it.",
      "failsHow": "It rarely happens at all, because suppression is not an event. Nobody raises a ticket when alerts stop appearing. Unless the change record explicitly asks which obligations depend on this rule's output, a tuning decision taken purely on precision can reduce reporting coverage without anyone having decided to reduce it."
    },
    {
      "from": "Decision Intelligence",
      "to": "Product",
      "what": "The forecast customer impact of a change, by segment, before it ships.",
      "failsHow": "It is delivered as a rate when Product needs a count in a named segment. A tenth of a per cent sounds negligible and can be several hundred customers in the month they were meant to activate. The argument that follows is usually about units rather than about risk, and it burns the goodwill needed for the next one."
    }
  ],
  "fraudVsAml": "Fraud and AML share almost all of their inputs and almost none of their outputs. Same customer, same transactions, same monitoring stack, same typology thinking, same investigation discipline. Different legal duty, different measure of success, different action at the end.\n\nWhere they genuinely overlap. Fraud proceeds are criminal property, so a confirmed fraud does not end at a write-off. POCA 2002 creates the principal money-laundering offences and, for the regulated sector, a positive duty to report knowledge or suspicion. The fraud analyst is often the first person to form that suspicion. Mule detection is both disciplines at once: the FCA's multi-firm review on the proceeds of fraud and money mules criticises firms for monitoring outbound flows only, expects inbound monitoring, and links detection directly to reporting. The FCA's Financial Crime Guide covers laundering, fraud, bribery and sanctions in a single guide with a shared governance chapter. ECCTA 2023 put failure to prevent fraud on the corporate footing AML has had for years.\n\nWhere they are distinct. Fraud decisioning is real-time, probabilistic and optimised at a threshold, and it tolerates being wrong in both directions because both errors are priced. AML suspicion is retrospective and narrative. A score is not a suspicion, and \"the model flagged it\" is not a report. Fraud is judged on loss, approval rate, false positives and detection latency. AML is judged on coverage, timeliness and defensibility. Optimising either on the other's metric produces bad work.\n\nThe sharpest point is operational. Fraud says decline, block, recover and tell the customer quickly. AML frequently says do not decline yet, do not tell the customer, escalate internally. A fraud analyst who rings a customer to explain a block, which is the right instinct and usually the kind thing to do, can compromise a live suspicion. On the same alert, the two playbooks point in opposite directions.\n\nThe second point is why this seat exists at all. A decisioning change that suppresses alerts also suppresses the input to an obligation, and nobody raises an incident when alerts stop arriving. That is the honest reason a fraud decisioning role sits under an AML title, and it is worth saying out loud rather than treating the title as a mismatch.",
  "closing": "This site is built from three things. The published role description, read closely and taken at its word where the title and the body disagree. Pleo's own published legal documents and public material: the Master Service Agreements for the EEA and the UK, the UK overdraft terms effective 13 March 2026, the US cardholder agreement, the public About page, and the company and regulatory registers. And public regulatory and industry sources: the FCA Financial Crime Guide and FG24/6, the FCA multi-firm review on money mules, EBA/GL/2019/04, SR 11-7, the Wolfsberg Group's 2024 monitoring statement, the PSD2 regulatory technical standards, and peer-reviewed work on fraud detection under class imbalance.\n\nWhat it does not do matters more. It does not describe any firm's actual rules, thresholds, scenarios, risk logic, fraud rates, loss figures, alert volumes or decline rates. Where a firm has published something itself — its legal terms, a product feature, a technology partnership — that is evidence and it is cited. What is not done here is inferring a rule, a threshold or a fraud rate from any of it. Those are not public, and a plausible-looking guess at one is the fastest way to lose the trust of the person who has the real number.\n\nThat is not a limitation to apologise for. Guessing at a firm's internals and presenting the guess as analysis is precisely the failure this discipline exists to prevent. A rule proposal built on an assumed number is not a proposal. It is a preference with arithmetic attached. The argument running through every page here is that you state the evidence you have, state its class, and stop where the evidence stops.\n\nSo the numbers are synthetic and labelled where they appear. The regulatory claims are attributable. The inferences say that they are inferences. What is missing is missing on purpose, and the shape of the gap is part of the work."
}

export const METRICS: Metric[] = [
  {
    "name": "Precision (alert or decline precision)",
    "means": "Of the transactions a rule flagged or declined, the share that were genuinely fraudulent. The Wolfsberg Group's 2024 glossary defines precision as the proportion of positive predictions that are actually positive.",
    "limitation": "It says nothing at all about what was missed. A very tight rule can be ninety-five per cent precise and catch two per cent of the fraud. Precision also moves with the underlying fraud base rate, so the same unchanged rule scores differently in a high-pressure month than in a quiet one, and it is not comparable across segments, channels or periods.",
    "useWhen": "Describing the quality of a queue or a decline population, always alongside recall and always with the operating threshold stated next to it.",
    "refuseWhen": "Comparing two rules that fire on different populations, or comparing one rule across periods when fraud pressure has changed. The number moved, but not because the rule did."
  },
  {
    "name": "Recall / detection rate",
    "means": "Of all the fraud that occurred, the share the rule or the system caught. Wolfsberg defines it as the proportion of actual positive cases correctly identified by the model.",
    "limitation": "The denominator is not observable. You only count fraud that you or the customer detected and reported, so production recall is measured against a known-fraud proxy rather than against truth, and unreported fraud is invisible by construction. Maximising it is also not the objective: Wolfsberg states that aiming for one hundred per cent recall is likely to lead to an ineffective system.",
    "useWhen": "Arguing that a tightening did not cost detection, or sizing what a proposed loosening would give up. Always paired with precision and a stated label maturity window.",
    "refuseWhen": "Presenting it as true coverage, or quoting it on a recent window before labels have matured. Both overstate it, and the second one overstates it in a way that reverses later."
  },
  {
    "name": "False positive rate",
    "means": "The share of genuine transactions incorrectly flagged, held or declined by a control.",
    "limitation": "Under heavy class imbalance a tiny rate is an enormous absolute workload. A rate of 0.1 per cent across a million genuine payments is a thousand false alerts, against perhaps dozens of frauds. Because the denominator is dominated by genuine transactions, the rate barely moves while the queue doubles. This is exactly why precision-recall curves are preferred to ROC on imbalanced data: the PR baseline moves with class distribution, while ROC's fixed baseline hides the false positives piling up (Saito and Rehmsmeier, PLOS ONE 2015).",
    "useWhen": "Comparing the customer-harm side of two candidate thresholds on the identical population, where the denominator is genuinely the same.",
    "refuseWhen": "Using it as a workload measure. Convert it to a count first. Operations staff a queue in alerts per day, never in percentages."
  },
  {
    "name": "Accuracy",
    "means": "The overall proportion of correct predictions across all classes. Defined in the Wolfsberg 2024 glossary, which is close to the only good reason to know it.",
    "limitation": "Actively misleading on a fraud portfolio, and the one metric to refuse in an interview. Fraud is a fraction of a per cent of payment volume, so a rule that approves everything scores well above ninety-nine per cent accuracy and detects nothing whatsoever. The number is dominated by the majority genuine class and carries no information about the minority class the control exists to find.",
    "useWhen": "Almost never here. It has meaning on a balanced classification problem, and a fraud portfolio is not one.",
    "refuseWhen": "Any time it is offered as evidence a control works. Replace it with the confusion matrix, precision and recall at a stated operating point, and a precision-recall curve for the threshold trade. Saying that out loud is the answer to the question."
  },
  {
    "name": "Alert-to-case conversion (and case-to-confirmed-fraud, case-to-report)",
    "means": "The share of alerts escalated to an investigated case, and the share of cases confirmed as fraud or reported onward. The standard operational productivity measure for a monitoring estate.",
    "limitation": "Wolfsberg is explicit that alert and case volumes, alert productivity and alert-to-report ratios are limited in measuring effectiveness, because they focus on the quantity rather than the usefulness of what is produced. It is also gameable in the most dangerous direction available: tighten every threshold and conversion improves while losses rise, because you simply stopped looking.",
    "useWhen": "Tracking whether one rule's output is worth a human opening it, over a stable period with unchanged thresholds.",
    "refuseWhen": "As a headline measure of programme effectiveness, and above all as a target. The moment it becomes a target, the cheapest way to hit it is to detect less."
  },
  {
    "name": "Alert precision at investigator capacity (Pk and card precision CPk)",
    "means": "Detected fraud measured over the maximum number of alerts, or cards, that investigators can actually check per day, rather than over every alert generated. Dal Pozzolo and colleagues define alert precision Pk as true positives within the top k alerts divided by k, recommend card precision CPk for running performance, and a normalised version for comparing configurations offline.",
    "limitation": "It is tied to the staffing constant k, so the metric shifts whenever headcount or shift patterns change and the rules have not changed at all. It also measures only the top of the ranking, and says nothing about behaviour below the review cut-off, which is precisely where undetected fraud lives.",
    "useWhen": "Choosing between candidate configurations when review capacity is the binding constraint, which it usually is.",
    "refuseWhen": "Comparing across teams or across time when k has changed. And never quote it without stating k, because without k it is not a number, it is a mood."
  },
  {
    "name": "Decline / block rate",
    "means": "The share of attempted transactions declined or blocked by the rule set.",
    "limitation": "It is not a fraud metric. The overwhelming majority of declines are genuine customers, so the figure is meaningless without the approval rate for good customers and an estimate of false declines beside it. Moving it up or down proves nothing on its own.",
    "useWhen": "As an operational tripwire. A sudden step change in decline rate is a reliable early signal that something shipped, broke or drifted, even when nobody announced it.",
    "refuseWhen": "As evidence a change worked. A lower decline rate is equally consistent with better targeting and with having switched a control off."
  },
  {
    "name": "False decline rate / genuine-customer impact",
    "means": "Genuine payments, applications or card uses wrongly declined, held or abandoned because of a control.",
    "limitation": "Rarely measured directly, because the counterfactual is unobservable. A declined genuine customer usually just leaves. Every proxy undercounts: successful retry, inbound complaint, contact-centre call, churn, a re-attempt through another provider. Widely circulated claims that false declines cost several times more than fraud come from vendor marketing, so treat the multiples as directional argument rather than as measurement.",
    "useWhen": "Whenever a tightening is proposed. State the proxy being used, and state in the same sentence that it undercounts.",
    "refuseWhen": "Presenting a proxy as though it were the true rate, or comparing your proxy against another firm's, since almost nobody counts it the same way twice."
  },
  {
    "name": "Customer friction measures",
    "means": "Step-up and authentication challenge rate, authentication abandonment, payment delay volumes and durations, complaints, contact rate, and vulnerability flags. For UK payment service providers delaying payments, FCA FG24/6 paragraph 3.7 specifies the record: overall volumes and values of delayed payments, and per transaction the grounds for suspicion, the length of the delay, whether the transaction was ultimately completed or refused, its value, and whether the payer was identified as having characteristics of vulnerability.",
    "limitation": "Friction is not uniformly bad, so driving it to zero is the wrong objective. The Consumer Duty requires firms to include appropriate friction in customer journeys to mitigate the risk of harm, while ensuring customers do not face unreasonable barriers (FG24/6, paragraph 3.19). The measure has to be judged against outcome quality, not minimised.",
    "useWhen": "Pricing the customer side of a threshold move, and evidencing that the friction added was proportionate to the harm it addressed.",
    "refuseWhen": "As a target to minimise. A programme optimised purely on friction removal has an unstated fraud appetite that nobody has ever written down or approved."
  },
  {
    "name": "Fraud rate in basis points (value or count)",
    "means": "Fraud value divided by total value, or count over count, across a rolling window. This is a regulated number and not merely an internal one: the PSD2 regulatory technical standards define the fraud rate as the total value of unauthorised or fraudulent remote transactions over the total value of all remote transactions, calculated on a rolling ninety-day basis (Commission Delegated Regulation (EU) 2018/389, Articles 19 and 21).",
    "limitation": "The denominator choice changes the story completely: value against count, gross against net of recoveries, the whole book against a single channel. Rolling windows lag, so an attack appears late in the number and washes out slowly. It is a poor early-warning signal and a poor basis for a same-week tuning decision.",
    "useWhen": "Regulatory reporting, exemption eligibility, and quarter-on-quarter portfolio trend where the definition is fixed and written down.",
    "refuseWhen": "Comparing your rate to another firm's. Without their denominator, their recovery treatment and their channel mix, the comparison is decoration."
  },
  {
    "name": "Scheme performance ratios",
    "means": "An externally imposed ceiling on combined fraud and dispute performance, set by a card scheme and enforced through remediation rather than through internal appetite. The published worked example is Visa's Acquirer Monitoring Program: fraud plus dispute counts over settled card-not-present transaction counts, with acquirer portfolios identified as Above Standard at 50 basis points and Excessive at 70, and an Excessive Merchant threshold of 220 basis points in several regions reducing to 150 on 1 April 2026 (Visa Acquirer Monitoring Program fact sheet, 2025).",
    "limitation": "It counts fraud and disputes together, so a friendly-fraud problem and a third-party fraud problem land in the same number while implying opposite fixes. It is a portfolio compliance ceiling with consequences attached, not a measure of whether any individual rule is well built. And a programme published by one scheme does not bind a programme on another: the Visa numbers are cited here because they are public and specific, not because they apply everywhere. Read them as the shape of an external ceiling rather than as the ceiling.",
    "useWhen": "Explaining why a fraud programme carries a hard external limit that overrides internal loss appetite, and why the constraint that binds first is often not the one anyone is optimising.",
    "refuseWhen": "Applying one scheme's published thresholds to a programme on a different scheme, or applying acquirer thresholds to an issuer. Different scheme, different side of the transaction, different rulebook, and quoting the wrong one is a fast way to look fluent and be wrong."
  }
]

export const TECHNIQUES: Technique[] = [
  {
    "name": "Champion / challenger",
    "what": "Keep the current live strategy running as champion, route a defined share of traffic or a defined segment to the candidate as challenger, and compare outcomes on comparable populations over the same period. The Wolfsberg 2024 glossary describes it as deploying multiple approaches simultaneously, with the current deployed model competing against challengers that may be retrained versions or entirely new ones.",
    "whyItMatters": "It is the only honest way to claim a change caused an improvement rather than coincided with one. Every other method compares this month to last month, and months differ for a dozen reasons that have nothing to do with the rule.",
    "askedAbout": "What were your stop criteria, and how did you control for seasonality and traffic mix? Anyone who has run one answers with numbers and a date. Anyone who has read about it describes the concept a second time."
  },
  {
    "name": "Shadow mode / silent mode",
    "what": "Run the rule in production against live traffic, log the decision it would have made, and act on nothing. You get true fire volumes and a real, nameable list of the genuine customers it would have blocked, at zero cost to any of them.",
    "whyItMatters": "It closes the gap between an offline backtest and a live decision. EBA/GL/2019/04 paragraph 70 requires testing and approval before first use in environments that adequately reflect production, and shadow mode is how you get production realism without production risk. It also produces the single most persuasive artefact in any review: a reviewed sample of the actual customers who would have been declined.",
    "askedAbout": "How long did you run it, and what seasonality did that window cover? A shadow run that missed a payday, a month end or a quarter end measured a quieter world than the one the rule has to live in."
  },
  {
    "name": "Backtesting and replay",
    "what": "Re-run candidate logic over historic transactions with historic labels, to estimate fire volume, precision, recall, overlap with rules already live, and the count and profile of genuine customers hit, before anything touches live traffic.",
    "whyItMatters": "SR 11-7 names back-testing as a form of outcomes analysis and specifies a sample period not used in model development. It is also where most proposals die cheaply, because they turn out to overlap something already running and add workload without adding detection.",
    "askedAbout": "What was your label maturity window, and how did you avoid leakage? Chargeback and confirmed-fraud labels arrive weeks after the decision, so a backtest that includes last month understates fraud and flatters precision. And any feature encoding what happened after the decision is leakage, however innocent the field name looks."
  },
  {
    "name": "Above-the-line / below-the-line testing (ATL / BTL)",
    "what": "Deliberately raise thresholds above the live setting to find where false positives swamp the team, and lower them below the live setting to find the fraud you were missing. Both directions, sampled and documented. Wolfsberg's 2024 glossary defines both.",
    "whyItMatters": "It is the evidence an auditor asks for when they ask why the threshold is the number it is. It is also the financial-crime vocabulary for threshold justification, and it transfers to fraud without modification, which matters when the same team owns both.",
    "askedAbout": "How far below the line did you actually go? Wolfsberg's own criticism is that firms drop thresholds around ten per cent below current value and that such minor modifications are unlikely to produce meaningful results. A real answer names the range tested and the sampling method used to review what fired down there."
  },
  {
    "name": "Segmentation",
    "what": "Apply different logic or different thresholds to different populations: new against tenured customers, channel, merchant category, corridor, device, amount band, card type, or entity within a multi-entity account.",
    "whyItMatters": "A single threshold across a mixed book is simultaneously too tight for the low-risk segment and too loose for the high-risk one, and it produces a worse trade curve than segmented thresholds at every level of aggregate detection. The PSD2 RTS is itself segmented by amount band, tying reference fraud rates of 0.13, 0.06 and 0.01 per cent to exemption thresholds of 100, 250 and 500 euro for remote card payments.",
    "askedAbout": "How did you choose the segment boundaries, and how do you stop the estate fragmenting? Every segment is another population to monitor, another set of labels thinning out, and another rule nobody reviews. The good answer includes a rule for when a segment no longer earns its own threshold."
  },
  {
    "name": "Threshold tuning",
    "what": "Changing the cut-off at which an existing rule or score fires, without touching the underlying logic.",
    "whyItMatters": "It is the highest-frequency and highest-risk change in a fraud estate. Cheap to make, easy to make informally, and it moves both loss and customer harm the same day. Treating it as configuration rather than as a controlled release with its own evidence, approval and rollback trigger is the most common governance gap in this space.",
    "askedAbout": "Who could change a threshold without a change record, and did that ever actually happen? The answer separates a documented estate from one where the tool's own audit log is the entire history."
  },
  {
    "name": "Rule decay and concept drift",
    "what": "Rules degrade because the world moves. Customer habits evolve and fraudsters change strategies, partly in response to the control itself (Dal Pozzolo et al., IEEE TNNLS). A rule that worked at launch quietly stops catching and starts costing.",
    "whyItMatters": "Drift is adversarial on one side and behavioural on the other, which is why fraud decays faster than credit. SR 11-7 requires periodic review at least annually and more frequently if warranted, and the FCA lists no regular review of system rules and typologies as poor practice.",
    "askedAbout": "What was your decay signal, and how quickly would you have seen it? Falling fire volume can mean the attack stopped or that the attacker adapted around the rule, and those two need opposite responses. Whether the answer distinguishes them is the tell."
  },
  {
    "name": "Alert fatigue",
    "what": "When an estate generates more alerts than can be worked, review quality collapses before volume does. Dal Pozzolo and colleagues note directly that investigators might ignore further alerts when too many false alarms are reported.",
    "whyItMatters": "It converts a precision problem into an undetected-fraud problem, which is the failure mode that never appears on a dashboard. It also makes review capacity a hard design constraint on threshold choice: you cannot ship a rule the queue is unable to absorb, however good its offline precision looks.",
    "askedAbout": "What was your queue capacity in alerts per day, and did you check the proposed threshold against it before approval? Someone who has done the work quotes a capacity number. Someone who has not talks about precision in the abstract."
  },
  {
    "name": "The feedback loop, verification latency and alert-feedback bias",
    "what": "Investigator dispositions and customer-confirmed fraud return as labels. Feedbacks are fast and few; delayed labels are slow and complete, arriving after what Dal Pozzolo and colleagues call verification latency. The same authors warn that the alert-feedback interaction produces a sample selection bias, because you only ever obtain investigated labels for what you already alerted on.",
    "whyItMatters": "This is the sharpest technical point in the domain. If you only learn from what you flagged, the system reinforces its own blind spots, and every performance number you produce is computed on a population your own rules selected. It is the reason below-the-line sampling and random holdouts exist at all.",
    "askedAbout": "Did you hold anything out, and what did you learn from it? An unrestricted holdout costs real money in fraud you knowingly let through, so anyone who has actually run one remembers the argument they had about funding it."
  },
  {
    "name": "Rules versus models",
    "what": "Rules are deterministic, human-authored conditions with an explicit rationale and an instant on or off. Models are learned functions producing a score, with better ranking power and worse explainability. Wolfsberg defines a model as a representation of information learned from data that can be used to make predictions.",
    "whyItMatters": "Mature estates run both in layers rather than choosing between them. Rules give same-day response to a new attack and a defensible reason for a decline. Models give lift. Governance does not split cleanly either: SR 11-7 defines a model as a quantitative method producing quantitative estimates, so a purely deterministic rule may fall outside that definition, but the guidance's own footnote says qualitative approaches not meeting it should still be subject to a rigorous control process. Never argue that rules escape governance.",
    "askedAbout": "When would you write a rule instead of retraining the model? The answer that lands names speed of response, explainability, and the need to give a customer or a regulator a reason, rather than a preference for one technology over the other."
  },
  {
    "name": "Class imbalance and the accuracy paradox",
    "what": "Fraud is a tiny minority class, so overall accuracy is dominated by genuine transactions and a do-nothing system scores near-perfect. Precision-recall curves are preferred to ROC because the PR baseline moves with class distribution, whereas ROC's fixed baseline hides accumulating false positives (Saito and Rehmsmeier, PLOS ONE 2015).",
    "whyItMatters": "It is the standard screening question for a decisioning role, and it is also the reason half the metrics in this domain need a caveat attached. Once imbalance is internalised, the limitation of nearly every other metric follows from it rather than having to be memorised separately.",
    "askedAbout": "What is your operating point, and what does the curve look like either side of it? Quoting a single precision figure with no threshold attached is the tell that the curve was never produced."
  },
  {
    "name": "Layered decisioning architecture",
    "what": "Terminal and authentication controls, then deterministic blocking rules, then scoring rules, then a data-driven model, then a human investigator queue. Each layer carries a different latency budget and a different precision requirement (Dal Pozzolo et al.).",
    "whyItMatters": "It lets you answer where a control belongs and why, with a real answer. A real-time decline needs high precision and sub-second compute, because nobody reviews it before the customer feels it. A scored alert can tolerate much lower precision, because a human resolves it before anything happens to anyone.",
    "askedAbout": "Where would you put this control, and what does that layer cost you? Putting everything at the decline layer is how a fraud programme turns into a complaints programme."
  },
  {
    "name": "Effective challenge and independent validation",
    "what": "Someone with the competence, the incentive and the standing to say no reviews the change before it ships. SR 11-7 calls it critical analysis by objective, informed parties who can identify limitations and produce appropriate changes, generally performed by staff who are not responsible for development or use and have no stake in the outcome.",
    "whyItMatters": "The word doing the work is incentive. A reviewer who reports to the rule author is not effective challenge, however competent and well-meaning they are. SR 11-7 names three validation components: conceptual soundness, ongoing monitoring including benchmarking, and outcomes analysis.",
    "askedAbout": "Name a change that was rejected or materially altered in review. A governance forum that has never stopped anything is a signing ceremony, and everyone who attends it knows that."
  },
  {
    "name": "Rule and model inventory",
    "what": "A maintained register of every rule and model implemented for use, in development, or recently retired, with owner, version, purpose, effective date and review date. SR 11-7 requires exactly this inventory.",
    "whyItMatters": "It is the first artefact an auditor asks for and the one most often out of date. If a rule was disabled in the tool but never retired in the inventory, the firm's documented control environment is factually wrong, and that is a traceability finding regardless of how well the estate is performing.",
    "askedAbout": "How was the inventory reconciled against what was actually live, and how often? The answer is either a reconciliation with a date attached, or a pause."
  },
  {
    "name": "Parallel run",
    "what": "Running the existing and the new system at the same time during a transition, comparing outputs before cutover. Named in the Wolfsberg 2024 glossary.",
    "whyItMatters": "It is distinct from champion/challenger and the two are constantly confused. Parallel run asks whether the new platform reproduces the old one's decisions. Champion/challenger asks which strategy performs better. Conflating them means a migration gets judged on performance, and a genuine reproduction failure gets written up as an improvement.",
    "askedAbout": "What was your tolerance for divergence, and what did you do with the cases that differed? Some divergence is always expected. The question is whether anybody opened the differing cases individually or just looked at the aggregate match rate."
  },
  {
    "name": "Rollback triggers and the kill switch",
    "what": "Numeric conditions agreed before deployment that mandate reverting: decline rate above a stated level, precision below one, complaint volume above one, queue ageing beyond a stated number of hours. Written into the specification, with a named person authorised to pull it and no meeting required.",
    "whyItMatters": "SR 11-7 frames it as outcomes consistently falling outside predetermined thresholds of acceptability, warranting adjustment, recalibration or redevelopment. Pre-agreeing the number removes judgement from the worst possible moment to exercise judgement, which is during a live incident with an audience. Specific trigger values are firm-specific and are not an industry standard.",
    "askedAbout": "Did you ever pull one, and what happened afterwards? Rolling back is easy to describe and expensive to do, because it means telling people the change they approved is being undone. Anyone who has done it remembers the conversation, not the procedure."
  },
  {
    "name": "Transaction risk analysis exemption (TRA)",
    "what": "Under PSD2 a provider may skip strong customer authentication on low-risk remote transactions, but only while its own rolling ninety-day fraud rate stays at or below a reference rate tied to the value band: 0.13 per cent up to 100 euro, 0.06 per cent up to 250 and 0.01 per cent up to 500 for remote card payments. Breaching it must be reported immediately, and the exemption falls away after two consecutive quarters above the reference rate (Delegated Regulation (EU) 2018/389, Articles 18 to 20 and Annex).",
    "whyItMatters": "It is the clearest example anywhere of fraud performance being directly convertible into customer friction. Keep the fraud rate down and you are permitted to authenticate fewer customers. It turns reducing friction from a preference into a measurable, regulated objective, and it gives Product and fraud one shared number to argue about instead of competing anecdotes. Where a firm relies on it, the methodology and reported rates must also be independently audited at least yearly under Article 3.",
    "askedAbout": "Which side of the reference rate were your worst segments sitting on, and what would a tightening there have bought you? The exemption applies at the provider's rate, so one bad segment can cost the friction advantage across the whole book. Anyone who has worked with it knows exactly which segment that was."
  }
]
