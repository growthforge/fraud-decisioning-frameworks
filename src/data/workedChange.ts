/* Generated from the content workflow, then reviewed and applied by hand.
   Do not regenerate without re-running scripts/verify.ts — the swimlane geometry
   is asserted there and a longer node label will silently clip. */

export interface Figure { k: string; v: string; note: string }
export interface Step { n: number; stage: string; title: string; body: string; artefact: string; figures: Figure[]; judgement: string }

export const WORKED: {
  title: string
  standfirst: string
  syntheticNotice: string
  steps: Step[]
  whatWentWrong: string
  closing: string
} = {
  "title": "Card testing on newly issued virtual cards: one rule change, end to end",
  "standfirst": "A constructed example, not a case history. The method above, applied end to end to one change so the reasoning is visible rather than described — including the part where the process got it wrong, because a clean success would not be worth reading. The typology is chosen deliberately: card testing on newly issued virtual cards is where a spend product's own headline feature generates its strongest false positive. Every figure below is invented and labelled. Nothing here happened to anyone.",
  "syntheticNotice": "SYNTHETIC · ILLUSTRATIVE · CONSTRUCTED — this is a worked example, not an account of real events. The portfolio, the volumes, the precision figures, the queue timings and the dates are all invented to make the method legible. No firm, no rule and no incident described here exists.",
  "steps": [
    {
      "n": 1,
      "stage": "Intake and rule proposal",
      "title": "Where the hypothesis came from",
      "body": "An analyst working the disputes queue noticed the same shape three times in eleven weeks. A run of small approvals, under three pounds, on virtual cards issued in the previous day or two, at descriptors nobody recognised, none of which ever settled. Two of the three runs were followed within a week by a much larger authorisation on one of the same cards.\n\nThe temptation was to write the rule to the third incident. We did not, because a rule written to one event encodes one event. We asked instead whether the shape was a typology, and it is. Card testing is the validation step between obtaining a credential and using it, and published card scheme guidance describes this pattern directly: low-value approvals that are never presented for clearing.\n\nWhat made it worth a rule on this product specifically is that virtual card issuance is instant and self-service. A compromised admin session does not need stolen cards. It manufactures them.\n\nThe proposal stated the harm as the follow-on spend rather than the test charges, and proposed a step-up rather than a decline.",
      "artefact": "Rule proposal CT-VC-01, one page: typology, target population, plain-language logic, proposed action, and the harm it addresses.",
      "figures": [
        {
          "k": "Clusters observed before writing the proposal",
          "v": "3 in 11 weeks",
          "note": "Synthetic. Three is a small number to generalise from, which is why the proposal argued from the typology rather than from the three."
        },
        {
          "k": "Cards involved across the three clusters",
          "v": "47",
          "note": "Synthetic. Counted after the fact, so it excludes any cluster nobody noticed."
        },
        {
          "k": "Median test authorisation",
          "v": "£0.83",
          "note": "Synthetic. The value is close to irrelevant: the rule targets the spend that follows, not the test."
        },
        {
          "k": "Clusters followed by a larger authorisation",
          "v": "2 of 3",
          "note": "Synthetic, and the denominator is tiny. Two of three is a story, not a rate."
        }
      ],
      "judgement": "We proposed a step-up on later spend rather than declining the test authorisation, because declining a pound tells the attacker which credentials are dead and costs us the chance to watch. The rejected alternative was a hard decline on low-value authorisations at unrecognised descriptors, which would have blocked hotel pre-authorisations and vendor verification charges across the whole book."
    },
    {
      "n": 2,
      "stage": "Data analysis and sizing",
      "title": "Replay, and the labels that had not arrived yet",
      "body": "We replayed the candidate logic over twenty-six weeks of historic authorisations, about 14.2 million of them across a synthetic portfolio of 120,000 active cards, at a chosen illustrative fraud rate of eight basis points by count. At the threshold in the proposal the rule fired 41 times a day and touched 604 cards a day. That was the first sign the intake threshold was a guess.\n\nThe harder problem was that the recent labels had not arrived. Two lags run at once. Confirmed fraud and chargeback labels land weeks after the decision. Investigator dispositions also close unevenly, because an obvious card-testing cluster is resolved in minutes while an ambiguous one waits on a conversation with the customer.\n\nBoth lags point the same way. Precision computed on closed dispositions in the last eight weeks read 71 per cent. Re-measured on the same weeks ninety days later it was 43 per cent. Recall flattered harder still, because fraud we had not yet heard about was missing from its denominator.\n\nWe cut the final sixty days from every quality figure and used that period for volume only.",
      "artefact": "Backtest pack: fire volume and cards touched per day, precision and recall across candidate thresholds on the matured segment, overlap with live rules, and a label-maturity curve stated up front.",
      "figures": [
        {
          "k": "Replay window",
          "v": "26 weeks, 14.2m authorisations",
          "note": "Synthetic portfolio of 120,000 active cards. Real replays are limited by how far back feature parity holds, which is usually less far than the data goes."
        },
        {
          "k": "Chosen illustrative fraud rate",
          "v": "8 basis points by count",
          "note": "Invented for this example. There is no industry rate: portfolio mix drives it, and quoting someone else's is meaningless."
        },
        {
          "k": "Fire volume at the intake threshold",
          "v": "41 events/day, 604 cards/day",
          "note": "Synthetic, and a daily mean. The mean later turned out to be the wrong statistic to have promised."
        },
        {
          "k": "Label maturity",
          "v": "46% at 14 days, 81% at 45, 97% at 90",
          "note": "Synthetic curve. The 97 per cent is a convenience: some fraud is never labelled at all."
        },
        {
          "k": "Precision, most recent 8 weeks",
          "v": "71% at cut-off, 43% once matured",
          "note": "Synthetic. The gap is the point. The first number is the one that would have gone in the deck."
        }
      ],
      "judgement": "We excluded the last sixty days from every precision and recall figure and reported it as volume only, accepting a smaller evaluation sample. The rejected alternative was to use the full window for a tighter confidence interval, which buys precision on a number that is wrong in a known direction."
    },
    {
      "n": 3,
      "stage": "Threshold selection and sensitivity testing",
      "title": "A sweep, not a nudge",
      "body": "The standing criticism of threshold testing is that firms move a parameter about ten per cent either side of where it already sits and learn nothing from it. That is a fair description of most threshold papers. We swept the distinct-card count from three to twenty against a proposed eight, which is sixty-two per cent below and one hundred and fifty per cent above, and separately swept the window from one hour to twenty-four and the value ceiling from one pound to ten.\n\nAbove the line, fire volume collapses fast and so does coverage. Below the line, the queue drowns long before precision gets interesting.\n\nGoing below the line properly meant sampling what we would miss. At each candidate threshold we pulled two hundred descriptor-events sitting just under it and read them. At a count of twelve the sample held three genuine card-testing clusters with an estimated fourteen thousand pounds of follow-on exposure. At ten it held one.\n\nWe chose ten distinct cards in a six-hour window, with a value ceiling of three pounds and at least sixty per cent of the cluster still unsettled after twenty-four hours. The reason we chose it was capacity, not precision.",
      "artefact": "Threshold sensitivity table and precision-recall curve across three swept parameters, with the below-the-line sample results and a written reason for the chosen operating point.",
      "figures": [
        {
          "k": "Sweep range on the fan-in count",
          "v": "3 to 20, against a proposed 8",
          "note": "Synthetic. Wide on purpose. A ten per cent sweep either side would have found nothing."
        },
        {
          "k": "Trade at counts 8 / 10 / 12",
          "v": "41 / 24 / 15 fires per day",
          "note": "Synthetic, matured labels only. Precision 24% / 38% / 51%; estimated recall 74% / 62% / 49%."
        },
        {
          "k": "Below-the-line sample",
          "v": "200 events per candidate threshold",
          "note": "Synthetic. Sampled just under the line, so it says nothing about what sits far below it."
        },
        {
          "k": "Chosen operating point",
          "v": "10 cards, 6 hours, ≤£3, ≥60% unsettled at 24h",
          "note": "Synthetic and portfolio-specific. Not a standard, and it would be wrong on a different book."
        },
        {
          "k": "Binding constraint",
          "v": "Queue capacity, about 30 events/day",
          "note": "Synthetic. Assumes twelve minutes of handling per event alongside existing work. Capacity bound first, before loss appetite."
        }
      ],
      "judgement": "We took ten over twelve on the below-the-line evidence, not on the precision figure, which favoured twelve. We rejected eight outright, because the queue could not absorb 41 events a day, and a threshold the queue cannot work is not a cautious choice, it is a control that fails quietly."
    },
    {
      "n": 4,
      "stage": "Rule specification and expected impact",
      "title": "Writing it down so someone else can reconstruct it",
      "body": "The specification is the artefact an auditor asks for first and the one most often missing, because the logic ends up living in the decisioning tool and the reasoning ends up living in a chat thread. Ours ran to four pages.\n\nIt named the version, the owning role, the rationale, the exact logic and every data field it depends on, the population in scope, the action, the expected impact, the monitoring plan, the rollback triggers and a review date.\n\nThe expected impact was written as a range with a stated tolerance, not a point estimate. Twenty-four fires a day plus or minus thirty per cent. Three hundred and thirty-one cards touched a day. Precision of 38 per cent once labels matured at ninety days. Around twenty-one genuine customers stepped up a day.\n\nA range can be wrong. A point estimate is never wrong, because nobody agrees in advance what counts as missing it.\n\nWe also wrote down what the rule would not do, which is decline anything, and what it does not cover, which is card testing on physical cards and on cards older than forty-eight hours.",
      "artefact": "Versioned rule specification CT-VC-01 v1.0: rationale, logic, field dependencies, scope and exclusions, expected impact as a band, monitoring plan, numeric rollback triggers, owner and review date.",
      "figures": [
        {
          "k": "Expected impact, stated in advance",
          "v": "24 fires/day ±30%",
          "note": "Synthetic. Written as a band so the post-implementation review could return a verdict rather than a narrative."
        },
        {
          "k": "Expected precision at 90 days",
          "v": "38%",
          "note": "Synthetic, carried forward from the backtest, which means it inherits the backtest's population and its label assumptions."
        },
        {
          "k": "Expected genuine step-ups",
          "v": "About 21 per day",
          "note": "Synthetic. The number that mattered most, and the one the specification was least confident about."
        },
        {
          "k": "Scope exclusions written down",
          "v": "Physical cards; cards older than 48 hours",
          "note": "Naming what a rule does not cover is what stops it being credited later with coverage it never had."
        },
        {
          "k": "Review date",
          "v": "90 days",
          "note": "Set at specification time. Later shortened, which is itself a finding rather than an administrative change."
        }
      ],
      "judgement": "We wrote the expected impact as a band with a tolerance rather than a point estimate, so that the ninety-day review had something falsifiable to test. The rejected alternative was the usual single number, which in practice can never be missed and so never gets checked."
    },
    {
      "n": 5,
      "stage": "Governance review and approval",
      "title": "What the reviewer changed",
      "body": "Independent review is only independent if the reviewer can say no and it costs them nothing to do it. Ours came from outside the team that wrote the rule, and it changed two things.\n\nThe first was the action. As written, a fired cluster stepped up every card in it. The reviewer pointed out that in the fraud case those cards belong to many unrelated customers who have done nothing yet, and in the false-positive case they all belong to one customer whose finance team is halfway through provisioning. Either way, actioning the whole cluster converts one event into twenty blocked vendor set-ups.\n\nThe action was rescoped. Step-up now applies only to cards in the cluster that later attempt an authorisation above seventy-five pounds, only for seventy-two hours, and to no more than twenty-five cards per event. The rest are alert-only.\n\nThe second was a rollback trigger. The specification said roll back if precision falls below fifteen per cent at the six-week review. At six weeks those labels do not exist, so the trigger could never fire. It was replaced with operational triggers measurable the same day, and the precision gate moved to ninety days.",
      "artefact": "Approval record: approver identity and role, date, exact version approved, the two conditions attached, and the reason each was imposed. Specification reissued as v1.1.",
      "figures": [
        {
          "k": "Cards actioned per event",
          "v": "Capped at 25",
          "note": "Synthetic cap, added at review. It is the trigger that fired first in production."
        },
        {
          "k": "Step-up scope after review",
          "v": "Later authorisations above £75, for 72 hours",
          "note": "Synthetic. Narrowing the action cost roughly six points of modelled recall on the backtest."
        },
        {
          "k": "Rollback triggers rewritten",
          "v": "1 of 4 was unmeasurable",
          "note": "The precision trigger could not fire at six weeks, because the labels it depended on had not matured."
        },
        {
          "k": "Version at approval",
          "v": "v1.1",
          "note": "v1.0 was never deployed. The version history is the evidence that the review changed something."
        }
      ],
      "judgement": "We accepted the cap of twenty-five cards per event even though the backtest said it cost about six points of modelled recall. The author's counter-argument, that the cap could be added later once monitoring showed it was needed, was rejected, because the cost of not having it lands on customers on the day the rule is wrong."
    },
    {
      "n": 6,
      "stage": "Shadow mode deployment",
      "title": "Production disagreed with the backtest, and production was right",
      "body": "We ran fourteen days in production with the rule logging what it would have done and doing nothing. The backtest said twenty-four fires a day. Production gave thirty-one, twenty-nine per cent over the estimate and only just inside the band we had written down.\n\nA variance is only useful once it is explained. Four of the seven extra fires a day came from one field. The replay took the card's issued timestamp from a warehouse table that recorded activation time, while production used creation time. Cards created and activated hours apart fell outside the forty-eight-hour window in the replay and inside it in production. Two came from descriptor normalisation, where the warehouse's merchant mapping was stale and split variants that production merged. One was genuine timing.\n\nWe also read the customers. Sixty of the 434 genuine step-ups over the fortnight were reviewed case by case. Forty-one were agencies issuing one card per client against a single advertising platform. Twelve were per-seat software rollouts. Seven were unclear, and two of those seven turned out to be real card testing the backtest had labelled genuine.",
      "artefact": "Shadow report: would-have-fired volumes against the backtest estimate with the variance attributed by cause, plus a reviewed sample of the genuine customers the rule would have stepped up.",
      "figures": [
        {
          "k": "Shadow against backtest",
          "v": "31/day against an estimated 24",
          "note": "Synthetic. Twenty-nine per cent over, which is inside the stated band but close enough to its edge to need explaining rather than absorbing."
        },
        {
          "k": "Variance attributed",
          "v": "4 field parity, 2 descriptor mapping, 1 timing",
          "note": "Synthetic split. Attribution at this resolution is partly judgement, not measurement, and we said so in the pack."
        },
        {
          "k": "Genuine step-ups reviewed",
          "v": "60 of 434",
          "note": "Synthetic. Sampled at random across the fortnight, which is exactly the sampling flaw described below."
        },
        {
          "k": "Re-run after the field fix",
          "v": "26/day over 5 days",
          "note": "Synthetic. Five days is too short to be reassuring, and the pack recorded that."
        },
        {
          "k": "Backtest labels found wrong",
          "v": "2 of the 60 reviewed",
          "note": "Synthetic. Two in sixty is small, but it means the backtest's precision figure was understated by an unknown amount."
        }
      ],
      "judgement": "We fixed the timestamp parity in the replay environment and re-ran, rather than moving the threshold up to bring the volume back to twenty-four. Re-baselining would have produced the right headline number and buried a data defect that would have shown up again in every backtest after this one."
    },
    {
      "n": 7,
      "stage": "Controlled release",
      "title": "Promote and stop criteria, written before anyone looked",
      "body": "We released to thirty per cent of customer accounts, allocated by a stable hash of the account identifier. Allocation by account rather than by transaction matters here, because the rule affects a provisioning workflow. A customer whose vendor cards work on Tuesday and are held on Wednesday is not a controlled experiment, it is a support ticket.\n\nThe first allocation was unbalanced. The challenger arm carried eight per cent more agency-sector accounts, which are the heaviest bulk issuers on the book and therefore precisely the population the rule would hurt. We redrew it stratified on four covariates and checked balance before release, not after.\n\nPromote and stop criteria were agreed and circulated before the release, and we recorded that no result would be read before day fourteen.\n\nPromote if the genuine step-up rate stayed at or below 1.4 per thousand active cards a day, queue ageing stayed under six hours at the ninetieth percentile, fewer than four customer contacts were attributed to the rule, and at least eight confirmed clusters were intercepted. Stop on any one of four conditions, including the per-customer cap the reviewer had insisted on.",
      "artefact": "Release record: effective timestamp, allocation method and stratification, champion and challenger definitions, the pre-agreed promote and stop criteria, and the balance check that failed first time.",
      "figures": [
        {
          "k": "Allocation",
          "v": "30% of accounts, stratified hash",
          "note": "Synthetic. By account, not by transaction, because the rule touches a workflow rather than a single payment."
        },
        {
          "k": "Balance failure caught pre-release",
          "v": "+8% agency accounts in the challenger arm",
          "note": "Synthetic. Had it shipped, the arm difference would have measured customer mix rather than rule quality."
        },
        {
          "k": "Promote criteria",
          "v": "4 conditions, all pre-agreed",
          "note": "Synthetic thresholds. The pre-agreement is what transfers between firms; the numbers are portfolio-specific."
        },
        {
          "k": "Stop criteria",
          "v": "4 conditions, any one sufficient",
          "note": "Includes more than 25 cards actioned on one customer in seven days. That is the one that fired."
        },
        {
          "k": "Read embargo",
          "v": "No result read before day 14",
          "note": "Written down so nobody could promote on a difference sitting inside the noise band."
        }
      ],
      "judgement": "We redrew the allocation when the balance check failed, delaying the release by four days. Releasing on the original hash and adjusting for sector in the analysis was rejected, because a covariate adjustment made after seeing the result is not a control, it is an explanation."
    },
    {
      "n": 8,
      "stage": "Production monitoring",
      "title": "What we watched, and how often",
      "body": "Daily: fire count, cards actioned, genuine step-ups, queue depth, ninetieth-percentile ageing, and any customer contact tagged to the rule. Weekly: investigator disposition mix, overlap with rules already live, and the distribution of fires across descriptors and across customers. At forty-five and ninety days: precision on matured labels.\n\nThe first fortnight looked good. Twenty-seven fires a day in the challenger arm on a whole-book equivalent, fourteen confirmed clusters, three customer contacts, ninetieth-percentile queue ageing of 4.1 hours, and a genuine step-up rate of 1.1 per thousand active cards a day. Every promote criterion was met.\n\nTwo things in the same pack were less comfortable. Sixty-two per cent of fires landed on nine descriptors, six of which were advertising platforms and payment gateways, which is exactly where legitimate bulk issuance concentrates. And thirty-four per cent of the rule's confirmed catches were also caught by an existing velocity rule in the same window, so the marginal contribution was a third smaller than the headline.\n\nThe healthy fortnight is the part that misled us. Two weeks tells you how a control behaves in an ordinary two weeks.",
      "artefact": "Rule performance dashboard plus a weekly MI pack: volumes, disposition mix, marginal contribution against the existing estate, descriptor and customer concentration, queue depth and ageing.",
      "figures": [
        {
          "k": "First fortnight, challenger arm",
          "v": "27 fires/day, whole-book equivalent",
          "note": "Synthetic. Scaled up from a thirty per cent arm, so the scaling carries its own error."
        },
        {
          "k": "Queue ageing at p90",
          "v": "4.1 hours against a 6-hour promote criterion",
          "note": "Synthetic. Comfortable, and comfortable for a reason that did not hold beyond week three."
        },
        {
          "k": "Fire concentration",
          "v": "62% of fires on 9 descriptors",
          "note": "Synthetic. Six of the nine were advertising platforms and payment gateways."
        },
        {
          "k": "Overlap with the existing estate",
          "v": "34% of catches also caught elsewhere",
          "note": "Synthetic. Marginal contribution, not gross catches, is the number worth reporting."
        },
        {
          "k": "Customer contacts attributed",
          "v": "3 in 14 days",
          "note": "Synthetic, and an undercount. Most wrongly blocked customers do not call, they work around it."
        }
      ],
      "judgement": "We reported marginal contribution alongside gross catches, which made the rule look weaker than it read. Reporting gross catches only was the easier choice and would have made the ninety-day review unreadable, because nothing would have shown what this rule was actually adding."
    },
    {
      "n": 9,
      "stage": "Tuning and decay management",
      "title": "Segment and add a condition, not tighten",
      "body": "Two things had happened by week six and they pointed in opposite directions.\n\nThe genuine step-ups were not spread across the book. Seventy-one per cent came from four per cent of accounts, all with a long history of bulk issuance and no confirmed fraud in twelve months. A global count was asking a fair question of the wrong population.\n\nSeparately, the attack moved. Clusters began arriving at seven to nine cards per descriptor per six hours, sitting under the line and spread across more descriptors. Sitting under a published line is what any adversary does once the line exists.\n\nThe obvious answer to the second problem is a lower threshold, and it would have made the first problem worse. Version 1.2 did neither obvious thing.\n\nIt segmented. Accounts with an established bulk-issuance baseline are now scored against their own trailing pattern instead of the global count, which loosens the rule for them. And it added a corroborated branch rather than dropping the number. Five cards will fire, but only where they were created within thirty minutes of each other and the session shares a device or network fingerprint with a session on an unrelated account.",
      "artefact": "Tuning paper: current against proposed logic, the concentration analysis, a re-run above-the-line and below-the-line sweep on both branches, and a dated retirement entry in the rule inventory.",
      "figures": [
        {
          "k": "Concentration of false positives",
          "v": "71% from 4% of accounts",
          "note": "Synthetic. Concentration this high is an argument for segmentation, not for a lower threshold."
        },
        {
          "k": "Observed attack shape after week five",
          "v": "7 to 9 cards per descriptor, under the line",
          "note": "Synthetic. Consistent with adaptation, but we could not prove the attacker was responding to us specifically."
        },
        {
          "k": "v1.2 net effect on volume",
          "v": "26 to 28 fires/day",
          "note": "Synthetic. Roughly flat volume, changed composition. Volume was never the objective."
        },
        {
          "k": "Genuine step-ups after v1.2",
          "v": "Down 44%",
          "note": "Synthetic, measured over thirty days after the change against the thirty days before it."
        },
        {
          "k": "Rules retired",
          "v": "1, dated in the inventory",
          "note": "A legacy low-value authorisation rule this one subsumed. An estate that only ever adds rules cannot say what any single rule contributes."
        }
      ],
      "judgement": "We segmented and added a corroborated low-count branch instead of lowering the global threshold, accepting that the new branch is harder to explain to an investigator. Lowering the threshold was rejected because it takes the cost of the attacker's adaptation and charges it to the customers already paying most of the false-positive bill."
    },
    {
      "n": 10,
      "stage": "Post-implementation review",
      "title": "Actual against what we said at version 1.1",
      "body": "At ninety days we put the expected impact from the specification next to what happened, in the same units, and marked each line met or missed.\n\nFire volume: expected twenty-four a day plus or minus thirty per cent, actual twenty-eight. Met. Genuine step-ups: expected around twenty-one a day, actual thirty-four before version 1.2 and twelve after. Missed, then met, and a single average across the period hides both. Precision on matured labels: expected 38 per cent, actual 31 per cent. Missed. The two reasons were already in the monitoring pack. Fires concentrate on descriptors where legitimate issuance also concentrates, and a third of the catches were being caught elsewhere anyway.\n\nOne expected impact was withdrawn rather than restated. The backtest gave an estimated recall of 62 per cent. In production the denominator is all card testing, including card testing nobody ever detected, and that is not observable. We took the figure out of the pack and said why, rather than quoting a number we could not defend.\n\nThe rule was retained at version 1.2. The review date moved from twelve months to six.",
      "artefact": "Post-implementation review: expected against actual, line by line, in the units stated at specification; the withdrawn metric with its reason; and the updated inventory entry with a shortened review cycle.",
      "figures": [
        {
          "k": "Fire volume, expected against actual",
          "v": "24/day ±30% against 28/day",
          "note": "Synthetic. Met, but a daily mean was the wrong statistic to have promised in the first place."
        },
        {
          "k": "Precision, expected against actual",
          "v": "38% against 31%",
          "note": "Synthetic, on matured labels at ninety days. Missed, and the miss is the useful part of the review."
        },
        {
          "k": "Genuine step-ups, expected against actual",
          "v": "21/day against 34 then 12",
          "note": "Synthetic. A single period average would have read about nineteen and told nobody anything."
        },
        {
          "k": "Expected impacts withdrawn",
          "v": "1 of 4 (recall)",
          "note": "Recall's denominator is undetected fraud, which is unobservable. Withdrawing the metric beats restating it."
        },
        {
          "k": "Outcome",
          "v": "Retained at v1.2, review cycle cut to 6 months",
          "note": "Not every review tightens, loosens or retires. This one changed the cadence, which is a real outcome."
        }
      ],
      "judgement": "We put the precision miss in the same pack as the volume hit, rather than leading with confirmed clusters intercepted. Reporting fraud prevented and leaving precision to an appendix was rejected, because it makes the next threshold argument impossible to have honestly."
    }
  ],
  "whatWentWrong": "The shadow window ran fourteen days, the fourth to the seventeenth of the month. The controlled release ran twenty-one days and closed before quarter end. So the first quarter end the rule ever saw, it saw live and on both arms.\n\nQuarter end is when finance teams bulk-issue vendor cards, against new budget periods and against supplier onboarding. On the two working days around it, fires went from twenty-eight a day to ninety-six and then a hundred and thirty-one. Cards actioned went from about a hundred and eighty a day to 1,410 across two days. Ninetieth-percentile queue ageing went from 4.1 hours to thirty-one. Eleven customers breached the twenty-five-card cap.\n\nTwo stop criteria fired. The rule was disabled inside the working day, and the reason that took forty minutes rather than a meeting is that the triggers were numbers agreed in advance. It was not abandoned. It returned as version 1.2.\n\nThree lessons about the process, not the rule.\n\nThe shadow window length was a default, not a decision. Any control touching provisioning now has to observe a month end and a quarter end, or state in its specification that it has not.\n\nEvery trigger we wrote was a rate. The one that fired first was a concentration measure, and it existed only because a reviewer added it.\n\nThe backtest reported a daily mean. The peak day in the replay was 4.7 times the mean. That number was in the data the whole time. Nobody looked, because the pack did not ask for it.",
  "closing": "The rule works. It is version 1.2, monitored weekly, reviewed twice a year, and it catches a typology any self-service card-issuing product is exposed to.\n\nWhat it cost is worth stating plainly. Around three months of analyst time across intake, replay, sweep, specification, review, shadow and two releases. A day of degraded service for eleven customers at quarter end. Six points of modelled recall given up at approval. And a permanent reduction in what we claim: the recall figure is gone from the pack because it was never measurable.\n\nThe process improvements came from the failure, not the success. That is normal, and it is why the review is the deliverable rather than the rule."
}
