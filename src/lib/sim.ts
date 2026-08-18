/* ───────────────────────────────────────────────────────────────────────────
   The tuning simulator's statistical core.

   Everything here is SYNTHETIC and deterministic. The population is generated
   from a fixed seed so that every viewer, on every load, sees exactly the same
   numbers — a simulator whose figures move between screenings is worse than no
   simulator at all.

   Nothing in this file describes any real portfolio. The base rates, score
   distributions, amounts and unit costs are declared illustrative choices.
   ─────────────────────────────────────────────────────────────────────────── */

/* ── deterministic PRNG: mulberry32 ─────────────────────────────────────────
   32-bit, seedable, fast, and adequate for generating an illustrative sample.
   Chosen over Math.random precisely because it is reproducible. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Standard normal by Box–Muller. Deterministic given the supplied uniform. */
export function gaussian(rnd: () => number): number {
  let u = 0
  let v = 0
  while (u === 0) u = rnd()
  while (v === 0) v = rnd()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/**
 * Logit-normal score on (0, 100).
 *
 * Chosen over a beta distribution because it is bounded, skewable, needs only
 * two interpretable parameters, and is trivial to implement without ambiguity —
 * which matters more here than elegance, because the implementation has to be
 * checkable against the specification.
 *
 * `mu` shifts the centre in log-odds space; `sigma` widens the spread.
 */
export function logitNormal(rnd: () => number, mu: number, sigma: number): number {
  const z = mu + sigma * gaussian(rnd)
  return 100 / (1 + Math.exp(-z))
}

/** Log-normal transaction value, in whole units of currency. */
export function logNormalAmount(rnd: () => number, mu: number, sigma: number): number {
  return Math.round(Math.exp(mu + sigma * gaussian(rnd)))
}

/* ── the population ─────────────────────────────────────────────────────── */

export interface SegmentSpec {
  id: string
  name: string
  /** share of all authorisations falling in this segment */
  share: number
  /** illustrative fraud base rate within this segment */
  baseRate: number
  /** score distribution of legitimate authorisations */
  legit: { mu: number; sigma: number }
  /** score distribution of fraudulent authorisations */
  fraud: { mu: number; sigma: number }
  /** value distribution, log-normal parameters */
  value: { mu: number; sigma: number }
  note: string
}

export interface Txn {
  /** risk score, 0–100 */
  s: number
  /** true label: is this authorisation fraudulent */
  f: boolean
  /** segment index */
  g: number
  /** value in whole currency units */
  v: number
  /** uniform draw used to decide whether this fraud's label has arrived yet */
  u: number
}

/**
 * How much of the fraud has been CONFIRMED by a given measurement date.
 *
 * Two curves, not one, and the difference is the whole point. Fraud the rule
 * alerted on confirms quickly, because somebody already looked at it and asked
 * the customer. Fraud the rule missed confirms slowly, because the only route to
 * a label is the cardholder noticing a charge and disputing it weeks later.
 *
 * All six numbers are invented for this page and declared on screen.
 */
export const MATURITY: Record<number, { alerted: number; missed: number }> = {
  7: { alerted: 0.8, missed: 0.25 },
  14: { alerted: 0.92, missed: 0.45 },
  30: { alerted: 0.98, missed: 0.78 },
  60: { alerted: 1, missed: 1 },
}
function matured(day: number, fired: boolean): number {
  const days = Object.keys(MATURITY).map(Number).sort((a, b) => a - b)
  const d = days.find((x) => day <= x) ?? days[days.length - 1]
  const c = MATURITY[d]
  return fired ? c.alerted : c.missed
}

export interface PopulationSpec {
  seed: number
  /** total authorisations in the illustrative window */
  n: number
  /** days the window represents, used to express volumes per day */
  days: number
  segments: SegmentSpec[]
  /**
   * Share of fraud drawn from the LEGITIMATE score distribution — fraud that
   * simply does not look like fraud. It caps achievable recall below 100%,
   * which is the honest position: no threshold catches everything, and a
   * simulator where recall reaches 100% teaches the opposite.
   */
  indistinguishable: number
}

export function buildPopulation(spec: PopulationSpec): Txn[] {
  const rnd = mulberry32(spec.seed)
  const out: Txn[] = []
  const totalShare = spec.segments.reduce((a, s) => a + s.share, 0)

  /* Counts are fixed integers rather than Bernoulli draws. With fraud this rare,
     sampling the label would make the headline numbers wobble for reasons that
     have nothing to do with the threshold, and every figure on the screen has to
     be attributable to something the viewer did. */
  spec.segments.forEach((seg, gi) => {
    const count = Math.round((seg.share / totalShare) * spec.n)
    const nFraud = Math.round(count * seg.baseRate)
    const nHidden = Math.round(nFraud * spec.indistinguishable)
    for (let i = 0; i < count; i++) {
      const f = i < nFraud
      /* the first nHidden frauds are drawn from the legitimate distribution */
      const d = f && i >= nHidden ? seg.fraud : seg.legit
      const s = logitNormal(rnd, d.mu, d.sigma)
      const v = logNormalAmount(rnd, seg.value.mu, seg.value.sigma)
      out.push({ s, f, g: gi, v, u: rnd() })
    }
  })
  return out
}

/* ── metrics at an operating point ──────────────────────────────────────── */

export interface Confusion {
  tp: number
  fp: number
  tn: number
  fn: number
  /** value of fraud caught, and of legitimate spend blocked */
  tpValue: number
  fpValue: number
  fnValue: number
}

export interface Metrics extends Confusion {
  precision: number
  recall: number
  fpr: number
  /** alerts raised per day across the window */
  alertsPerDay: number
  /** legitimate authorisations blocked per day */
  goodBlockedPerDay: number
  fraudRateBps: number
}

/**
 * Confusion counts at a threshold. `thresholdFor` allows a different cut-off per
 * segment; pass a single number for one global threshold.
 *
 * `labelDay` gates which frauds are *known* to be fraud at the moment of
 * measurement. At day 7 most chargebacks have not arrived, so a fraud that is
 * genuinely a fraud is not yet counted as one — which flatters precision and is
 * the single most common way a rule's early numbers mislead.
 */
export function confusion(
  pop: Txn[],
  thresholdFor: number | ((g: number) => number),
  labelDay = Infinity,
): Confusion {
  const th = typeof thresholdFor === 'function' ? thresholdFor : () => thresholdFor
  let tp = 0, fp = 0, tn = 0, fn = 0, tpValue = 0, fpValue = 0, fnValue = 0
  for (const t of pop) {
    const fired = t.s >= th(t.g)
    /* a fraud whose label has not matured is, at this moment, indistinguishable
       from a legitimate authorisation */
    const knownFraud = t.f && t.u <= matured(labelDay, fired)
    if (fired && knownFraud) { tp++; tpValue += t.v }
    else if (fired && !knownFraud) { fp++; fpValue += t.v }
    else if (!fired && knownFraud) { fn++; fnValue += t.v }
    else tn++
  }
  return { tp, fp, tn, fn, tpValue, fpValue, fnValue }
}

export function metrics(
  pop: Txn[],
  thresholdFor: number | ((g: number) => number),
  days: number,
  labelDay = Infinity,
): Metrics {
  const c = confusion(pop, thresholdFor, labelDay)
  const fired = c.tp + c.fp
  const positives = c.tp + c.fn
  const negatives = c.fp + c.tn
  return {
    ...c,
    precision: fired ? c.tp / fired : 0,
    recall: positives ? c.tp / positives : 0,
    fpr: negatives ? c.fp / negatives : 0,
    alertsPerDay: fired / days,
    goodBlockedPerDay: c.fp / days,
    fraudRateBps: pop.length ? (positives / pop.length) * 10000 : 0,
  }
}

/* ── segmentation ───────────────────────────────────────────────────────── */

/* Per-segment score curve: for every candidate cut-off, how many true and false
   positives sit at or above it. Precomputed once so the solver is cheap. */
interface Curve { score: number[]; tp: number[]; fp: number[] }

function buildCurves(pop: Txn[], segments: number): Curve[] {
  const bySeg: Txn[][] = Array.from({ length: segments }, () => [])
  for (const t of pop) bySeg[t.g].push(t)
  return bySeg.map((seg) => {
    const sorted = [...seg].sort((a, b) => b.s - a.s)
    const score: number[] = [100]
    const tp: number[] = [0]
    const fp: number[] = [0]
    let ctp = 0
    let cfp = 0
    for (const t of sorted) {
      if (t.f) ctp++
      else cfp++
      score.push(t.s)
      tp.push(ctp)
      fp.push(cfp)
    }
    return { score, tp, fp }
  })
}

/**
 * Find per-segment thresholds that catch EXACTLY the same number of frauds as a
 * given global threshold, with as few false positives as possible.
 *
 * Matching the true-positive count rather than a recall percentage matters:
 * with a realistically small number of frauds, recall moves in visible steps and
 * "equal recall" would otherwise be approximate. Matching the count makes the
 * comparison exact, so the false-positive difference is the only thing that moved.
 *
 * The method is the Neyman–Pearson solution. For a multiplier λ each segment
 * independently takes the cut-off maximising (true positives − λ × false
 * positives); raising λ makes every segment stricter, so the total catch falls
 * monotonically and can be bisected. A short greedy trim then sheds any surplus
 * catch from wherever it is costing the most false positives.
 *
 * What comes out is the argument for segmentation arrived at rather than
 * asserted: the segment where fraud is rare gets a HIGHER bar, because a given
 * score there is far more likely to belong to a good customer, and the segment
 * where fraud is common and poorly separated gets a lower one. A single global
 * threshold is simultaneously too tight for the first and too loose for the second.
 */
export function solveSegmentsAtCatch(
  pop: Txn[],
  segments: number,
  targetTp: number,
): { thresholds: number[]; tp: number; fp: number } {
  const curves = buildCurves(pop, segments)

  const pick = (c: Curve, lambda: number): number => {
    let bi = 0
    let bo = -Infinity
    for (let i = 0; i < c.score.length; i++) {
      const o = c.tp[i] - lambda * c.fp[i]
      if (o > bo) { bo = o; bi = i }
    }
    return bi
  }

  /* bisect λ for the smallest catch that is still at or above the target */
  let lo = 0
  let hi = 500
  let idx = curves.map((c) => pick(c, hi))
  for (let it = 0; it < 60; it++) {
    const mid = (lo + hi) / 2
    const cand = curves.map((c) => pick(c, mid))
    const tp = cand.reduce((a, i, g) => a + curves[g].tp[i], 0)
    if (tp >= targetTp) { lo = mid; idx = cand } else hi = mid
  }

  /* trim the surplus: repeatedly give up the marginal fraud in whichever segment
     is paying the most false positives to hold on to it */
  let tp = idx.reduce((a, i, g) => a + curves[g].tp[i], 0)
  let guard = 0
  while (tp > targetTp && guard++ < 5000) {
    let bestG = -1
    let bestRatio = -Infinity
    for (let g = 0; g < segments; g++) {
      const c = curves[g]
      let j = idx[g]
      /* step back to the next lower catch in this segment */
      while (j > 0 && c.tp[j - 1] === c.tp[j]) j--
      if (j <= 0) continue
      const dTp = c.tp[idx[g]] - c.tp[j - 1]
      const dFp = c.fp[idx[g]] - c.fp[j - 1]
      if (dTp <= 0) continue
      const ratio = dFp / dTp
      if (ratio > bestRatio) { bestRatio = ratio; bestG = g }
    }
    if (bestG < 0) break
    const c = curves[bestG]
    let j = idx[bestG]
    while (j > 0 && c.tp[j - 1] === c.tp[j]) j--
    idx[bestG] = j - 1
    tp = idx.reduce((a, i, g) => a + curves[g].tp[i], 0)
  }

  const fp = idx.reduce((a, i, g) => a + curves[g].fp[i], 0)
  /* sit the cut-off just below the lowest included score so the boundary row is kept */
  const thresholds = idx.map((i, g) => {
    const c = curves[g]
    const inc = c.score[i]
    const next = i + 1 < c.score.length ? c.score[i + 1] : 0
    return i === 0 ? 100 : (inc + next) / 2
  })

  /* One threshold applied everywhere is itself a valid segmented configuration, so
     the answer can never legitimately be worse than it. The greedy trim walks a
     discrete frontier and can step past the optimum, so check and fall back. */
  const flat = thresholdForCatch(pop, targetTp)
  let flatFp = 0
  let flatTp = 0
  for (const t of pop) {
    if (t.s >= flat) { if (t.f) flatTp++; else flatFp++ }
  }
  if (flatTp === targetTp && flatFp <= fp) {
    return { thresholds: curves.map(() => flat), tp: flatTp, fp: flatFp }
  }
  return { thresholds, tp, fp }
}

/** The global cut-off that catches exactly `k` frauds: the k-th highest fraud score. */
export function thresholdForCatch(pop: Txn[], k: number): number {
  const fs = pop.filter((t) => t.f).map((t) => t.s).sort((a, b) => b - a)
  if (k <= 0) return 100
  if (k >= fs.length) return 0
  const inc = fs[k - 1]
  const nxt = fs[k]
  return (inc + nxt) / 2
}

/* ── the cost view ──────────────────────────────────────────────────────── */

export interface CostAssumptions {
  /** share of fraud value that is actually recovered when a rule stops it */
  preventedShare: number
  /** minutes an analyst spends resolving one alert */
  minutesPerAlert: number
  /** alerts the team can absorb in a day before quality collapses */
  reviewCapacityPerDay: number
  /** share of blocked legitimate spend that is simply lost rather than retried */
  abandonShare: number
}

export interface Costs {
  fraudPrevented: number
  legitimateBlocked: number
  analystHoursPerDay: number
  overCapacityBy: number
  fraudMissed: number
}

export function costs(m: Metrics, a: CostAssumptions): Costs {
  return {
    fraudPrevented: m.tpValue * a.preventedShare,
    legitimateBlocked: m.fpValue * a.abandonShare,
    analystHoursPerDay: (m.alertsPerDay * a.minutesPerAlert) / 60,
    overCapacityBy: Math.max(0, m.alertsPerDay - a.reviewCapacityPerDay),
    fraudMissed: m.fnValue,
  }
}
