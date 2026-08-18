/* Generated from the content workflow, then reviewed and applied by hand.
   Do not regenerate without re-running scripts/verify.ts — the swimlane geometry
   is asserted there and a longer node label will silently clip. */

import type { LaneMap } from './types.ts'

export const MAPS: LaneMap[] = [
  {
    "id": "rule-lifecycle",
    "tab": "Rule lifecycle",
    "title": "The fraud rule lifecycle",
    "subtitle": "Ten stages of a fraud rule change, compressed into seven columns and split across the four groups that actually touch it. Read it left to right for the lifecycle, top to bottom for who holds what. The argument is in the crossings: almost nothing moves forward without leaving its lane.",
    "principle": "Evidence, authority and effect sit in three separate lanes, and the cost is paid in a fourth that has no power to change anything; the labels that say whether the change was right arrive there weeks late.",
    "legend": "The lanes are cut by what each group can actually do, not by job title. FraudOps sees the behaviour first and pays for every decision made above it, but cannot change a rule. Decision Intelligence produces the evidence and proposes the change, but does not authorise it. The decisioning platform is the only place a change takes effect, which is why the control has to bind there rather than in a policy document. Governance and change control authorises it, records it, and makes it reversible. Cut this way, every deployment edge crosses a boundary, and the only edge running back from consequence to evidence is the slow one at the bottom right.",
    "lanes": [
      "FraudOps",
      "Decision Intelligence",
      "The decisioning platform",
      "Governance & change control"
    ],
    "nodes": [
      {
        "id": "ops-escalation",
        "label": "Escalation from the queue",
        "col": 0,
        "lane": 0,
        "kind": "stage",
        "detail": "The lifecycle starts where the loss is felt. An analyst working the queue sees the same shape three times in a week, or a chargeback batch arrives sharing one merchant, or the scheme sends a compromised account notification. FraudOps writes it up as an observation, not as a rule. What Decision Intelligence needs from this hand-off is the specific behaviour, the accounts it touched, the dates, and what the analyst already ruled out. The artefact is a short escalation note with the case references attached. The value of the note is that it carries the cases, so the analysis starts from real examples rather than from a description of them. FraudOps has no authority to change anything at this point, and that is the correct arrangement. It does hold the strongest signal in the building.",
        "asks": [
          "How many distinct accounts show this, and over what window?",
          "What did the analyst rule out before escalating?",
          "Is this new behaviour, or old behaviour we have stopped catching?",
          "Which existing rule should have fired on these cases, and why did it not?",
          "Is the harm a loss, a customer complaint, or a reporting obligation?"
        ],
        "failure": "A never-again rule written to a single incident with no typology behind it. It encodes one case, generalises badly, and nobody can say afterwards what population it was ever meant to cover."
      },
      {
        "id": "rule-proposal",
        "label": "Candidate rule written",
        "col": 0,
        "lane": 1,
        "kind": "stage",
        "detail": "Decision Intelligence turns the observation into a proposal stating four things: the harm addressed, the population targeted, the plain-language logic, and the action it would take. The action matters more than analysts expect. Alert only, step up, hold and decline are four different controls with four different costs, and choosing between them before any data is pulled forces the author to say what the rule is for. The proposal is deliberately short. It is a hypothesis with a stated typology behind it, not a specification. The FCA Financial Crime Guide lists as poor practice that firms do not understand what the system is detecting and why, and that rule rationales are unclear, so writing the rationale first is not bureaucracy. It is the thing an auditor asks for.",
        "asks": [
          "What typology does this belong to, and what else sits in that family?",
          "Is the right action a decline, a step-up, a hold, or an alert?",
          "What legitimate behaviour looks identical to this?",
          "Which population is in scope, and which is deliberately out?",
          "If this rule never fires, what have we actually lost?"
        ],
        "failure": "The proposal names an action but never a harm. It enters analysis as block cards doing X, and nothing downstream can evaluate it, because there is no stated outcome to measure against."
      },
      {
        "id": "change-register",
        "label": "Change request logged",
        "col": 0,
        "lane": 3,
        "kind": "control",
        "detail": "The proposal gets an identifier before any analysis is done, and everything that follows hangs off it: the backtest, the specification, the approval record, the release timestamp and the eventual retirement. Registering at intake rather than at approval is a small discipline with a large effect, because it makes abandoned proposals visible. A register containing only approved changes cannot show what was considered and rejected, which is exactly what a reviewer wants to see. EBA/GL/2019/04 expects changes to be recorded, tested, assessed, approved, implemented and verified in a controlled manner, and recorded is the first word for a reason. The register is also the only place the rule estate can be counted. If it is not in the register then for governance purposes it does not exist, whatever the tool shows.",
        "asks": [
          "Does the register capture rejected and abandoned proposals, or only approved ones?",
          "Can every live rule be traced back to a request in here?",
          "Who owns the register, and how often is it reconciled against the tool?",
          "Does the identifier follow the change through to retirement?"
        ],
        "failure": "The register is opened at approval rather than at intake. Months of rejected proposals leave no trace, the same idea is re-proposed and re-analysed, and nobody can evidence what was considered and turned down."
      },
      {
        "id": "backtest",
        "label": "Backtest and replay",
        "col": 1,
        "lane": 1,
        "kind": "evidence",
        "detail": "Replay the candidate logic over historic transactions to size fire volume, confirmed-fraud capture and genuine-customer impact before anything touches live traffic. SR 11-7 frames back-testing as outcomes analysis, comparing actual outcomes with forecasts over a sample period not used in development. The output is not one number. It is alerts per day, the confirmed fraud the rule would have caught, the overlap with rules already live, and a list of the genuine customers who would have been hit. That last list is the one people skip and the one that changes minds. Overlap deserves particular attention: a rule catching fraud already caught by three live rules adds queue volume and no detection, while still looking successful on its own fire count.",
        "asks": [
          "What is the label maturity window on this data, and does it cover the period?",
          "Which fields existed at decision time, and which are outcome fields?",
          "How much of this capture is already covered by rules that are live?",
          "What does the list of genuine customers hit actually look like?",
          "Is the sample period representative, or does it contain the incident that prompted this?"
        ],
        "failure": "Label leakage. The replay uses an outcome field that did not exist when the decision was made, such as a chargeback flag or a closed-account marker, and the rule scores beautifully on data it could never have seen in production."
      },
      {
        "id": "replay-env",
        "label": "Replay environment",
        "col": 1,
        "lane": 2,
        "kind": "control",
        "detail": "The replay only means something if the environment reproduces production: the same feature definitions, the same data lineage, the same timing of when a value became available. EBA/GL/2019/04 requires test environments that adequately reflect the production environment, and segregation of production from development and test. Engineering owns this, not the analyst, and the gap between the two is where most sizing errors are born. A feature computed overnight in the warehouse but in real time in production is not the same feature, and a rule tuned against the batch version behaves differently once live. This environment is also where the analyst learns what the platform can evaluate at all. There is no point specifying logic on a field the decision engine cannot see inside its latency budget.",
        "asks": [
          "Are these features computed the way production computes them?",
          "What is available at decision time, and what only arrives afterwards?",
          "Can the engine read this field inside its latency budget?",
          "When was this environment last reconciled against production?"
        ],
        "failure": "The replay runs on warehouse features while production runs on streaming ones. Volumes match closely enough that nobody checks, and the rule fires on a materially different population the day it goes live."
      },
      {
        "id": "trade-curve",
        "label": "Trade curve, not a point",
        "col": 2,
        "lane": 1,
        "kind": "evidence",
        "detail": "Sweep the threshold and produce a curve, not a single recommended value. The financial crime vocabulary for this is above-the-line and below-the-line testing: raise the parameter above the working value to find where false positives start to overwhelm review, and lower it below to find the fraud currently being missed. The deliverable is a sensitivity table with precision and recall at each candidate point, plus the explicit reason for the point chosen. There is no industry standard threshold, and claiming one is a tell. The right value depends on loss appetite, the mix of the book, and how many alerts the team can genuinely work. State the operating point, then state what would have to change for it to move.",
        "asks": [
          "Where does the curve bend, and are we choosing near the bend or out on the flat?",
          "What does below-the-line testing show we are missing at the current setting?",
          "Is precision quoted at a stated operating point, with recall beside it?",
          "Is the gap between two candidate points larger than the noise?",
          "Would a segmented threshold beat this single global one?"
        ],
        "failure": "Token below-the-line testing. The parameter is nudged ten per cent below the live value, nothing much moves, and that is written up as evidence the threshold is right. Wolfsberg names this directly as unlikely to produce meaningful results."
      },
      {
        "id": "capacity-check",
        "label": "Can the queue absorb it",
        "col": 2,
        "lane": 0,
        "kind": "decision",
        "detail": "Before a threshold is chosen, FraudOps has to say whether the projected volume can actually be worked. That is a yes or no from the people who will work it, not an estimate from the people proposing it. Review capacity is a hard ceiling. Dal Pozzolo and colleagues make the operational point plainly: investigators can only check a limited number of alerts per day, and past that point they start ignoring alerts because too many are false. A threshold the queue cannot absorb is not a cautious choice. It is a control failure that surfaces later as undetected fraud, because the backlog quietly swallows the difference. This is also the moment to ask what the rule displaces. Capacity spent here is capacity taken from something already in the queue.",
        "asks": [
          "At this volume, what is the expected backlog by the end of week one?",
          "What comes out of the queue to make room for this?",
          "Is the projected volume steady, or does it spike on a particular day?",
          "Does reviewing these need a skill the current rota does not have?"
        ],
        "failure": "Capacity is assumed rather than asked. The rule ships at a volume the rota cannot work, the backlog absorbs it, and fire counts look healthy for a month while ageing alerts go unreviewed."
      },
      {
        "id": "spec",
        "label": "Spec and rollback trigger",
        "col": 2,
        "lane": 3,
        "kind": "control",
        "detail": "The change is written down so that someone unfamiliar with it can reconstruct it: version, owner, rationale, exact logic and fields, population in and out of scope, the threshold and why that threshold, expected volumes, the monitoring plan, the review date, and the numeric conditions that mandate reverting. SR 11-7 sets the documentation bar as detailed enough for a party unfamiliar with the model to understand how it operates and what its limitations are. EBA/GL/2019/04 asks for documentation that reduces dependency on subject matter experts. The rollback trigger belongs here rather than anywhere later, because it is the one number nobody can agree during an incident. Pre-agreeing it removes the judgement from the worst possible moment to be exercising judgement.",
        "asks": [
          "Could a new joiner rebuild this rule from the specification alone?",
          "What exact number, measured how, means we revert?",
          "Is the expected impact stated so a later review can be measured against it?",
          "Who is the named owner when the author moves team?",
          "What is the review date, and what happens if it passes unactioned?"
        ],
        "failure": "The logic lives in the decisioning tool and the rationale lives in a chat thread. The firm can show what fires but cannot evidence why the threshold is the number it is, which is the most common audit finding pattern in this space."
      },
      {
        "id": "approval",
        "label": "Independent approval",
        "col": 3,
        "lane": 3,
        "kind": "control",
        "detail": "A reviewer with the competence, the standing and the incentive to say no signs the exact version, on the record. SR 11-7 calls this effective challenge and is explicit that it depends on a combination of incentives, competence and influence. The word doing the work is incentives. A reviewer who reports to the rule author is not independent review, whatever the process document says. What gets captured is the approver identity and role, the date, the precise version approved, any conditions attached, and any dissent. Conditions are worth recording separately, because a change approved subject to a shortened shadow window and a lower rollback threshold is a different change from the one proposed. Four-eyes approval is the standard operationalisation across regulated firms, though it is industry practice rather than a named regulatory rule.",
        "asks": [
          "Does the approver have anything at stake in this being approved?",
          "Which exact version was approved, and does it match what deploys?",
          "Were conditions attached, and is anyone tracking them?",
          "Was dissent recorded, or only the outcome?"
        ],
        "failure": "Author self-approval dressed as review. The reviewer is the author's manager, sees the pack twenty minutes before the forum, and approves because the analysis was done by someone trusted rather than because any of it was tested."
      },
      {
        "id": "deploy-gate",
        "label": "Deploy gate on approval",
        "col": 3,
        "lane": 2,
        "kind": "control",
        "detail": "The platform is where a change actually takes effect, so the platform is where the control has to bind. Nothing should be promotable without an approval reference attached, and the tool should enforce that rather than a process everyone agrees to follow. This is segregation of duties made mechanical, and it gives the audit trail its spine, because the deployed version, the approval record and the specification all carry the same identifier. The gate is the difference between a control that binds and a control that is merely honoured. Anything that can be altered in the tool without passing the gate is ungoverned in practice, whatever the change policy says. Threshold edits are the case that decides whether this control is real.",
        "asks": [
          "Can anything reach production without an approval reference?",
          "Who holds standing permission to bypass this, and how often is it used?",
          "Does the deployed version match the approved version exactly?",
          "Is a threshold edit treated as a change, or as configuration?"
        ],
        "failure": "Threshold edits are classed as configuration rather than change and skip the gate entirely. The highest-frequency and highest-impact change in the estate becomes the one change nobody ever approves."
      },
      {
        "id": "shadow-release",
        "label": "Shadow, then a slice",
        "col": 4,
        "lane": 2,
        "kind": "stage",
        "detail": "Run the rule in production against live traffic, logging the decision it would have made without acting on it. Then compare the real would-have-fired volume against the backtest estimate and explain the variance before anything is switched on. Only after that does it take live traffic, on a defined share or a defined segment, with the incumbent strategy still running as champion. The two steps answer different questions. Shadow asks whether the sizing was right. Controlled release asks whether the change improves anything. Both need enough elapsed time to cover the cycles the business actually has, which usually means a full week at minimum and often a full month-end. EBA guidance requires testing and approval prior to first use in environments reflecting production; shadow mode is how you get production realism without production harm.",
        "asks": [
          "Does the shadow window cover the peaks, or only a quiet stretch?",
          "How far off was the backtest estimate, and why?",
          "What share of traffic, and is the split random or segment-based?",
          "What are the pre-agreed criteria for promoting or stopping?"
        ],
        "failure": "A shadow window too short to cover a payday peak or a month-end. Volumes look manageable across four quiet days, the rule is promoted, and the first busy Friday produces several times the projected queue."
      },
      {
        "id": "shadow-sample",
        "label": "Shadow queue dry run",
        "col": 4,
        "lane": 0,
        "kind": "evidence",
        "detail": "The most useful output of shadow mode is not the volume figure. It is the list of genuine customers the rule would have declined, read case by case by the people who would have to handle them. This is the only stage where customer impact is visible before any customer is affected. Reading twenty by hand tells you what no aggregate will: that the rule is catching one recurring supplier, or one country's payroll cycle, or a product behaviour that looks anomalous only because it is uncommon. The sample also lets FraudOps price the disposition. A rule that fires cleanly but takes forty minutes a case to resolve has a very different cost from one resolved in three, and only the people working it can say which it is.",
        "asks": [
          "Of the genuine customers hit, is there a single common explanation?",
          "How long will each of these realistically take to work?",
          "Which of these would we have to contact, and what would we say?",
          "Does any segment appear far more than its share of the book?"
        ],
        "failure": "The shadow report is read as a volume number and the sample is never opened. The rule is promoted, and the first week of alerts turns out to be one legitimate recurring payment pattern repeated across the book."
      },
      {
        "id": "champion-challenger",
        "label": "Champion vs challenger",
        "col": 4,
        "lane": 1,
        "kind": "evidence",
        "detail": "The current live strategy keeps running as champion while the candidate runs as challenger on a comparable slice, over the same period, on comparable populations. This is the only honest way to claim a change caused an improvement rather than coincided with one. Wolfsberg describes it as deploying multiple approaches simultaneously so the incumbent competes with candidates. The design decisions that matter are the split, the run length, and the stop criteria agreed in advance. Fraud volumes are seasonal and attack-driven, so a comparison that is not simultaneous measures the calendar. Decide before the run what difference would be large enough to act on. A difference inside the noise band is not a result, and promoting on one is how estates accumulate rules that do nothing.",
        "asks": [
          "Are champion and challenger running over the same period on comparable traffic?",
          "What difference would be big enough to act on, and was that agreed first?",
          "Has an attack during the run distorted one arm?",
          "Is the split random, or correlated with segment, region or product?"
        ],
        "failure": "Champion and challenger compared over different periods, so what was measured was seasonality and traffic mix rather than rule quality. The challenger wins, ships, and the improvement disappears the following month."
      },
      {
        "id": "emergency-path",
        "label": "Emergency change path",
        "col": 4,
        "lane": 3,
        "kind": "escalation",
        "detail": "There has to be a fast route. An attack in progress cannot wait for a forum that meets on Thursdays, and a control leaving a firm defenceless during an incident is not worth having. EBA/GL/2019/04 accepts emergency changes but requires them to follow procedures with adequate safeguards rather than bypass control altogether. In practice that means a named authoriser available out of hours, a mandatory write-up inside a fixed window, and automatic scheduling into the next governance forum for ratification. The measure of whether this path is healthy is how often it is used. It should be rare and it should be counted. The moment the emergency route becomes the normal route, the standard control has stopped binding and nobody has actually decided to remove it.",
        "asks": [
          "How many changes went through this route last quarter, and what share is that?",
          "Was each one written up and ratified afterwards, or only the first few?",
          "Who can authorise out of hours, and is anyone independent involved?",
          "Did any emergency change stay live past the incident that justified it?"
        ],
        "failure": "The emergency path used routinely because the standard path is slow. Nobody decided to weaken the control, but after a quarter of exceptions the forum is ratifying changes that have already been live for weeks."
      },
      {
        "id": "decision-log",
        "label": "Decision log by version",
        "col": 5,
        "lane": 2,
        "kind": "control",
        "detail": "Every decision the platform makes should be stamped with the rule and the version that made it. Without that, the question an auditor or a complaints handler will ask cannot be answered: which exact logic declined this customer, on what date, and who approved it. Version-stamped logging is also what makes the feedback loop possible at all. When a confirmed fraud comes back weeks later you need to know which rules saw that transaction and what each of them did, including the ones that evaluated it and passed. Logs of non-firing are as valuable as logs of firing. A rule that has quietly stopped catching anything is invisible in a fire-count log and immediately visible in a decision log.",
        "asks": [
          "Can we take one declined transaction and name the version that declined it?",
          "Do we log rules that evaluated and did not fire?",
          "How long are decision logs retained, and does that cover label maturity?",
          "Does the log record the action taken, or only that the rule matched?"
        ],
        "failure": "Only firings are logged. When a fraud gets through, nobody can tell whether the rule evaluated the transaction and passed it or never saw it at all, so the tuning conversation runs on speculation."
      },
      {
        "id": "alert-queue",
        "label": "Alert queue and ceiling",
        "col": 5,
        "lane": 0,
        "kind": "stage",
        "detail": "This is where the cost of every decision upstream is actually paid, and it is the constraint that binds before any other. The queue has a hard capacity: a finite number of alerts that can be worked to a decent standard each day. Push past it and quality collapses before volume does, because reviewers start skimming rather than investigating. That is why alert precision is worth measuring at review capacity, over the top alerts that can genuinely be checked, rather than in the abstract. The queue also absorbs bad decisions silently. Backlog and ageing are the earliest warning that a change went wrong, and they move well before any loss number does. FraudOps sees this first and has no authority to change the rule causing it.",
        "asks": [
          "What is the backlog, and how old is the oldest unworked alert?",
          "What is precision over the alerts we can actually work, not over all alerts?",
          "Which rule contributes most to the backlog, and what is its capture rate?",
          "Are reviewers dispositioning faster than they were a month ago?",
          "What is being closed unreviewed at the end of each day?"
        ],
        "failure": "Monitoring counts fires rather than outcomes. The backlog silently absorbs the cost of a badly tuned rule, so the rule looks healthy on its own dashboard while ageing alerts go out unworked and fraud passes through the gap."
      },
      {
        "id": "rule-performance",
        "label": "Rule-level performance",
        "col": 5,
        "lane": 1,
        "kind": "evidence",
        "detail": "Decision Intelligence measures whether each rule is doing what its specification said it would do: fire rate, precision at the working threshold, confirmed fraud caught, overlap with other rules, and the available proxies for genuine-customer impact. Every one of those numbers has a maturity problem. Precision measured this week gets worse as chargebacks and confirmations arrive, so quoting it without stating the label window is misleading even when nobody intends it to be. Recall is worse still, because the denominator is only the fraud that was detected and reported. Undetected fraud is invisible by definition. The honest framing is that production recall is an estimate against a known-fraud proxy, and it should be presented that way rather than as a measurement.",
        "asks": [
          "What label maturity window is this precision figure computed over?",
          "Has the rule's capture rate decayed since launch, and against what baseline?",
          "What share of this rule's catch is unique to it?",
          "Are we measuring outcome quality, or just fire volume?",
          "What observable thing would tell us this rule has stopped working?"
        ],
        "failure": "Precision quoted on an immature window. The rule reports strong numbers in its first fortnight, the labels then arrive, and the real figure lands materially lower after the change has already been declared a success."
      },
      {
        "id": "mi-pack",
        "label": "MI to people who can act",
        "col": 5,
        "lane": 3,
        "kind": "control",
        "detail": "Monitoring only counts as a control if it reaches someone with the standing to stop something. The FCA expects senior management to receive informative, objective information enabling them to discharge their obligations, which is a higher bar than a dashboard nobody opens. What makes a pack informative is that it surfaces the things people would rather not raise: rules performing below their stated expected impact, backlog ageing, complaint volumes, changes made through the emergency route, and reviews that have passed their date undone. A pack containing only improving numbers is a reporting artefact rather than a control. In the UK, where fraud controls delay payments, FG24/6 also specifies the record required per delayed transaction, including the grounds for suspicion and whether the payer showed characteristics of vulnerability.",
        "asks": [
          "Does this pack show what is going wrong, or only what is going well?",
          "Are rules performing below their stated expected impact named individually?",
          "Who reads this, and what have they ever stopped as a result?",
          "Are overdue reviews and emergency changes visible in it?"
        ],
        "failure": "The pack reports volumes and green statuses. Nothing in it would ever cause a reader to intervene, so the reporting line exists on the organisation chart and changes nothing in the estate."
      },
      {
        "id": "late-truth",
        "label": "Confirmed fraud, late",
        "col": 6,
        "lane": 0,
        "kind": "evidence",
        "detail": "The evidence that says whether a change was right arrives after everyone has moved on. Chargebacks, customer confirmations and investigation outcomes mature over weeks, which Dal Pozzolo and colleagues call verification latency. Investigator feedback is fast but small. Delayed labels are slow but complete. Together they are the only real measure of a decision made a month ago. A subtler problem sits underneath. You only ever get investigated outcomes for what you already alerted on, which biases what you learn towards what you already catch. That is alert-feedback bias, and it is why below-the-line sampling and random holdouts exist. Without them the estate quietly reinforces its own blind spots while reporting improving precision.",
        "asks": [
          "How long until labels for this period are mature enough to quote?",
          "What are we learning about the population the rules never flagged?",
          "Is there a random holdout, and if not, how would we know what we miss?",
          "Do confirmed frauds get traced back to which rule saw them?",
          "Are investigator dispositions and delayed labels reconciled, or used interchangeably?"
        ],
        "failure": "Nothing routes confirmed fraud back to the rule that did or did not catch it. The loop never closes, so tuning runs on alert volumes and analyst impressions rather than on outcomes."
      },
      {
        "id": "decision-outcome",
        "label": "Tighten, loosen, retire",
        "col": 6,
        "lane": 1,
        "kind": "decision",
        "detail": "A rule review has more than two outcomes, and the distribution is the point. Tighten where the capture justifies the friction. Loosen where a segment is being punished for behaviour that turned out to be normal. Add a condition to carve out a population that keeps reappearing in the false positive list. Segment, so new and tenured customers stop sharing one threshold. Retire where the rule's unique contribution has fallen to nothing. Roll back where the change made things worse. And conclude no change, with the evidence written down, which is a legitimate and badly underused outcome. A review programme where every outcome is a tightening is not a review programme. It is a ratchet, and the estate it produces costs more every quarter.",
        "asks": [
          "Of the last ten reviews, how many loosened, segmented or retired anything?",
          "What is this rule's unique contribution now, net of overlap?",
          "Would a carve-out fix this better than a threshold move?",
          "If we changed nothing, what would we expect to happen?",
          "Does this tune go back through the same approval as a new rule?"
        ],
        "failure": "Every review tightens. Rules are only ever added, the estate compounds and overlaps, and eventually nobody can say what any individual rule contributes or what would break if it were switched off."
      },
      {
        "id": "revert",
        "label": "Revert to prior version",
        "col": 6,
        "lane": 2,
        "kind": "outcome",
        "detail": "Reversion happens in the platform and it should be boring. The prior version is retained, the rollback is a single action, and the record it writes states who reverted, when, to which version, and against which pre-agreed trigger. The reason to rehearse it is that rollback is always exercised at the worst moment, under pressure, usually out of hours. If the mechanism is a manual reconstruction of yesterday's logic then it is not a rollback, it is a rebuild, and it takes hours the incident does not have. Retirement is the quieter version of the same action. A rule switched off in the tool is not retired until the inventory says so, and the gap between those two states is a live documentation failure.",
        "asks": [
          "How long does reverting take, and when was it last rehearsed?",
          "Is the prior version retained and immediately deployable?",
          "Does the revert write its own record, or must someone remember to?",
          "Who can execute this at three in the morning?"
        ],
        "failure": "No named rollback trigger and no rehearsed mechanism, so switching a rule off becomes a live argument during an incident about whether things are bad enough yet."
      },
      {
        "id": "retire-inventory",
        "label": "Retire, update inventory",
        "col": 6,
        "lane": 3,
        "kind": "control",
        "detail": "The inventory is the first artefact an auditor asks for and the one most often out of date. SR 11-7 expects a maintained register of what is implemented, what is in development and what has recently been retired. Retirement is a change like any other, so it carries the same approval, the same rationale and the same record. The specific failure to avoid is a rule disabled in the tool but still live in the inventory, or the reverse. Either way the documented control environment is factually wrong, and the firm's own map of what protects it no longer matches what is running. This is also where the post-implementation review lands, comparing what actually happened against the expected impact written into the specification months earlier.",
        "asks": [
          "Does the inventory reconcile to what is live in the tool, and how often is that checked?",
          "Was the post-implementation review done against the expected impact as written?",
          "Are retired rules kept with their retirement date and reason?",
          "How many rules are past their review date right now?"
        ],
        "failure": "A rule disabled in the tool but never retired in the inventory. The documented control map claims a protection the firm no longer has, and nobody notices until an auditor tests one entry at random."
      }
    ],
    "edges": [
      {
        "from": "ops-escalation",
        "to": "rule-proposal",
        "kind": "handoff",
        "label": "the pattern, with its cases"
      },
      {
        "from": "rule-proposal",
        "to": "change-register",
        "kind": "handoff",
        "label": "an id before any analysis"
      },
      {
        "from": "ops-escalation",
        "to": "emergency-path",
        "kind": "escalate",
        "label": "a live incident takes the fast path"
      },
      {
        "from": "rule-proposal",
        "to": "backtest",
        "kind": "flow",
        "label": "a hypothesis, not yet a rule"
      },
      {
        "from": "replay-env",
        "to": "backtest",
        "kind": "handoff",
        "label": "feature parity or the sizing lies"
      },
      {
        "from": "backtest",
        "to": "trade-curve",
        "kind": "flow",
        "label": "size it before you tune it"
      },
      {
        "from": "trade-curve",
        "to": "capacity-check",
        "kind": "handoff",
        "label": "projected load, sent to be staffed"
      },
      {
        "from": "capacity-check",
        "to": "spec",
        "kind": "handoff",
        "label": "the queue answers yes or no"
      },
      {
        "from": "trade-curve",
        "to": "spec",
        "kind": "handoff",
        "label": "operating point and the reason"
      },
      {
        "from": "change-register",
        "to": "spec",
        "kind": "flow",
        "label": "the id the spec is written to"
      },
      {
        "from": "spec",
        "to": "approval",
        "kind": "flow",
        "label": "one version, one named approver"
      },
      {
        "from": "approval",
        "to": "deploy-gate",
        "kind": "handoff",
        "label": "the approval id unlocks it"
      },
      {
        "from": "deploy-gate",
        "to": "shadow-release",
        "kind": "flow",
        "label": "shadow first, nothing acted on"
      },
      {
        "from": "shadow-release",
        "to": "shadow-sample",
        "kind": "handoff",
        "label": "the declines it would have made"
      },
      {
        "from": "shadow-sample",
        "to": "champion-challenger",
        "kind": "handoff",
        "label": "genuine customers, read by hand"
      },
      {
        "from": "shadow-release",
        "to": "decision-log",
        "kind": "flow",
        "label": "promoted, every decision stamped"
      },
      {
        "from": "champion-challenger",
        "to": "rule-performance",
        "kind": "flow",
        "label": "promote, hold or stop"
      },
      {
        "from": "shadow-sample",
        "to": "alert-queue",
        "kind": "flow",
        "label": "projected load becomes real load"
      },
      {
        "from": "decision-log",
        "to": "rule-performance",
        "kind": "handoff",
        "label": "which version declined whom"
      },
      {
        "from": "alert-queue",
        "to": "rule-performance",
        "kind": "handoff",
        "label": "backlog and ageing, not fires"
      },
      {
        "from": "rule-performance",
        "to": "mi-pack",
        "kind": "handoff",
        "label": "MI someone could object to"
      },
      {
        "from": "rule-performance",
        "to": "decision-outcome",
        "kind": "flow",
        "label": "tighten, loosen, segment, retire"
      },
      {
        "from": "alert-queue",
        "to": "late-truth",
        "kind": "flow",
        "label": "chargebacks and confirmations"
      },
      {
        "from": "mi-pack",
        "to": "retire-inventory",
        "kind": "flow",
        "label": "annual review, inventory check"
      },
      {
        "from": "decision-outcome",
        "to": "revert",
        "kind": "handoff",
        "label": "the change takes effect here"
      },
      {
        "from": "decision-outcome",
        "to": "retire-inventory",
        "kind": "handoff",
        "label": "retirement is a change too"
      },
      {
        "from": "alert-queue",
        "to": "retire-inventory",
        "kind": "escalate",
        "label": "rollback trigger tripped"
      },
      {
        "from": "emergency-path",
        "to": "decision-log",
        "kind": "handoff",
        "label": "straight to production, no shadow"
      },
      {
        "from": "late-truth",
        "to": "backtest",
        "kind": "loop",
        "label": "labels mature weeks after the change"
      },
      {
        "from": "decision-outcome",
        "to": "spec",
        "kind": "loop",
        "label": "a tune re-enters the same control"
      }
    ]
  },
  {
    "id": "two-costs",
    "tab": "The two costs",
    "title": "The two costs of every rule decision",
    "subtitle": "The same seven lifecycle stages, cut by who pays for them. The top lane is what a decision does to detection. The bottom lane is what the identical decision does to the person on the other side of it. Read any column top to bottom and you are reading one lever being pulled in two directions at once.",
    "principle": "Almost every move on this map buys one currency with the other; only three of them pay in both, and finding those three is the actual skill.",
    "legend": "Lane one reads the lifecycle as the detection function experiences it. Lane two reads the identical seven stages as the customer experiences them. The cut is deliberate: these are not two processes, they are one process priced in two currencies, which is why every column carries a pairing edge naming what is being traded at that stage. Node type carries the direction. A control node tightens detection and spends customer experience to do it. An outcome node loosens, returning customers at a stated cost in detection. A decision node is one of the small number of moves that improve both at once, and there are exactly three on this map: segment the threshold, build the missing feature, retire the decayed rule. Everything not marked as a decision is a trade, however it was described in the meeting.",
    "lanes": [
      "What it does to detection",
      "What it does to the customer"
    ],
    "nodes": [
      {
        "id": "harm-population",
        "label": "Harm and population",
        "col": 0,
        "lane": 0,
        "kind": "control",
        "detail": "A proposal names three things: the harm, the population it will touch, and the action it will take. All three cap detection before any data is seen. Write the rule to a typology and it generalises to the next variant of the attack. Write it to last week's loss event and it catches last week's loss event again. Fraud strategy holds the pen, sourced from FraudOps escalations, intelligence and scheme notifications. The artefact is a one-page proposal with plain-language logic and the harm stated in money and in customers. The FCA Financial Crime Guide lists unclear rule rationale, and firms not understanding what the system is detecting and why, as poor practice, so the written rationale is an expectation rather than a courtesy. The detection cost of getting this stage wrong stays invisible: you never see the fraud a badly scoped rule was never pointed at.",
        "asks": [
          "What is the harm here, in money and in customers?",
          "Is this a typology, or one incident with a rule wrapped round it?",
          "What population does this touch, and how large is it?",
          "What would this have caught last quarter that nothing live already catches?",
          "What action does it take on the first fire?"
        ],
        "failure": "A never-again rule written to a single incident with no typology behind it. It encodes one case, generalises badly, and a year later nobody can say what it contributes."
      },
      {
        "id": "action-ladder",
        "label": "Decline or step up",
        "col": 0,
        "lane": 1,
        "kind": "outcome",
        "detail": "The same logic can decline at the terminal, hold the payment, step the cardholder up to a challenge, or alert only. That choice is the entire customer cost of the rule and it is made before any data arrives. Alert-only costs the customer nothing and costs the queue everything. A hard decline costs the customer a failed payment in front of a supplier and costs the queue almost nothing. Choosing the softest action that still interrupts the harm loosens the customer cost without touching the logic, which makes the action ladder the cheapest lever on this map. The Consumer Duty frames the target as appropriate friction rather than zero friction, and the FCA expects fraud technology to be calibrated to prevent fraud while minimising the impact on legitimate payments (FG24/6).",
        "asks": [
          "Does this decline, hold, step up, or only alert?",
          "What confidence band would justify a hard decline rather than a challenge?",
          "What does the customer see at the moment it fires, and who can they reach?",
          "Is there a softer action that still interrupts the harm?",
          "Who absorbs the error if we are wrong: the customer, the queue, or us?"
        ],
        "failure": "The action gets picked from how the proposer feels about the typology rather than from the confidence of the logic, so a mid-confidence signal hard-declines a genuine payment at the till."
      },
      {
        "id": "replay-history",
        "label": "Replay on history",
        "col": 1,
        "lane": 0,
        "kind": "control",
        "detail": "Replay the candidate logic over historic transactions using the labels that existed at decision time. That gives fire volume, confirmed-fraud capture, and, critically, overlap with rules already live, because most of what a new rule catches is usually already being caught by something else. SR 11-7 treats back-testing as a form of outcomes analysis and specifies a sample period not used in development. Two traps sit here. Label leakage, where the replay sees an outcome that did not exist when the decision was made. And label immaturity: chargeback and confirmed-fraud labels arrive weeks after the transaction, so a recent window understates fraud and flatters the false-positive count. State the label maturity window before quoting any precision figure from a replay, or that figure will worsen on its own after go-live with nothing having changed.",
        "asks": [
          "Which labels existed at decision time, and which arrived weeks later?",
          "How much of this capture is already covered by a live rule?",
          "Have the labels in this window matured?",
          "Does the replay environment have feature parity with production?",
          "What does the curve look like at the thresholds either side of the proposal?"
        ],
        "failure": "Backtesting on outcome data that did not exist at decision time, or on a window too recent for labels to have matured, so the rule looks sharper on paper than it will ever be in production."
      },
      {
        "id": "count-hit",
        "label": "Count who gets hit",
        "col": 1,
        "lane": 1,
        "kind": "control",
        "detail": "The same replay produces the genuine customers the rule would have stopped. Do not report that as a rate. Produce the list, then read fifty of them by cardholder, merchant and amount, because detection is a distribution and customer impact is a set of individuals. On a spend product the reading is uncomfortable. The false positives are usually a finance lead onboarding several overseas vendors in one afternoon, or an employee travelling for the first time, which is the product's happy path firing every novelty signal at once. Illustrative arithmetic, synthetic: a false-positive rate of one in a thousand genuine payments sounds like a rounding error and is a thousand blocked people per million. Class imbalance means the rate barely moves while the absolute count and the queue both climb.",
        "asks": [
          "How many genuine customers, as an absolute count rather than a rate?",
          "What do fifty of them actually look like?",
          "Which segment absorbs most of the impact?",
          "Would we recognise any of these as our best customers?",
          "How does a wrongly blocked customer get this reversed, and how fast?"
        ],
        "failure": "Reporting a false-positive rate instead of an absolute count, so a number that reads as negligible hides a queue nobody costed and a population nobody ever read."
      },
      {
        "id": "better-features",
        "label": "Better features first",
        "col": 1,
        "lane": 0,
        "kind": "decision",
        "detail": "The first move that breaks the pattern. Before touching a threshold, improve the separation between the two score distributions: add device and session intelligence, entity resolution across bank account, address and directorship, the card's own trailing baseline instead of an absolute limit, and a peer cohort of comparable cardholders. Better separation raises detection at the same false-positive cost, which is the only thing on this map that does not buy one currency with the other. It is slower, it needs data engineering, and it does not read as decisive in a meeting, which is exactly why teams reach for the threshold instead. The test is simple. If the two distributions overlap heavily, no threshold position is good, and moving it only chooses which kind of error you would rather have.",
        "asks": [
          "Where do the two score distributions actually overlap?",
          "What feature would separate the false positives we just read?",
          "Is this rule weak on logic, or weak on data?",
          "What would the feature cost, against the friction we would otherwise spend forever?",
          "Does the feature exist at decision latency, not just in the warehouse?"
        ],
        "failure": "Reaching for the threshold because it is the fastest thing to change. A badly separated score cannot be fixed by moving the cut-off, and the team ends up arguing about a number instead of about the data behind it."
      },
      {
        "id": "threshold-sweep",
        "label": "Sweep, not a point",
        "col": 2,
        "lane": 0,
        "kind": "control",
        "detail": "Produce a trade curve, not a single point. The named method is above-the-line and below-the-line testing: raise the parameter above the live setting to find where false positives swamp the reviewers, lower it below to find the fraud you were missing (Wolfsberg 2024). Every step tighter buys confirmed fraud and spends genuine customers, and the exchange rate is not constant along the curve. There is no industry-standard threshold. Thresholds are portfolio-specific, and anyone quoting one is quoting somebody else's book. The chosen operating point needs a stated reason: loss appetite, review capacity, or a regulatory or scheme ceiling. Wolfsberg's own criticism of the field is that firms drop thresholds only marginally below the current value, and that minor modifications to existing parameters are unlikely to produce meaningful results.",
        "asks": [
          "What does the whole curve look like, not just the proposed point?",
          "Why this point rather than the one either side of it?",
          "Which constraint binds first: appetite, capacity, or a regulatory ceiling?",
          "How far below the line did we genuinely test?",
          "At this point, how many genuine customers do we spend per fraud caught?"
        ],
        "failure": "Token below-the-line testing that nudges the existing number a few per cent and learns nothing, then a threshold defended as an industry standard when no such standard exists."
      },
      {
        "id": "friction-budget",
        "label": "Friction budget set",
        "col": 2,
        "lane": 1,
        "kind": "control",
        "detail": "Write down the customer cost the operating point buys, before it goes live, in the same document as the detection number. Expected step-up rate, expected declines, expected inbound calls, expected payments held and for how long. If only the detection number is specified, the customer cost has no target, therefore cannot be breached, and the rule ships with a monitoring plan that can only ever report good news. Where a UK payment is delayed on suspicion, the FCA specifies the record: overall volumes and values, and per transaction the grounds for suspicion, the length of the delay, whether the transaction was ultimately completed or refused, the value, and whether the payer had characteristics of vulnerability (FG24/6, para 3.7). Those are monitoring obligations, so build the fields at specification time rather than retrofitting them after the first complaint.",
        "asks": [
          "What step-up and decline volumes are we forecasting?",
          "How long will a held payment sit before a human sees it?",
          "Who can a blocked customer reach, and within what time?",
          "Are the delayed-payment fields captured at decision time?",
          "What level of friction would count as too much, and who agreed that number?"
        ],
        "failure": "The specification carries an expected impact for detection and none for the customer, so the post-implementation review has nothing to fail against on the side that hurts people."
      },
      {
        "id": "segment-threshold",
        "label": "Segment the threshold",
        "col": 2,
        "lane": 0,
        "kind": "decision",
        "detail": "The second move that breaks the pattern. A single global threshold across a mixed book is simultaneously too tight for the low-risk population and too loose for the high-risk one, so it loses on both axes at the same time. Split by tenure, channel, amount band, merchant category, corridor or device, and set a threshold per cell. Detection rises where the risk actually is and friction falls where it is not, in one change. This is not exotic: the PSD2 regulatory technical standards are themselves segmented by amount band, with reference fraud rates of 0.13%, 0.06% and 0.01% attached to exemption thresholds of EUR 100, 250 and 500 for remote card payments. The cost is complexity. More cells means more logic to monitor, more places to decay, and less data in each cell to tune on.",
        "asks": [
          "Which variable actually separates these populations?",
          "Is each segment large enough to tune on, or are we fitting noise?",
          "How many cells can we realistically monitor and review?",
          "Does the segmentation encode anything we could not defend to a regulator?",
          "Which segment is getting loosened, and has anyone said that out loud?"
        ],
        "failure": "Segments drawn around whatever column the warehouse already has rather than around where the distributions separate. Then the cell count outruns the sample size and every cell is tuned on noise."
      },
      {
        "id": "effective-challenge",
        "label": "Effective challenge",
        "col": 3,
        "lane": 0,
        "kind": "control",
        "detail": "Independent review by someone with the standing to say no. SR 11-7 calls it effective challenge: critical analysis by objective, informed parties who can identify limitations and produce changes, depending on a combination of incentives, competence and influence. The word doing the work is incentives, because a reviewer who reports to the rule author is not challenge. EBA/GL/2019/04 para 75 requires all changes to be recorded, tested, assessed, approved, implemented and verified in a controlled manner, with emergency changes following procedures that provide adequate safeguards rather than bypassing them. What this does to detection is less obvious than it looks. Challenge mostly stops changes shipping on a difference inside the noise band, which protects detection from confident but unevidenced tuning. Four-eyes approval is industry practice rather than a named requirement in either text.",
        "asks": [
          "Who can refuse this, and do they report to the author?",
          "What evidence would have changed the reviewer's mind?",
          "Is this difference outside the noise band or inside it?",
          "Which exact version is being approved, and where is it recorded?",
          "How often is the emergency path used, and by whom?"
        ],
        "failure": "Author self-approval, or an emergency-change route used routinely so the standard control never binds. Either way a rule is live that nobody independent has ever read."
      },
      {
        "id": "queue-capacity",
        "label": "Can the queue take it",
        "col": 3,
        "lane": 1,
        "kind": "control",
        "detail": "The approval question most often skipped: can the review team actually work the volume this operating point creates. Review capacity is a hard design constraint, not a budget line. Past capacity, quality of review collapses before volume does, and investigators start ignoring further alerts when too many false alarms arrive (Dal Pozzolo et al.). A threshold the queue cannot staff is not a cautious choice. It is a control failure that surfaces later as undetected fraud. The customer experiences the same failure as a payment held for days rather than hours, and the FCA notes that a firm holding payments will likely need a real-time human interface to support the customer affected. Precision should therefore be assessed over the alerts the team can genuinely check, not over every alert the rule generates.",
        "asks": [
          "How many alerts a day can this queue actually work?",
          "What happens to the alerts that fall below the review line?",
          "How long will a held payment wait at the peak, not the average?",
          "Who staffs the weekend and the month-end spike?",
          "Was the strategy approved in the same forum that owns the headcount?"
        ],
        "failure": "Strategy and headcount approved in different forums on different clocks, so the rule ships against a queue sized for last year's estate and the backlog quietly absorbs the cost."
      },
      {
        "id": "shadow-live",
        "label": "Shadow on live traffic",
        "col": 4,
        "lane": 0,
        "kind": "control",
        "detail": "Run the rule in production against live traffic, log the decision it would have made, and act on nothing. This is where the backtest estimate meets reality, and the variance between the two is the finding. EBA/GL/2019/04 requires testing and approval before first use in test environments that adequately reflect production, and requires production to be segregated from development and test. Shadow mode is how you get production realism without production risk. The window has to cover the seasonality that matters to this population: a payday peak, a month-end procurement cycle, a quarter-end close. Precision computed inside the window before labels have matured will be optimistic, and it will decline on its own after go-live without anything about the rule having changed.",
        "asks": [
          "How far off was the backtest estimate, and can we explain the gap?",
          "Does this window contain a month-end and a payday?",
          "Have the labels inside the window matured?",
          "Which live rules does this overlap with in practice, not in theory?",
          "What fired that we did not anticipate at all?"
        ],
        "failure": "A shadow window too short to contain one seasonal cycle, read as a total fire count and nothing else, so the first real surprise arrives once the rule is already acting on customers."
      },
      {
        "id": "no-one-affected",
        "label": "Nobody is affected yet",
        "col": 4,
        "lane": 1,
        "kind": "outcome",
        "detail": "Shadow is the only stage on this map where detection can be measured at full production realism while the customer cost is exactly zero. Nobody is declined, nobody is stepped up, nobody calls. That asymmetry is the whole argument for tolerating the delay shadow costs, and skipping it to ship faster is a decision to buy speed with other people's payments. Use the stage for the thing it is uniquely good at. Pull the sample of genuine customers who would have been blocked and read it case by case, alongside someone from FraudOps who knows what a normal customer looks like. A number cannot tell you the rule is about to block every company running a vendor bake-off. A sample of twenty can.",
        "asks": [
          "Who would we have blocked, and would we defend each one?",
          "Does anything in this sample look like our best customers?",
          "What is the cost of waiting one more cycle before ramping?",
          "Which of these would have called us, and which would simply have left?",
          "What did FraudOps see in the sample that the analysis missed?"
        ],
        "failure": "Treating shadow as a box to tick, reading only the fire count, and never opening the sample. The one stage where the customer cost is free to discover is the stage where it goes undiscovered."
      },
      {
        "id": "ramp-share",
        "label": "Ramp on a share",
        "col": 4,
        "lane": 0,
        "kind": "control",
        "detail": "Promote to live on a defined share of traffic or a defined segment, with the incumbent strategy as champion and the candidate as challenger, compared on comparable populations over the same period (Wolfsberg 2024). This is the only honest way to claim the change caused an improvement rather than coincided with one. The release record needs an effective timestamp, the traffic allocation, both definitions, and promote-or-stop criteria agreed before the ramp starts rather than negotiated once results arrive. Parallel run is a different thing and worth not confusing with this: parallel run asks whether a new platform reproduces the old one's decisions during a migration, not which strategy performs better. Detection gains measured on a share are real but small in absolute terms, and that is the price of finding out safely.",
        "asks": [
          "Are champion and challenger running on comparable populations?",
          "Is the difference outside the noise band, or inside it?",
          "What are the promote and stop criteria, agreed before we started?",
          "How much seasonality falls inside the comparison window?",
          "Who owns the traffic allocation, and can we prove it held?"
        ],
        "failure": "Comparing champion and challenger over different periods or different traffic mixes, so what gets measured is seasonality, then promoting on a difference that was inside the noise all along."
      },
      {
        "id": "precision-capacity",
        "label": "Precision at capacity",
        "col": 5,
        "lane": 0,
        "kind": "control",
        "detail": "Measure precision over the alerts the team can actually check, not over every alert the rule generates. Dal Pozzolo et al. define alert precision at the review capacity and recommend card precision for running performance, because that is the number describing what the operation really achieves. Add traceability in both directions: from an alert back to the rule version that raised it, and from a confirmed fraud back to which rule did or did not catch it. Without the second, the feedback loop never closes and the estate cannot learn what it missed. Monitoring fire volume instead of outcome quality is the classic failure, because the backlog silently absorbs the cost of a bad rule and the dashboard stays green while service degrades underneath it.",
        "asks": [
          "What is precision at the capacity we actually staff?",
          "Can we trace a confirmed fraud back to the rule that missed it?",
          "Which rule version raised this alert?",
          "Is the backlog growing, and since which change?",
          "What are we learning about the fraud we never alerted on at all?"
        ],
        "failure": "Monitoring how often the rule fires rather than whether the fires were right. The queue absorbs the error, the dashboard stays green, and the degradation surfaces months later as a loss event."
      },
      {
        "id": "friction-metrics",
        "label": "Watch the other side",
        "col": 5,
        "lane": 1,
        "kind": "control",
        "detail": "The customer-side dashboard: step-up rate, authentication abandonment, held-payment volumes and durations, complaints, contact rate, and vulnerability flags. Where a UK payment is delayed on suspicion, the FCA specifies the per-transaction record, covering the grounds for suspicion, the length of the delay, whether the transaction was ultimately completed or refused, the value, and whether the payer had characteristics of vulnerability (FG24/6, para 3.7). Read it alongside the detection dashboard, in the same meeting, or the trade this whole map describes stays invisible to the people making it. Note also that friction is not uniformly bad and driving it toward zero is a different failure: the Consumer Duty requires appropriate friction to mitigate the risk of harm while avoiding unreasonable barriers. The target is calibrated friction with a stated number, not the minimum achievable.",
        "asks": [
          "Are the two dashboards ever read in the same room?",
          "How long is a held payment actually sitting, at the tail?",
          "Which customers are complaining, and are any of them vulnerable?",
          "Is abandonment rising on the step-up we added?",
          "Is any of this friction doing useful work, or is it pure cost?"
        ],
        "failure": "The fraud dashboard and the customer dashboard owned by different teams and never read together, so both currencies are managed and the exchange rate between them is managed by nobody."
      },
      {
        "id": "tra-headroom",
        "label": "Fraud rate buys headroom",
        "col": 5,
        "lane": 0,
        "kind": "outcome",
        "detail": "The one place where the two costs are formally convertible in law. Under the PSD2 regulatory technical standards a payment service provider may skip strong customer authentication on low-risk remote transactions, but only while its own rolling ninety-day fraud rate stays at or below the reference rate for the value band: 0.13% up to EUR 100, 0.06% up to EUR 250, and 0.01% up to EUR 500 for remote card payments. A breach must be reported immediately, and the exemption falls away after two consecutive quarters above the reference rate. Detection performance therefore buys the right to authenticate fewer customers. The inversion is worth naming out loud: when the rate drifts toward the ceiling you have to add friction now to keep the permission to remove friction later, and a rolling window means the drift is visible late.",
        "asks": [
          "Where is the rolling rate against the reference rate for each band?",
          "Who in decisioning sees that number, and how often?",
          "If we loosen here, how much exemption headroom does it spend?",
          "How late does the rolling window make us on a rising trend?",
          "Which rules are the ones actually holding the rate down?"
        ],
        "failure": "Treating the fraud rate as a compliance number owned by reporting, so nobody in decisioning notices that a loosening decision has quietly spent the exemption that keeps friction low everywhere else."
      },
      {
        "id": "trigger-fires",
        "label": "Rollback trigger fires",
        "col": 5,
        "lane": 1,
        "kind": "escalation",
        "detail": "Rollback triggers are numeric conditions agreed before deployment that mandate reverting without a fresh argument: decline rate above a stated level, precision below a stated floor, complaint volume above a level, queue ageing beyond a stated number of hours. SR 11-7 frames it as outcomes consistently falling outside predetermined thresholds of acceptability, warranting adjustment, recalibration or redevelopment. Trigger values are firm-specific and there is no standard set. The point of pre-agreeing them is that it takes judgement out of the worst possible moment to be exercising it, at two in the morning with an incident channel filling up. Most estates write only the detection-side trigger. The customer-side trigger is the one that turns complaints seem up into a decision somebody already agreed to make.",
        "asks": [
          "What number reverts this, and who agreed to it?",
          "Is there a customer-side trigger, or only a detection one?",
          "Who can pull it, at what hour, without convening a meeting?",
          "Which version, exactly, do we revert to?",
          "How long can we run degraded before the trigger binds?"
        ],
        "failure": "No named trigger, so switching off becomes a live argument during an incident, and the argument is won by whoever is most senior in the channel rather than by the evidence."
      },
      {
        "id": "tighten-evidence",
        "label": "Tighten, with evidence",
        "col": 6,
        "lane": 0,
        "kind": "control",
        "detail": "A tune re-runs the evidence the rule was born with: above-the-line and below-the-line again, a fresh count of the genuine customers newly caught, and re-approval through the same change control as a new rule. A threshold change is the highest-frequency and highest-risk change in a fraud estate. It is cheap to make, easy to make informally, and it moves both loss and customer harm on the day it lands. Tightening is the outcome teams reach for by default, because it reads as diligence and because the detection number is the one being asked about in the meeting. Nothing is wrong with tightening. What is wrong is a review distribution in which tightening is the only outcome that ever appears.",
        "asks": [
          "What changed in the world, or has only our appetite changed?",
          "How many additional genuine customers does this now catch?",
          "Has this gone back through the same approval as a new rule?",
          "When did this estate last loosen anything at all?",
          "Is the queue sized for the volume this creates?"
        ],
        "failure": "Every review ending in a tightening, because tightening is the outcome nobody is ever criticised for. Friction accumulates, rules overlap, and no one can say what any single rule now contributes."
      },
      {
        "id": "loosen-no-change",
        "label": "Loosen, or no change",
        "col": 6,
        "lane": 1,
        "kind": "outcome",
        "detail": "Two outcomes that belong in the distribution and rarely appear in it. Loosening returns customers at a measured, stated cost in detection, and is the right answer when the friction budget is being spent on a population that was never the risk. No change, evidenced, is the honest answer when the difference sits inside the noise band, and it is a genuine result: it closes the question and stops the next analyst repeating the same investigation next quarter. Both need writing up to the same standard as a change, with the evidence attached and the reasoning legible to someone unfamiliar with the rule. A review distribution made entirely of tightenings is not a sign of a vigilant team. It is a sign that only one of the two costs is being counted.",
        "asks": [
          "What would have to be true for us to loosen this?",
          "Is the difference we found actually outside the noise?",
          "Is a no-change result written anywhere the next analyst will find it?",
          "Who is paying friction here who was never the risk?",
          "What is the shape of our last twenty review outcomes?"
        ],
        "failure": "Loosening treated as career risk and no-change treated as a non-result, so neither gets written down. The same investigation repeats every year and the friction never comes back off."
      },
      {
        "id": "retire-dead-rule",
        "label": "Retire a dead rule",
        "col": 6,
        "lane": 0,
        "kind": "decision",
        "detail": "The third move that breaks the pattern, and the only genuinely free one. A decayed rule catches almost nothing and still fires, still declines, still fills the queue. Retiring it improves detection at estate level, by returning review capacity to rules that are working, and improves the customer experience at the same moment. Rules decay because the world moves on both sides: customer habits evolve and fraudsters change strategy. Wolfsberg criticises the instinct to make sure no historical scenario is ever left behind, which produces over-alerting programmes, and warns that aiming for total recall is likely to lead to an ineffective system. Retirement is still a change: SR 11-7 expects an inventory of models implemented, in development, or recently retired, and a rule switched off in the tool but left live in the inventory is a traceability failure.",
        "asks": [
          "What has this rule uniquely caught in the last two quarters?",
          "Which live rule already catches everything it catches?",
          "How much friction and queue load does it still generate?",
          "Is it disabled in the tool, or actually retired in the inventory?",
          "What would we lose if we switched it off tomorrow?"
        ],
        "failure": "Rules only ever added, never retired, so the estate compounds and overlaps. Or a rule disabled in the tool but left in the inventory, so the documented control map no longer matches what actually runs."
      },
      {
        "id": "roll-back",
        "label": "Roll back a version",
        "col": 6,
        "lane": 1,
        "kind": "outcome",
        "detail": "Revert to a named prior version, and record who did it, when, why, and what it was reverted to. Rollback is not the process failing, it is the process working: the trigger was agreed, a number breached it, the change came out. The customer effect is immediate, which is the point of having a version to return to rather than a fix to write under pressure. What follows is a post-implementation review comparing what actually happened against the expected impact written at specification time, on both currencies rather than only the detection one. Then re-baseline the monitoring, because the metrics either side of a revert are not comparable and treating them as a single series will hide the next problem inside the discontinuity.",
        "asks": [
          "Which version are we on now, and can we prove it?",
          "Was this the agreed trigger, or a judgement call in the moment?",
          "What did the expected-impact statement say, and how far off was it?",
          "Have we re-baselined the monitoring after the revert?",
          "What do we say to the customers affected while it was live?"
        ],
        "failure": "Rolling back informally with no record of the version reverted to, so the estate's documented state and its actual state diverge and the next investigation starts from a false map."
      }
    ],
    "edges": [
      {
        "from": "harm-population",
        "to": "action-ladder",
        "kind": "handoff",
        "label": "the action is the cost"
      },
      {
        "from": "harm-population",
        "to": "replay-history",
        "kind": "flow",
        "label": "sized against history"
      },
      {
        "from": "action-ladder",
        "to": "count-hit",
        "kind": "flow",
        "label": "who the action lands on"
      },
      {
        "from": "replay-history",
        "to": "count-hit",
        "kind": "handoff",
        "label": "capture comes with a hit list"
      },
      {
        "from": "count-hit",
        "to": "better-features",
        "kind": "handoff",
        "label": "the hit list names the gap"
      },
      {
        "from": "better-features",
        "to": "friction-budget",
        "kind": "handoff",
        "label": "both gain: more caught, same cost"
      },
      {
        "from": "better-features",
        "to": "segment-threshold",
        "kind": "flow",
        "label": "separation, then segments"
      },
      {
        "from": "replay-history",
        "to": "threshold-sweep",
        "kind": "flow",
        "label": "sweep, do not pick a point"
      },
      {
        "from": "threshold-sweep",
        "to": "friction-budget",
        "kind": "handoff",
        "label": "each step tighter costs more"
      },
      {
        "from": "segment-threshold",
        "to": "friction-budget",
        "kind": "handoff",
        "label": "both gain: low-risk lane freed"
      },
      {
        "from": "threshold-sweep",
        "to": "effective-challenge",
        "kind": "escalate",
        "label": "threshold needs sign-off"
      },
      {
        "from": "friction-budget",
        "to": "queue-capacity",
        "kind": "flow",
        "label": "budget becomes a capacity ask"
      },
      {
        "from": "queue-capacity",
        "to": "effective-challenge",
        "kind": "escalate",
        "label": "capacity can veto the point"
      },
      {
        "from": "effective-challenge",
        "to": "shadow-live",
        "kind": "flow",
        "label": "approved to shadow only"
      },
      {
        "from": "shadow-live",
        "to": "no-one-affected",
        "kind": "handoff",
        "label": "measured, nobody declined"
      },
      {
        "from": "no-one-affected",
        "to": "ramp-share",
        "kind": "handoff",
        "label": "read the sample, then ramp"
      },
      {
        "from": "ramp-share",
        "to": "precision-capacity",
        "kind": "flow",
        "label": "live share, measured weekly"
      },
      {
        "from": "ramp-share",
        "to": "tra-headroom",
        "kind": "flow",
        "label": "the rate runs on ninety days"
      },
      {
        "from": "precision-capacity",
        "to": "friction-metrics",
        "kind": "handoff",
        "label": "queue grows, holds lengthen"
      },
      {
        "from": "precision-capacity",
        "to": "trigger-fires",
        "kind": "escalate",
        "label": "precision below the floor"
      },
      {
        "from": "precision-capacity",
        "to": "tighten-evidence",
        "kind": "flow",
        "label": "evidence says tighten"
      },
      {
        "from": "precision-capacity",
        "to": "retire-dead-rule",
        "kind": "flow",
        "label": "this one catches nothing"
      },
      {
        "from": "tra-headroom",
        "to": "friction-metrics",
        "kind": "handoff",
        "label": "detection buys less authentication"
      },
      {
        "from": "tra-headroom",
        "to": "tighten-evidence",
        "kind": "flow",
        "label": "exemption at risk, tighten"
      },
      {
        "from": "friction-metrics",
        "to": "loosen-no-change",
        "kind": "flow",
        "label": "cost not justified, loosen"
      },
      {
        "from": "trigger-fires",
        "to": "roll-back",
        "kind": "flow",
        "label": "revert to the named version"
      },
      {
        "from": "tighten-evidence",
        "to": "loosen-no-change",
        "kind": "handoff",
        "label": "tightening shows up here"
      },
      {
        "from": "retire-dead-rule",
        "to": "loosen-no-change",
        "kind": "handoff",
        "label": "both gain: friction removed"
      },
      {
        "from": "roll-back",
        "to": "precision-capacity",
        "kind": "loop",
        "label": "re-baseline after the revert"
      },
      {
        "from": "tighten-evidence",
        "to": "effective-challenge",
        "kind": "loop",
        "label": "re-approve as a new change"
      }
    ]
  }
]
