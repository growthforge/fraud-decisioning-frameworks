import type { PopulationSpec, CostAssumptions } from '../lib/sim.ts'

/* Every figure below is an ILLUSTRATIVE CHOICE, not an industry benchmark and
   not a description of any real portfolio. They are set out here in the open so
   that anyone reading can see exactly what the simulator assumes. */

export const POPULATION: PopulationSpec = {
  seed: 20260811,
  n: 240000,
  days: 30,
  segments: [
    {
      id: 'established',
      name: 'Established cardholder, known merchant',
      share: 0.7,
      baseRate: 0.0008,
      legit: { mu: -2.35, sigma: 1.15 },
      fraud: { mu: 0.95, sigma: 1.2 },
      value: { mu: 4.0, sigma: 1.05 },
      note: 'A cardholder with months of history, spending at a merchant the account has used before. Seven in ten authorisations, and roughly eight basis points of fraud. A score of 60 here is far more likely to be a good customer having an unusual week than a fraud.',
    },
    {
      id: 'novel',
      name: 'New cardholder or new merchant',
      share: 0.22,
      baseRate: 0.006,
      legit: { mu: -2.15, sigma: 1.18 },
      fraud: { mu: 0.9, sigma: 1.2 },
      value: { mu: 4.15, sigma: 1.1 },
      note: 'One side of the pair is unfamiliar. Novelty is a real risk signal and also the ordinary condition of a company onboarding a supplier — about seven times the fraud rate of the established segment.',
    },
    {
      id: 'newcustomer',
      name: 'Customer in its first thirty days',
      share: 0.08,
      baseRate: 0.03,
      legit: { mu: -1.85, sigma: 1.22 },
      fraud: { mu: 0.85, sigma: 1.25 },
      value: { mu: 4.05, sigma: 1.2 },
      note: 'No behavioural baseline exists yet, so almost everything looks novel. Roughly 300 basis points — nearly forty times the established segment. The same score here means something completely different, which is the whole argument for not using one threshold.',
    },
  ],
  /* Fraud that simply does not look like fraud: drawn from the same score
     distribution as legitimate spend, so no threshold can separate it. It caps
     achievable recall in the low eighties, which is the honest ceiling. */
  indistinguishable: 0.18,
}

export const COSTS: CostAssumptions = {
  preventedShare: 0.85,
  minutesPerAlert: 9,
  reviewCapacityPerDay: 200,
  abandonShare: 0.35,
}

/** Where the simulator opens, so the screen is meaningful before anyone touches it.
 *  Chosen to sit just inside the review-capacity ceiling: the queue is nearly full,
 *  so the constraint that actually binds is visible without anyone moving anything. */
export const DEFAULT_THRESHOLD = 53

export const SIM_ASSUMPTIONS: { k: string; v: string }[] = [
  { k: 'Population', v: '240,000 synthetic authorisations over a 30-day window, about 8,000 a day' },
  { k: 'Fraud base rate', v: 'roughly 43 basis points by count overall, spread very unevenly: 8 bps among established cardholders and 300 bps in a customer\u2019s first thirty days, and fixed rather than sampled so the counts do not wobble for reasons the viewer did not cause. A chosen illustrative rate, not an industry figure' },
  { k: 'Scores', v: 'logit-normal, deliberately overlapping. A cleanly separable population would teach the wrong lesson. All three segments share the SAME score distribution shape — as they would under one model — and differ only in how much fraud they contain' },
  { k: 'Values', v: 'log-normal. Fraudulent and legitimate authorisations are drawn from the SAME value distribution — a simplification. In a real portfolio they differ, and that difference would move the cost view' },
  { k: 'Review capacity', v: '200 alerts a day at nine minutes each — about four people. It is a headcount statement wearing a different unit, and it is usually the constraint that binds first' },
  { k: 'Label maturity', v: 'two curves, not one. Fraud the rule ALERTED on is 80% confirmed by day 7, because somebody looked at it. Fraud the rule MISSED is 25% confirmed by day 7, because the only route to a label is a cardholder noticing weeks later. Both reach 100% by day 60' },
  { k: 'Undetectable fraud', v: '18% of the fraud is drawn from the same score distribution as legitimate spend, so no threshold separates it. Recall therefore cannot reach 100% — which is the honest position' },
  { k: 'Seed', v: 'fixed, so every viewer sees identical numbers on every load' },
]
