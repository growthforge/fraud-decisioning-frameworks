import { useEffect, useMemo, useRef, useState } from 'react'
import { Maximize2, Minus, Plus, RotateCcw } from 'lucide-react'
import type { LaneMap, LaneNode } from '../../data/types.ts'

/* ── fixed grid geometry ────────────────────────────────────────────────────
   Sized for a remote screen share: the whole diagram must stay legible inside
   a 1280×720 shared window, so nodes are larger and labels heavier than in the
   previous build. `scripts/verify.ts` asserts the arithmetic — a screenshot
   scales and would hide an unreadable label. */
const GUTTER = 118      // lane-label column
const COL_W = 158
const LANE_H = 100
const NW = 134
const NH = 62
const PAD_T = 12
const PAD_B = 16
const PAD_R = 26
/* feedback edges run in their own channel below every lane so they can never
   cross a node. Without it a backward edge dips under whichever lane it starts
   in and collides with whatever is sitting there. */
const CHANNEL_ROW = 17

interface Props {
  map: LaneMap
  activeId: string | null
  onSelect: (id: string | null) => void
  /** presenter mode: no toolbar, no pan, fitted to the frame */
  fixed?: boolean
}

interface Placed { n: LaneNode; x: number; y: number; cx: number; cy: number }

export function SwimlaneMap({ map, activeId, onSelect, fixed = false }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const drag = useRef<{ x: number; sl: number } | null>(null)

  const cols = useMemo(() => Math.max(...map.nodes.map((n) => n.col)) + 1, [map])
  const lanes = map.lanes.length
  /* Feedback edges get a row each inside the channel. Sharing one row makes two
     backward edges that span the same columns draw over each other, and their
     labels overprint into nonsense. */
  const loopRow = useMemo(() => {
    const m = new Map<string, number>()
    map.edges.filter((e) => e.kind === 'loop').forEach((e, i) => m.set(`${e.from}|${e.to}`, i))
    return m
  }, [map])
  const nLoops = loopRow.size
  const hasLoop = nLoops > 0
  const W = GUTTER + cols * COL_W + PAD_R
  const laneBottom = PAD_T + lanes * LANE_H
  const channelH = hasLoop ? CHANNEL_ROW * nLoops + 14 : 0
  const H = laneBottom + channelH + PAD_B
  const channelY = (i: number) => laneBottom + 15 + i * CHANNEL_ROW

  const placed = useMemo<Placed[]>(
    () =>
      map.nodes.map((n) => {
        const x = GUTTER + n.col * COL_W + (COL_W - NW) / 2
        const y = PAD_T + n.lane * LANE_H + (LANE_H - NH) / 2
        return { n, x, y, cx: x + NW / 2, cy: y + NH / 2 }
      }),
    [map],
  )

  const byId = useMemo(() => {
    const m: Record<string, Placed> = {}
    placed.forEach((p) => (m[p.n.id] = p))
    return m
  }, [placed])

  /* Zoom is a multiple of the container width. At 1 the diagram fits exactly,
     whatever the container turns out to be, so the last column can never be
     clipped. Above 1 the canvas scrolls. */
  useEffect(() => {
    setZoom(1)
    onSelect(null)
    if (wrapRef.current) wrapRef.current.scrollLeft = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map.id])

  const onDown = (e: React.PointerEvent) => {
    if (fixed) return
    if ((e.target as Element).closest('.sl-node')) return
    drag.current = { x: e.clientX, sl: wrapRef.current?.scrollLeft ?? 0 }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !wrapRef.current) return
    wrapRef.current.scrollLeft = drag.current.sl - (e.clientX - drag.current.x)
  }
  const onUp = () => { drag.current = null }

  /* keyboard traversal: move to the nearest node in that direction */
  const step = (dir: 'l' | 'r' | 'u' | 'd') => {
    const cur = activeId ? byId[activeId] : null
    if (!cur) { onSelect(placed[0]?.n.id ?? null); return }
    const pool = placed.filter((p) => {
      if (dir === 'l') return p.n.col < cur.n.col
      if (dir === 'r') return p.n.col > cur.n.col
      if (dir === 'u') return p.n.lane < cur.n.lane
      return p.n.lane > cur.n.lane
    })
    if (!pool.length) return
    pool.sort(
      (a, b) => Math.hypot(a.cx - cur.cx, a.cy - cur.cy) - Math.hypot(b.cx - cur.cx, b.cy - cur.cy),
    )
    onSelect(pool[0].n.id)
  }

  /* orthogonal edge path with rounded corners. Returns the path and the point a
     label should sit at, so a label can never float away from its own line.
     Feedback labels sit at the START of their horizontal run rather than its
     midpoint: two feedback edges spanning the same columns have midpoints in the
     same place and their labels overprint each other. */
  const edgeGeom = (
    a: Placed,
    b: Placed,
    kind: string,
    row = 0,
  ): { d: string; lx: number; ly: number; anchor: 'start' | 'middle' | 'end' } => {
    const r = 9
    const sameLane = a.n.lane === b.n.lane
    const backward = b.n.col <= a.n.col

    if (backward || kind === 'loop') {
      const y = channelY(row)
      const dir = b.cx < a.cx ? -1 : 1
      return {
        d:
          `M ${a.cx} ${a.y + NH} L ${a.cx} ${y - r} Q ${a.cx} ${y} ${a.cx + dir * r} ${y} ` +
          `L ${b.cx - dir * r} ${y} Q ${b.cx} ${y} ${b.cx} ${y - r} L ${b.cx} ${b.y + NH + 7}`,
        lx: a.cx + dir * 14,
        ly: y - 6,
        anchor: dir < 0 ? 'end' : 'start',
      }
    }

    if (sameLane) {
      return {
        d: `M ${a.x + NW} ${a.cy} L ${b.x - 7} ${b.cy}`,
        lx: (a.x + NW + b.x) / 2,
        ly: a.cy - 7,
        anchor: 'middle',
      }
    }

    /* cross-lane hand-off: right, vertical in the column gap, then into the target */
    const midX = b.x - (COL_W - NW) / 2 - 14
    const down = b.cy > a.cy
    const v = down ? 1 : -1
    return {
      d:
        `M ${a.x + NW} ${a.cy} L ${midX - r} ${a.cy} Q ${midX} ${a.cy} ${midX} ${a.cy + v * r} ` +
        `L ${midX} ${b.cy - v * r} Q ${midX} ${b.cy} ${midX + r} ${b.cy} L ${b.x - 7} ${b.cy}`,
      lx: midX - 6,
      ly: (a.cy + b.cy) / 2,
      anchor: 'end',
    }
  }

  return (
    <div className={`sl-shell${fixed ? ' sl-still' : ''}`}>
      {!fixed ? (
        <div className="sl-toolbar no-print">
          <span className="sl-legend">{map.legend}</span>
          <div className="sl-zoom">
            <button className="icon-btn" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))} aria-label="Zoom out">
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="sl-pct mono">{Math.round(zoom * 100)}%</span>
            <button className="icon-btn" onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.2).toFixed(2)))} aria-label="Zoom in">
              <Plus size={14} aria-hidden="true" />
            </button>
            <button
              className="icon-btn"
              onClick={() => { setZoom(1); if (wrapRef.current) wrapRef.current.scrollLeft = 0 }}
              aria-label="Fit whole diagram to view"
            >
              <Maximize2 size={14} aria-hidden="true" />
            </button>
            <button className="icon-btn" onClick={() => { setZoom(1); if (wrapRef.current) wrapRef.current.scrollLeft = 0; onSelect(null) }} aria-label="Reset diagram">
              <RotateCcw size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <div
        className="sl-canvas"
        ref={wrapRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: `${zoom * 100}%` }}
          className="sl"
          role="group"
          aria-label={`${map.title}. Swimlane diagram, ${map.nodes.length} steps across ${lanes} lanes.`}
          onKeyDown={(e) => {
            const k = e.key
            if (k === 'ArrowRight') { e.preventDefault(); step('r') }
            else if (k === 'ArrowLeft') { e.preventDefault(); step('l') }
            else if (k === 'ArrowUp') { e.preventDefault(); step('u') }
            else if (k === 'ArrowDown') { e.preventDefault(); step('d') }
          }}
        >
          <defs>
            <marker id="sl-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,1.4 L7,4.5 L0,7.6" fill="none" stroke="#b9a9b9" strokeWidth="1.5" strokeLinecap="round" />
            </marker>
            <marker id="sl-a-h" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,1.4 L7,4.5 L0,7.6" fill="none" stroke="var(--burgundy)" strokeWidth="1.6" strokeLinecap="round" />
            </marker>
            <marker id="sl-a-e" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,1.4 L7,4.5 L0,7.6" fill="none" stroke="var(--warn)" strokeWidth="1.6" strokeLinecap="round" />
            </marker>
            <marker id="sl-a-l" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,1.4 L7,4.5 L0,7.6" fill="none" stroke="var(--brass)" strokeWidth="1.6" strokeLinecap="round" />
            </marker>
          </defs>

          <g>
            {/* lane bands + labels */}
            {map.lanes.map((l, i) => (
              <g key={l}>
                <rect
                  x={0} y={PAD_T + i * LANE_H} width={W} height={LANE_H}
                  className={`sl-band${i % 2 ? ' alt' : ''}`}
                />
                <line x1={0} y1={PAD_T + i * LANE_H} x2={W} y2={PAD_T + i * LANE_H} className="sl-rule" />
                <foreignObject x={12} y={PAD_T + i * LANE_H + 12} width={GUTTER - 26} height={LANE_H - 24}>
                  <p className="sl-lane-l">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {l}
                  </p>
                </foreignObject>
              </g>
            ))}
            <line x1={GUTTER} y1={PAD_T} x2={GUTTER} y2={laneBottom} className="sl-rule strong" />
            <line x1={0} y1={laneBottom} x2={W} y2={laneBottom} className="sl-rule" />
            {hasLoop ? (
              <foreignObject x={12} y={laneBottom + 6} width={GUTTER - 26} height={channelH - 8}>
                <p className="sl-chan-l">Feedback</p>
              </foreignObject>
            ) : null}

            {/* edges under nodes */}
            {map.edges.map((e, i) => {
              const a = byId[e.from]
              const b = byId[e.to]
              if (!a || !b) return null
              const hot = activeId === e.from || activeId === e.to
              const marker =
                e.kind === 'escalate' ? 'url(#sl-a-e)'
                  : e.kind === 'loop' ? 'url(#sl-a-l)'
                  : e.kind === 'handoff' ? 'url(#sl-a-h)' : 'url(#sl-a)'
              const g = edgeGeom(a, b, e.kind, loopRow.get(`${e.from}|${e.to}`) ?? 0)
              /* labels only where they carry the argument, or on the selected
                 node — every edge labelled at once is unreadable */
              const labelled = e.kind === 'loop' || e.kind === 'escalate' || hot
              return (
                <g key={`${e.from}-${e.to}-${i}`}>
                  <path
                    d={g.d}
                    className={`sl-edge k-${e.kind}${hot ? ' hot' : ''}`}
                    fill="none"
                    markerEnd={marker}
                  />
                  {labelled && e.label ? (
                    <text
                      x={g.lx}
                      y={g.ly}
                      textAnchor={g.anchor}
                      className={`sl-edge-l k-${e.kind}${hot ? ' hot' : ''}`}
                    >
                      {e.label}
                    </text>
                  ) : null}
                </g>
              )
            })}

            {/* nodes */}
            {placed.map((p, i) => {
              const on = activeId === p.n.id
              return (
                <g
                  key={p.n.id}
                  className={`sl-node k-${p.n.kind}${on ? ' on' : ''}`}
                  transform={`translate(${p.x} ${p.y})`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={on}
                  aria-label={`${map.lanes[p.n.lane]}, step ${i + 1}: ${p.n.label}`}
                  onClick={() => onSelect(on ? null : p.n.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(on ? null : p.n.id)
                    }
                  }}
                >
                  <rect width={NW} height={NH} rx={9} />
                  <rect className="sl-kindbar" x={0} y={0} width={4} height={NH} rx={2} />
                  <foreignObject x={12} y={8} width={NW - 22} height={NH - 14}>
                    <p className="sl-node-l">{p.n.label}</p>
                  </foreignObject>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <ul className="sl-key no-print">
        <li><i className="k-stage" />Stage</li>
        <li><i className="k-decision" />Decision</li>
        <li><i className="k-evidence" />Evidence</li>
        <li><i className="k-control" />Control</li>
        <li><i className="k-escalation" />Escalation</li>
        <li><i className="k-outcome" />Outcome</li>
        <li className="sep"><b className="e-handoff" />Hand-off between lanes</li>
        <li><b className="e-escalate" />Escalation</li>
        <li><b className="e-loop" />Feedback, arriving late</li>
      </ul>
    </div>
  )
}
