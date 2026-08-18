import { useMemo } from 'react'
import type { Txn } from '../../lib/sim.ts'

/* ── mirror histogram ───────────────────────────────────────────────────────
   Legitimate authorisations above the axis, fraudulent below. Each series is
   drawn against its OWN maximum and says so, because fraud is a fraction of a
   percent of the volume and a shared axis would render it as a flat line. The
   overlap in the middle is the entire point of the picture. */
const BINS = 50

export function ScoreDistribution({
  pop, threshold, segmentThresholds, w = 560, h = 210,
}: {
  pop: Txn[]
  threshold: number
  segmentThresholds?: number[]
  w?: number
  h?: number
}) {
  const { legit, fraud, legitMax, fraudMax, nLegit, nFraud } = useMemo(() => {
    const l = new Array(BINS).fill(0)
    const f = new Array(BINS).fill(0)
    let nl = 0
    let nf = 0
    for (const t of pop) {
      const b = Math.min(BINS - 1, Math.floor((t.s / 100) * BINS))
      if (t.f) { f[b]++; nf++ } else { l[b]++; nl++ }
    }
    return { legit: l, fraud: f, legitMax: Math.max(...l), fraudMax: Math.max(...f), nLegit: nl, nFraud: nf }
  }, [pop])

  const padL = 6
  const padR = 6
  const axisY = h * 0.56
  const upH = axisY - 26
  const dnH = h - axisY - 26
  const bw = (w - padL - padR) / BINS
  const x = (score: number) => padL + (score / 100) * (w - padL - padR)

  return (
    <figure className="chart">
      <figcaption className="chart-cap">
        <span>Risk score distribution</span>
        <em>Each series drawn to its own maximum — fraud is {((nFraud / (nFraud + nLegit)) * 10000).toFixed(0)} basis points of the volume</em>
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg" role="img"
        aria-label={`Score distribution. ${nLegit.toLocaleString()} legitimate authorisations above the axis and ${nFraud} fraudulent below, overlapping in the middle of the score range.`}>
        {/* the region that fires */}
        <rect x={x(threshold)} y={10} width={w - padR - x(threshold)} height={h - 20} className="ch-fire" />

        {legit.map((v, i) => {
          const bh = legitMax ? (v / legitMax) * upH : 0
          return <rect key={`l${i}`} x={padL + i * bw + 0.5} y={axisY - bh} width={Math.max(1, bw - 1)} height={bh} className="ch-legit" />
        })}
        {fraud.map((v, i) => {
          const bh = fraudMax ? (v / fraudMax) * dnH : 0
          return <rect key={`f${i}`} x={padL + i * bw + 0.5} y={axisY} width={Math.max(1, bw - 1)} height={bh} className="ch-fraud" />
        })}

        <line x1={padL} y1={axisY} x2={w - padR} y2={axisY} className="ch-axis" />

        {segmentThresholds?.map((t, i) => (
          <g key={`s${i}`}>
            <line x1={x(t)} y1={16} x2={x(t)} y2={h - 18} className="ch-seg" />
            <text x={x(t)} y={12} className="ch-seg-l">{`S${i + 1}`}</text>
          </g>
        ))}

        <line x1={x(threshold)} y1={10} x2={x(threshold)} y2={h - 10} className="ch-th" />
        <text x={x(threshold)} y={h - 2} className="ch-th-l">{threshold.toFixed(0)}</text>

        <text x={padL + 4} y={16} className="ch-side">legitimate · {nLegit.toLocaleString()}</text>
        <text x={padL + 4} y={h - 8} className="ch-side f">fraudulent · {nFraud}</text>
        <text x={padL} y={axisY + 13} className="ch-tick">0</text>
        <text x={w - padR} y={axisY + 13} className="ch-tick end">100</text>
      </svg>
    </figure>
  )
}

/* ── the trade curve ────────────────────────────────────────────────────────
   Precision and recall against the threshold, on a shared 0–100% axis, with the
   band where the alert volume exceeds what the team can review shaded out.
   No truncated axis: both series run the full range. */
export function TradeCurve({
  series, threshold, capacityBreachBelow, w = 560, h = 200,
}: {
  series: { th: number; precision: number; recall: number }[]
  threshold: number
  capacityBreachBelow: number
  w?: number
  h?: number
}) {
  const padL = 34
  const padR = 10
  const padT = 12
  const padB = 26
  const x = (t: number) => padL + (t / 100) * (w - padL - padR)
  const y = (v: number) => padT + (1 - v) * (h - padT - padB)
  const path = (k: 'precision' | 'recall') =>
    series.map((p, i) => `${i ? 'L' : 'M'} ${x(p.th).toFixed(1)} ${y(p[k]).toFixed(1)}`).join(' ')
  const here = series.reduce((a, b) => (Math.abs(b.th - threshold) < Math.abs(a.th - threshold) ? b : a), series[0])

  return (
    <figure className="chart">
      <figcaption className="chart-cap">
        <span>The trade, across every threshold</span>
        <em>Shaded band: the queue is larger than the team can review</em>
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg" role="img"
        aria-label="Precision and recall plotted against the threshold. Precision rises and recall falls as the threshold rises.">
        <rect x={padL} y={padT} width={x(capacityBreachBelow) - padL} height={h - padT - padB} className="ch-overcap" />
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={padL} y1={y(g)} x2={w - padR} y2={y(g)} className="ch-grid" />
            <text x={padL - 6} y={y(g) + 4} className="ch-tick end">{`${g * 100}%`}</text>
          </g>
        ))}
        <path d={path('recall')} className="ch-recall" fill="none" />
        <path d={path('precision')} className="ch-precision" fill="none" />
        <line x1={x(threshold)} y1={padT} x2={x(threshold)} y2={h - padB} className="ch-th" />
        <circle cx={x(threshold)} cy={y(here.recall)} r={4} className="ch-dot recall" />
        <circle cx={x(threshold)} cy={y(here.precision)} r={4} className="ch-dot precision" />
        {[0, 25, 50, 75, 100].map((t) => (
          <text key={t} x={x(t)} y={h - 8} className="ch-tick mid">{t}</text>
        ))}
        <text x={padL} y={h - 8} className="ch-axis-l">threshold</text>
      </svg>
      <ul className="chart-key">
        <li><i className="k-recall" />Recall — the share of fraud caught</li>
        <li><i className="k-precision" />Precision — the share of alerts that are fraud</li>
      </ul>
    </figure>
  )
}

/* ── confusion matrix ─────────────────────────────────────────────────────── */
export function ConfusionGrid({
  tp, fp, fn, tn, compact = false,
}: { tp: number; fp: number; fn: number; tn: number; compact?: boolean }) {
  const fmt = (n: number) => n.toLocaleString()
  return (
    <div className={`cm${compact ? ' compact' : ''}`}>
      <div className="cm-cell good">
        <b>{fmt(tp)}</b>
        <span>Fraud stopped</span>
        <em>true positives</em>
      </div>
      <div className="cm-cell warn">
        <b>{fmt(fp)}</b>
        <span>Good customers stopped</span>
        <em>false positives</em>
      </div>
      <div className="cm-cell bad">
        <b>{fmt(fn)}</b>
        <span>Fraud let through</span>
        <em>false negatives</em>
      </div>
      <div className="cm-cell mute">
        <b>{fmt(tn)}</b>
        <span>Good customers through</span>
        <em>true negatives</em>
      </div>
    </div>
  )
}
