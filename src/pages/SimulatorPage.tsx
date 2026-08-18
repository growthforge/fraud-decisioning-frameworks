import { useMemo, useState } from 'react'
import { SectionHeader } from '../components/common/SectionHeader'
import { ScoreDistribution, TradeCurve, ConfusionGrid } from '../components/simulator/charts'
import {
  buildPopulation, metrics, costs, solveSegmentsAtCatch,
} from '../lib/sim.ts'
import { POPULATION, COSTS, DEFAULT_THRESHOLD, SIM_ASSUMPTIONS } from '../data/sim.ts'

type Mode = 'global' | 'segmented'
const LABEL_DAYS = [
  { d: 7, l: 'Day 7' },
  { d: 30, l: 'Day 30' },
  { d: 60, l: 'Day 60' },
] as const

const pct = (v: number) => `${(v * 100).toFixed(1)}%`
const money = (v: number) => `£${Math.round(v).toLocaleString()}`

export function SimulatorPage({ presenting = false }: { presenting?: boolean }) {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD)
  const [mode, setMode] = useState<Mode>('global')
  const [labelDay, setLabelDay] = useState<number>(60)

  const pop = useMemo(() => buildPopulation(POPULATION), [])
  const days = POPULATION.days

  /* the global operating point always drives the comparison, so switching to the
     segmented view holds the catch constant and only the false positives move */
  const globalM = useMemo(() => metrics(pop, threshold, days, labelDay), [pop, threshold, days, labelDay])
  const globalTrue = useMemo(() => metrics(pop, threshold, days), [pop, threshold, days])
  const seg = useMemo(
    () => solveSegmentsAtCatch(pop, POPULATION.segments.length, globalTrue.tp),
    [pop, globalTrue.tp],
  )
  const segM = useMemo(
    () => metrics(pop, (i) => seg.thresholds[i], days, labelDay),
    [pop, seg, days, labelDay],
  )

  const m = mode === 'global' ? globalM : segM
  const c = costs(m, COSTS)

  const series = useMemo(() => {
    const out: { th: number; precision: number; recall: number }[] = []
    for (let t = 0; t <= 100; t += 1) {
      const q = metrics(pop, t, days)
      out.push({ th: t, precision: q.precision, recall: q.recall })
    }
    return out
  }, [pop, days])

  /* the threshold below which the queue exceeds what the team can review */
  const capacityBreachBelow = useMemo(() => {
    for (let t = 0; t <= 100; t += 1) {
      if (metrics(pop, t, days).alertsPerDay <= COSTS.reviewCapacityPerDay) return t
    }
    return 0
  }, [pop, days])

  const over = c.overCapacityBy > 0
  const fpSaved = globalTrue.fp - metrics(pop, (i) => seg.thresholds[i], days).fp

  /* The threshold at which the fraud value stopped first exceeds the legitimate value
     caught alongside it. It is the sharpest number on this page and it sits a long way
     above where a capacity-driven choice would put you. */
  const crossover = useMemo(() => {
    for (let t = 0; t <= 100; t += 1) {
      const q = metrics(pop, t, days)
      if (q.tpValue >= q.fpValue) return { th: t, recall: q.recall, alerts: q.alertsPerDay }
    }
    return null
  }, [pop, days])

  const controls = (
    <div className="sim-controls">
      <div className="sim-slider">
        <label htmlFor="th">
          <span>Threshold</span>
          <b className="mono">{threshold.toFixed(0)}</b>
        </label>
        <input
          id="th"
          type="range"
          min={5}
          max={98}
          step={1}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          aria-describedby="th-help"
        />
        <p id="th-help" className="sim-help">
          Everything scoring at or above the threshold fires. Move it and watch which cost you are paying.
        </p>
      </div>

      <div className="sim-toggles">
        <div className="seg-ctl" role="group" aria-label="Threshold configuration">
          {(['global', 'segmented'] as Mode[]).map((k) => (
            <button key={k} className={mode === k ? 'on' : ''} onClick={() => setMode(k)} aria-pressed={mode === k}>
              {k === 'global' ? 'One threshold' : 'Per segment'}
            </button>
          ))}
        </div>
        <div className="seg-ctl" role="group" aria-label="When the performance is measured">
          {LABEL_DAYS.map((k) => (
            <button key={k.d} className={labelDay === k.d ? 'on' : ''} onClick={() => setLabelDay(k.d)} aria-pressed={labelDay === k.d}>
              {k.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const stats = (
    <dl className="sim-stats">
      <div>
        <dt>{pct(m.precision)}</dt>
        <dd>Precision</dd>
        <dfn>of the alerts raised, the share that were fraud</dfn>
      </div>
      <div>
        <dt>{pct(m.recall)}</dt>
        <dd>Recall</dd>
        <dfn>of the fraud that occurred, the share caught</dfn>
      </div>
      <div className={over ? 'alarm' : ''}>
        <dt>{m.alertsPerDay.toFixed(0)}</dt>
        <dd>Alerts a day</dd>
        <dfn>{over ? `${c.overCapacityBy.toFixed(0)} more than the team can review` : `against a review capacity of ${COSTS.reviewCapacityPerDay}`}</dfn>
      </div>
      <div>
        <dt>{m.goodBlockedPerDay.toFixed(0)}</dt>
        <dd>Good customers stopped, a day</dd>
        <dfn>every one of them a real company that could not spend</dfn>
      </div>
    </dl>
  )

  const conclusion = (
    <p className="sim-conclusion">
      <strong>There is no threshold that is simply right.</strong> Moving it trades one cost for another.
      Where it belongs depends on risk appetite, on the segment, and on how many alerts the team can
      actually work — which is usually what binds first.
    </p>
  )

  if (presenting) {
    return (
      <div className="wrap wide sim-pres">
        <div className="sim-grid-pres">
          <div>
            <ScoreDistribution
              pop={pop}
              threshold={mode === 'global' ? threshold : 0}
              segmentThresholds={mode === 'segmented' ? seg.thresholds : undefined}
              h={186}
            />
            {controls}
          </div>
          <div>
            {stats}
            <ConfusionGrid tp={m.tp} fp={m.fp} fn={m.fn} tn={m.tn} compact />
          </div>
        </div>
        {conclusion}
        <p className="synthetic-note">
          SYNTHETIC DATA · ILLUSTRATIVE — {POPULATION.n.toLocaleString()} generated authorisations from a fixed
          seed. No real portfolio, rule or threshold is represented anywhere in this.
        </p>
      </div>
    )
  }

  return (
    <div className="wrap wide">
      <SectionHeader
        eyebrow="05 · The trade-off, moved"
        title="The tuning simulator"
        lede="A threshold is not a setting. It is a position on a curve, and every position spends four currencies at once: fraud loss, customer friction, analyst time, and the regulatory or scheme ceiling you are working under. Move the threshold and watch which one you are paying."
      />

      <p className="synthetic-note big">
        SYNTHETIC DATA · ILLUSTRATIVE — {POPULATION.n.toLocaleString()} authorisations generated in your browser
        from a fixed seed, so every viewer sees identical figures. Nothing here describes any real portfolio,
        rule, threshold or fraud rate.
      </p>

      {controls}
      {stats}

      <div className="sim-grid">
        <ScoreDistribution
          pop={pop}
          threshold={mode === 'global' ? threshold : 0}
          segmentThresholds={mode === 'segmented' ? seg.thresholds : undefined}
        />
        <TradeCurve series={series} threshold={threshold} capacityBreachBelow={capacityBreachBelow} />
      </div>

      <div className="sim-grid">
        <div>
          <h3 className="sub">What the operating point actually produced</h3>
          <ConfusionGrid tp={m.tp} fp={m.fp} fn={m.fn} tn={m.tn} />
        </div>
        <div>
          <h3 className="sub">What it cost — and what the rule actually does</h3>
          <p className="cost-frame">
            This models a rule that <strong>raises an alert</strong>, not one that declines. That matters,
            because the same firing event costs completely different things depending on the action. An
            alert costs analyst time and a delay. A decline costs the customer the purchase. Pricing a
            false positive without saying which action produced it is how a rule ends up justified on the
            wrong arithmetic.
          </p>
          <dl className="cost-list">
            <div>
              <dt>Fraud value stopped</dt>
              <dd>{money(c.fraudPrevented)}</dd>
              <p>assuming {Math.round(COSTS.preventedShare * 100)}% of a stopped fraud is genuinely avoided rather than simply attempted elsewhere</p>
            </div>
            <div>
              <dt>Analyst time generated</dt>
              <dd>{c.analystHoursPerDay.toFixed(1)} hours a day</dd>
              <p>at {COSTS.minutesPerAlert} minutes an alert. Past capacity this does not become overtime, it becomes unreviewed alerts</p>
            </div>
            <div className={over ? 'alarm' : ''}>
              <dt>Against review capacity</dt>
              <dd>{over ? `${c.overCapacityBy.toFixed(0)} over` : `${(COSTS.reviewCapacityPerDay - m.alertsPerDay).toFixed(0)} to spare`}</dd>
              <p>a threshold the queue cannot absorb is not a conservative choice. It is a control failure that shows up as undetected fraud</p>
            </div>
            <div>
              <dt>If the same rule declined instead</dt>
              <dd>{money(c.legitimateBlocked)}</dd>
              <p>of legitimate spend stopped rather than delayed, at the same operating point. The analyst cost disappears and the customer cost replaces it — which is why the action is part of the rule design, not a detail added afterwards</p>
            </div>
          </dl>
        </div>
      </div>

      {crossover ? (
        <div className="crossover">
          <h3 className="sub">The number this page is really about</h3>
          <p>
            At the operating point above, the fraud value stopped is{' '}
            <b>{money(globalTrue.tpValue * COSTS.preventedShare)}</b> and the legitimate value caught
            alongside it is <b>{money(globalTrue.fpValue)}</b>. On these synthetic figures the control
            touches several times more good money than bad — and that is not a broken rule, it is what a
            high-recall control on a rare event looks like.
          </p>
          <p>
            The two only cross at a threshold of about <b>{crossover.th}</b>, where recall has fallen to{' '}
            <b>{(crossover.recall * 100).toFixed(0)}%</b> and the queue is down to{' '}
            <b>{crossover.alerts.toFixed(0)} alerts a day</b>. So if you optimised purely on value you
            would run far tighter than any capacity argument would push you, and you would miss most of
            the fraud.
          </p>
          <p>
            Which is the honest conclusion of the whole exercise: <strong>the threshold is not where the
            answer is.</strong> Moving it only chooses which cost you pay. The moves that actually improve
            both sides are better features, better segmentation, and putting the control at the right
            layer — an alert where a human can resolve it, a decline only where the evidence carries it.
          </p>
        </div>
      ) : null}

      <div className="sim-note">
        <h3 className="sub">Two things the controls are for</h3>
        <div className="sim-note-g">
          <div>
            <h4>One threshold, or one per segment</h4>
            <p>
              Switching to <em>per segment</em> holds the catch exactly constant — the same {globalTrue.tp} frauds
              are stopped — and only the false positives move. They fall by{' '}
              <b>{fpSaved.toLocaleString()}</b>, about {((fpSaved / Math.max(1, globalTrue.fp)) * 100).toFixed(0)}%.
            </p>
            <p>
              The reason is not that segmentation is a better technique. It is that the same score means
              different things in different populations. Where fraud is rare, a high score is still most
              likely a good customer, so the bar has to be higher. Where there is no behavioural baseline yet,
              it has to be lower. One global threshold is simultaneously too tight for the first population
              and too loose for the second.
            </p>
          </div>
          <div>
            <h4>Day 7, day 30, day 60</h4>
            <p>
              The same operating point, measured at different distances from the decision. Confirmed-fraud
              labels do not arrive when the decision is made. They arrive over weeks, and — this is the part
              that matters — they arrive at two different speeds. Fraud the rule <em>alerted</em> on confirms
              quickly, because somebody already looked at it and asked the customer. Fraud the rule
              <em>missed</em> confirms slowly, because the only route to a label is a cardholder noticing a
              charge and disputing it.
            </p>
            <p>
              One cause, three numbers moving in three different directions. Watch them as you switch:
            </p>
            <ul className="mat-list">
              <li>
                <b>Precision looks worse than it is.</b> Frauds whose labels have not arrived are sitting in
                the false-positive column, so the rule is being blamed for stopping customers it correctly
                stopped.
              </li>
              <li>
                <b>Recall looks better than it is.</b> This is the one that catches people out. You learn
                about the fraud you caught faster than the fraud you missed, so the denominator is
                understated and the rule looks more complete than it is. It is the same alert-feedback bias
                that makes a rule estate reinforce its own blind spots: you only ever get labels for what
                you already flagged.
              </li>
              <li>
                <b>The portfolio looks healthier than it is.</b> The measured fraud rate is well below the
                truth for the same reason — those frauds have not been counted yet.
              </li>
            </ul>
            <p>
              So the honest position is not to pick the flattering number or the pessimistic one. It is to
              refuse to quote any of them until the window has matured, and to say what the maturity window
              is when you do.
            </p>
          </div>
        </div>
      </div>

      {conclusion}

      <div className="assumptions">
        <h3 className="sub">Everything this assumes, in the open</h3>
        <dl>
          {SIM_ASSUMPTIONS.map((a) => (
            <div key={a.k}>
              <dt>{a.k}</dt>
              <dd>{a.v}</dd>
            </div>
          ))}
        </dl>
        <p className="assumptions-foot">
          These are chosen illustrative values, not benchmarks, and not a description of any firm. A threshold
          is portfolio-specific — that is itself the point, and it is why no number here should be carried
          anywhere else.
        </p>
      </div>
    </div>
  )
}
