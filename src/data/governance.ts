/* The governance and change-control expectations a fraud rule sits inside.
   Every entry is attributed. Where something is industry practice rather than a
   named rule, it says so — claiming a practice is a regulatory requirement when
   it is not is the fastest way to lose an examiner's confidence. */

export interface GovernanceEntry {
  name: string
  source: string
  what: string
  practice: string
  /** how to put it in a sentence, out loud */
  say: string
}

export const GOVERNANCE: GovernanceEntry[] = [
  {
    name: 'A written rationale is effectively expected',
    source: 'FCA Financial Crime Guide — CONFIRMED',
    what: 'The FCA lists as POOR practice that firms do not understand "what the system is detecting and why", that thresholds are poorly calibrated with unclear rule rationales, that off-the-shelf rules are applied without tailoring, that there are insufficient staff to scrutinise alerts, that there is no regular review of rules and typologies, and that technology is not tested before deployment.',
    practice: 'The poor-practice list is the audit checklist inverted. Every one of those six is a question you can be asked directly about a rule you own. The good-practice mirror is rules tested and reviewed, regular effectiveness reviews, monitoring at multiple aggregation levels, and clear documentation of decision rationales and thresholds.',
    say: 'The Financial Crime Guide is quite blunt about it — not understanding what the system is detecting and why is listed as poor practice. So a written rationale is not really optional.',
  },
  {
    name: 'Change management: recorded, tested, assessed, approved, implemented, verified',
    source: 'EBA/GL/2019/04, para 75 — CONFIRMED',
    what: 'The EBA requires a change management process ensuring all changes to ICT systems are "recorded, tested, assessed, approved, implemented and verified in a controlled manner", with emergency changes handled "following procedures that provide adequate safeguards".',
    practice: 'Note the emergency clause. The common failure is not the absence of a change process — it is an emergency path used routinely, so the standard control never actually binds. If most changes go through the fast route, you do not have a change process.',
    say: 'The EBA sets it out as six steps: recorded, tested, assessed, approved, implemented, verified. The interesting one is emergency changes, because that is usually where the control quietly stops applying.',
  },
  {
    name: 'Test environments must reflect production, and be segregated from it',
    source: 'EBA/GL/2019/04, paras 70 and 72 — CONFIRMED',
    what: 'A methodology for testing and approval prior to first use, using "test environments that adequately reflect the production environment"; and segregation of production from development and testing "to ensure adequate segregation of duties and to mitigate the impact of unverified changes to production systems".',
    practice: 'This is why feature parity between the replay environment and production matters so much. If a field is computed differently in replay, the backtest measured a different world and the shadow variance will surprise you.',
    say: 'The requirement is that the test environment adequately reflects production. In practice that means feature parity — if a field is derived differently in replay, you have backtested something that does not exist.',
  },
  {
    name: 'Documentation sufficient for an unfamiliar reader',
    source: 'Federal Reserve SR 11-7 — CONFIRMED',
    what: 'Documentation "sufficiently detailed to allow parties unfamiliar with a model to understand how the model operates, as well as its limitations and key assumptions". Firms should also maintain an inventory of models "implemented for use, under development for implementation, or recently retired".',
    practice: 'The unfamiliar-reader test is the useful one: could someone who has never seen this rule reconstruct why the threshold is the number it is? The inventory is the first artefact an examiner asks for and the one most often out of date — a rule disabled in the tool but not retired in the inventory means the documented control environment is factually wrong.',
    say: 'The test I would apply is whether someone who had never seen the rule could reconstruct why the threshold is where it is. If the logic is in the tool and the reasoning is in a chat thread, it fails that test.',
  },
  {
    name: 'Effective challenge — and why "incentive" is the operative word',
    source: 'SR 11-7 — CONFIRMED',
    what: 'Effective challenge is "critical analysis by objective, informed parties that can identify model limitations and produce appropriate changes", and depends on "a combination of incentives, competence, and influence". Validation is generally done by staff who are not responsible for development or use and "do not have a stake in whether a model is determined to be valid".',
    practice: 'A reviewer who reports to the rule author is not effective challenge, however competent they are. Four-eyes or maker-checker approval is the standard way firms operationalise this, but that is industry practice rather than a named regulatory rule — say so rather than attributing it to a regulator.',
    say: 'The word doing the work in SR 11-7 is incentives. Someone can be perfectly competent and still not be effective challenge, if saying no is expensive for them.',
  },
  {
    name: 'Periodic review, at least annually',
    source: 'SR 11-7 and the FCA Financial Crime Guide — CONFIRMED',
    what: 'SR 11-7 expects "a periodic review — at least annually but more frequently if warranted — of each model to determine whether it is working as intended". The FCA separately lists "no regular review of system rules and typologies" as poor practice.',
    practice: 'Annual is a floor, not a target. Fraud decays faster than credit because the drift is adversarial on one side and behavioural on the other, so a fraud rule reviewed once a year has been wrong for most of that year.',
    say: 'Annual review is the floor. Fraud decays faster than credit, because one side of the drift is adversarial and the other is just customers changing.',
  },
  {
    name: 'Rollback triggers agreed before deployment',
    source: 'SR 11-7 — CONFIRMED',
    what: 'Where results "consistently fall outside the banking organization’s predetermined thresholds of acceptability", model adjustment, recalibration or redevelopment is warranted. The word that matters is predetermined.',
    practice: 'Pre-agreeing the number removes judgement from the worst possible moment to be exercising it. Without a named trigger, switching a rule off becomes a live argument during an incident, between people who each have a different thing to lose. Specific trigger values are firm-specific and are not an industry standard.',
    say: 'The point of a rollback trigger is that you agree the number before you need it. Otherwise turning the rule off becomes an argument in the middle of an incident.',
  },
  {
    name: 'Delayed payments: what the FCA expects on the record',
    source: 'FCA FG24/6, para 3.7 — CONFIRMED',
    what: 'Where a UK payment service provider delays a payment on fraud grounds, the FCA specifies records of overall volumes and values of delayed payments plus, per transaction, "the grounds for suspicion", "the length of the delay", "whether the transaction was ultimately completed or refused", "the value of the transaction" and "whether the PSP identified the payer as having characteristics of vulnerability".',
    practice: 'This turns a fraud control directly into a record-keeping obligation with named fields. It is worth knowing because it is the clearest example of a fraud decision generating a regulatory artefact rather than just a P&L outcome.',
    say: 'If a payment is delayed on fraud grounds the FCA specifies what goes on the record, right down to whether the payer showed characteristics of vulnerability.',
  },
  {
    name: 'Appropriate friction, not zero friction',
    source: 'FCA FG24/6, paras 3.6 and 3.19 — CONFIRMED',
    what: 'Fraud technology should be "calibrated to detect and prevent fraud while minimising the impact on legitimate payments". The Consumer Duty simultaneously requires firms to "include appropriate friction in customer journeys to mitigate the risk of harm" while ensuring customers "do not face unreasonable barriers".',
    practice: 'This is why minimising friction is the wrong objective. The target is calibrated friction. It also means a false decline on a genuine customer is a conduct outcome, not only a revenue one — which changes who in the business gets to care about it.',
    say: 'The Consumer Duty asks for appropriate friction, not no friction. So driving step-ups to zero is not the win it looks like — a false decline is a conduct outcome as well as lost revenue.',
  },
  {
    name: 'Above-the-line and below-the-line testing',
    source: 'Wolfsberg Group, Statement on Effective Monitoring for Suspicious Activity, 2024 — CONFIRMED',
    what: 'Above-the-line testing raises parameters above baseline to find where false positives "might increase, potentially overwhelming investigators with non-suspicious alerts". Below-the-line lowers them to find "the point at which the system may generate false negatives".',
    practice: 'Wolfsberg also criticises the way it is usually done: firms typically only drop thresholds incrementally, around ten per cent below current value, and such "minor modifications to existing parameters are unlikely to produce meaningful results". Naming that criticism is a strong move, because it shows you know the difference between doing the test and doing it usefully.',
    say: 'Above and below the line is the standard method, but Wolfsberg’s own criticism is that firms nudge the threshold ten per cent and learn nothing. If you are going to test below the line, go far enough to actually find the edge.',
  },
  {
    name: 'Aiming for total recall produces an ineffective system',
    source: 'Wolfsberg Group 2024 — CONFIRMED',
    what: 'Wolfsberg criticises "ensuring that no historical SAR/STR is left behind, which results in ineffective and over-alerting monitoring programmes", and states that aiming for 100% recall "is likely to lead to an ineffective system".',
    practice: 'This is the licence to retire a rule. An estate that only ever grows compounds, overlaps, and eventually nobody can say what any individual rule contributes. Volume-based metrics — alert counts, alert productivity, alert-to-SAR ratios — measure quantity rather than usefulness.',
    say: 'Wolfsberg say it directly: aiming for total recall produces an ineffective system. That is the argument for retiring rules, which most estates never do.',
  },
  {
    name: 'Where fraud reporting meets an AML obligation',
    source: 'POCA 2002 and MLR 2017; FCA multi-firm review on money mules — CONFIRMED as to the review',
    what: 'Fraud proceeds are criminal property, and for the regulated sector there is a positive duty to report knowledge or suspicion. The fraud analyst is often the first person to form a suspicion. The FCA’s multi-firm review "Proceeds of fraud — detecting and preventing money mules" sits within financial-crime supervision and links fraud detection directly to SAR filing and National Fraud Database reporting.',
    practice: 'The practical consequence for decisioning is uncomfortable and worth saying out loud: the two playbooks can point in opposite directions on the same alert. Fraud says decline, block, warn the customer. AML may say do not decline, do not tell the customer, escalate to the MLRO. A fraud analyst who rings a customer to explain a block can compromise a live suspicion.',
    say: 'Fraud and AML share almost all of their inputs and almost none of their outputs. Same customer, same data, same monitoring stack — different legal duty and a different action at the end.',
  },
  {
    name: 'ECCTA 2023: failure to prevent fraud',
    source: 'Economic Crime and Corporate Transparency Act 2023, Part 5 — CONFIRMED',
    what: 'A large organisation is criminally liable where an associated person commits a listed fraud offence intending to benefit it, with a defence of having had "such prevention procedures as it was reasonable in all the circumstances to expect the body to have". Large means meeting two of: turnover over £36m, balance sheet over £18m, more than 250 employees.',
    practice: 'Fraud prevention is now a governance obligation in the way AML already was. That is part of why a fraud decisioning seat can sit under a financial crime title without it being an accident of org design.',
    say: 'Since ECCTA, fraud prevention is a governance obligation rather than just a commercial one — which is part of why these two functions keep converging.',
  },
  {
    name: 'The PSD2 transaction risk analysis exemption',
    source: 'Commission Delegated Regulation (EU) 2018/389, Arts. 18–21 and Annex — CONFIRMED',
    what: 'A PSP may skip strong customer authentication on low-risk remote transactions only while its own rolling 90-day fraud rate stays at or below a reference rate tied to the value band: 0.13% up to €100, 0.06% up to €250, 0.01% up to €500 for remote card payments. Exceeding it must be reported immediately, and the exemption lapses after two consecutive quarters above the rate. The methodology and reported rates must be audited at least yearly by operationally independent auditors with IT security and payments expertise.',
    practice: 'This is the clearest example anywhere of fraud performance converting directly into permitted customer friction. Keep the fraud rate down and you are allowed to authenticate fewer customers. It turns "reduce friction" into a measurable, regulated objective rather than a preference.',
    say: 'Under PSD2 the right to authenticate fewer customers is bought with fraud performance. Stay under the reference rate for your value band and you keep the exemption. That is the trade-off written into law.',
  },
]
