/* Invariants for the tuning simulator. If any of these fail, the simulator is
   teaching something false, which is worse than not having one. */

import { buildPopulation, metrics, confusion, solveSegmentsAtCatch, costs } from '../src/lib/sim.ts'
import { POPULATION, COSTS, DEFAULT_THRESHOLD as DEFAULT } from '../src/data/sim.ts'

let fail = 0
let n = 0
function ok(c: boolean, m: string, extra = '') {
  n++
  if (!c) { fail++; console.error(`  ✗ ${m}${extra ? ` — ${extra}` : ''}`) }
  else console.log(`  ✓ ${m}${extra ? ` — ${extra}` : ''}`)
}

const pop = buildPopulation(POPULATION)
const fraud = pop.filter((t) => t.f).length
const days = POPULATION.days

console.log(`Simulator invariants\n\npopulation ${pop.length} rows, ${fraud} fraudulent (${((fraud / pop.length) * 10000).toFixed(1)} bps)`)

/* 1. determinism */
const pop2 = buildPopulation(POPULATION)
ok(pop.length === pop2.length && pop.every((t, i) => t.s === pop2[i].s && t.f === pop2[i].f),
   'the population is identical on a second build (deterministic seed)')

/* 2. the confusion matrix is complete at every threshold */
let complete = true
let monotone = true
let prev = 1.1
for (let th = 0; th <= 100; th += 2) {
  const c = confusion(pop, th)
  if (c.tp + c.fp + c.tn + c.fn !== pop.length) complete = false
  if (c.tp + c.fn !== fraud) complete = false
  const r = c.tp / fraud
  if (r > prev + 1e-9) monotone = false
  prev = r
}
ok(complete, 'TP+FP+TN+FN equals the population and TP+FN equals total fraud at every threshold')
ok(monotone, 'recall is monotonically non-increasing as the threshold rises')

/* 3. precision improves as the threshold rises */
const lowP = metrics(pop, 20, days).precision
const highP = metrics(pop, 90, days).precision
ok(highP > lowP, 'precision at a high threshold exceeds precision at a low one',
   `${(lowP * 100).toFixed(2)}% → ${(highP * 100).toFixed(2)}%`)

/* 3b. recall is capped: some fraud simply does not look like fraud */
const wideOpen = metrics(pop, 0, days)
ok(wideOpen.recall > 0.95, 'firing on everything catches almost everything (sanity)', `${(wideOpen.recall*100).toFixed(1)}%`)
const bestReal = metrics(pop, 25, days)
ok(bestReal.recall < 0.95, 'recall cannot be driven to 100% at any usable threshold — some fraud is drawn from the legitimate distribution',
   `${(bestReal.recall*100).toFixed(1)}% at threshold 25`)

/* 4. the class-imbalance lesson: a do-nothing rule scores near-perfect accuracy */
const doNothing = confusion(pop, 101)
const acc = (doNothing.tp + doNothing.tn) / pop.length
ok(acc > 0.99, 'a rule that fires on nothing still scores above 99% accuracy — the accuracy paradox holds',
   `${(acc * 100).toFixed(2)}%`)

/* 5. segmentation beats one global threshold at IDENTICAL catch */
const g = metrics(pop, DEFAULT, days)
const seg = solveSegmentsAtCatch(pop, POPULATION.segments.length, g.tp)
const sm = metrics(pop, (i) => seg.thresholds[i], days)
ok(sm.tp === g.tp, 'the segmented configuration catches exactly the same frauds as the global threshold',
   `${g.tp} vs ${sm.tp}`)
ok(sm.fp < g.fp, 'and does it with fewer false positives',
   `${g.fp} → ${sm.fp} (${(((g.fp - sm.fp) / g.fp) * 100).toFixed(1)}% fewer)`)
ok(seg.thresholds[0] > seg.thresholds[2],
   'the low-rate, well-separated segment gets a HIGHER bar and the new-customer segment a lower one — a single global threshold is simultaneously too tight for the first and too loose for the second',
   `${seg.thresholds.map((t) => t.toFixed(1)).join(' · ')}`)

/* 6. label maturity biases two headline numbers in OPPOSITE directions.
      Both come from the same cause — frauds whose labels have not arrived are
      counted as legitimate — and that is the point worth making. */
const early = metrics(pop, DEFAULT, days, 7)
const mature = metrics(pop, DEFAULT, days, 60)
ok(early.precision < mature.precision,
   'precision measured at day 7 is LOWER than at day 60 — unconfirmed frauds are counted as false positives, so the rule looks worse than it is',
   `${(early.precision * 100).toFixed(2)}% → ${(mature.precision * 100).toFixed(2)}%`)
ok(early.fraudRateBps < mature.fraudRateBps,
   'the measured fraud rate at day 7 is LOWER than at day 60 — so the portfolio looks healthier than it is, from the same missing labels',
   `${early.fraudRateBps.toFixed(1)}bps → ${mature.fraudRateBps.toFixed(1)}bps`)
ok(early.tp < mature.tp, 'fewer frauds are known at day 7 than at day 60', `${early.tp} → ${mature.tp}`)

/* 7. the capacity ceiling actually binds somewhere sensible */
const atDefault = metrics(pop, DEFAULT, days)
const c = costs(atDefault, COSTS)
ok(atDefault.alertsPerDay > 0, 'the default operating point raises alerts', `${atDefault.alertsPerDay.toFixed(0)}/day`)
console.log(`    at threshold ${DEFAULT}: precision ${(atDefault.precision * 100).toFixed(1)}%, recall ${(atDefault.recall * 100).toFixed(1)}%, ${atDefault.alertsPerDay.toFixed(0)} alerts/day, ${c.analystHoursPerDay.toFixed(1)} analyst hours/day, over capacity by ${c.overCapacityBy.toFixed(0)}`)

/* 8. there must exist a threshold where the queue is inside capacity, and one where it is not */
const wide = metrics(pop, 30, days).alertsPerDay
const tight = metrics(pop, 92, days).alertsPerDay
ok(wide > COSTS.reviewCapacityPerDay && tight < COSTS.reviewCapacityPerDay,
   'the review-capacity line falls inside the slider range, so the constraint is visible',
   `${wide.toFixed(0)}/day at 30 vs ${tight.toFixed(0)}/day at 92, capacity ${COSTS.reviewCapacityPerDay}`)

/* 9. the default operating point must sit close to, but inside, review capacity —
      so the constraint is the first thing a viewer sees, and moving left breaches it */
const capUse = atDefault.alertsPerDay / COSTS.reviewCapacityPerDay
ok(capUse > 0.6 && capUse <= 1.0, 'the default operating point sits inside review capacity but close enough to feel it',
   `${(capUse * 100).toFixed(0)}% of capacity`)

console.log(`\n${fail === 0 ? '✓ PASS' : '✗ FAIL'} — ${n - fail}/${n} invariants hold`)
if (fail > 0) process.exit(1)
