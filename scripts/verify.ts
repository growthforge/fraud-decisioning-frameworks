/* Geometry and content assertions. Run before build: `npm run verify`.
   Screenshots scale and will hide an unreadable diagram, so the geometry is checked
   arithmetically here rather than judged by eye. */

import { MAPS } from '../src/data/maps.ts'
import { TYPOLOGIES } from '../src/data/typologies.ts'
import type { LaneMap } from '../src/data/types.ts'

/* must match the constants in src/components/maps/SwimlaneMap.tsx */
const GUTTER = 118
const COL_W = 158
const LANE_H = 100
const NW = 134
const NH = 62
const PAD_T = 12
const PAD_B = 16
const PAD_R = 26
const CHANNEL_ROW = 17

/* the narrowest container the diagram must stay legible in: the presenter frame at 1280 */
const PRESENTER_FRAME_W = 1180
/* the smallest effective label size we will accept, per the acceptance criteria */
const MIN_EFFECTIVE_PX = 12
/* the CSS font-size of .sl-node-l in the SVG's own coordinate space */
const NODE_LABEL_PX = 14
const LABEL_MAX_CHARS = 26

let failures = 0
let checks = 0

function ok(cond: boolean, msg: string) {
  checks++
  if (!cond) {
    failures++
    console.error(`  ✗ ${msg}`)
  }
}

function checkMap(m: LaneMap) {
  console.log(`\n▸ map "${m.id}" — ${m.lanes.length} lanes, ${m.nodes.length} nodes, ${m.edges.length} edges`)

  const ids = new Set<string>()
  for (const n of m.nodes) {
    ok(!ids.has(n.id), `duplicate node id "${n.id}"`)
    ids.add(n.id)
    ok(
      n.label.length <= LABEL_MAX_CHARS,
      `node "${n.id}" label is ${n.label.length} chars (max ${LABEL_MAX_CHARS}): "${n.label}"`,
    )
    ok(n.lane >= 0 && n.lane < m.lanes.length, `node "${n.id}" lane ${n.lane} out of range`)
    ok(Number.isInteger(n.col) && n.col >= 0, `node "${n.id}" col ${n.col} invalid`)
    ok(n.detail.trim().length > 120, `node "${n.id}" detail is too thin (${n.detail.trim().length} chars)`)
    ok(n.asks.length >= 2, `node "${n.id}" has fewer than 2 asks`)
    ok(n.failure.trim().length > 40, `node "${n.id}" failure mode is too thin`)
  }

  const cols = Math.max(...m.nodes.map((n) => n.col)) + 1
  for (let c = 0; c < cols; c++) {
    ok(m.nodes.some((n) => n.col === c), `column ${c} is empty — the grid would show a gap`)
  }

  const touched = new Set<string>()
  for (const e of m.edges) {
    ok(ids.has(e.from), `edge from unknown node "${e.from}"`)
    ok(ids.has(e.to), `edge to unknown node "${e.to}"`)
    touched.add(e.from)
    touched.add(e.to)
    const a = m.nodes.find((n) => n.id === e.from)
    const b = m.nodes.find((n) => n.id === e.to)
    if (a && b) {
      if (b.col < a.col) {
        ok(e.kind === 'loop', `backward edge ${e.from}→${e.to} must use kind "loop", got "${e.kind}"`)
      }
      if (a.lane !== b.lane && b.col >= a.col) {
        ok(
          e.kind === 'handoff' || e.kind === 'escalate',
          `cross-lane edge ${e.from}→${e.to} should be "handoff" or "escalate", got "${e.kind}"`,
        )
      }
      ok(!(a.id === b.id), `self-edge on "${a.id}"`)
    }
  }
  for (const n of m.nodes) ok(touched.has(n.id), `node "${n.id}" is orphaned — no edge touches it`)

  /* the arithmetic that screenshots cannot be trusted for */
  const W = GUTTER + cols * COL_W + PAD_R
  const nLoops = m.edges.filter((e) => e.kind === 'loop').length
  const H = PAD_T + m.lanes.length * LANE_H + (nLoops ? CHANNEL_ROW * nLoops + 14 : 0) + PAD_B
  const scale = Math.min(1, PRESENTER_FRAME_W / W)
  const effective = NODE_LABEL_PX * scale
  console.log(
    `  geometry ${cols}×${m.lanes.length} → ${W}×${H}px, scale ${scale.toFixed(3)} at ${PRESENTER_FRAME_W}px, label ${effective.toFixed(1)}px`,
  )
  ok(
    effective >= MIN_EFFECTIVE_PX,
    `label renders at ${effective.toFixed(1)}px at the presentation width, below the ${MIN_EFFECTIVE_PX}px floor. Reduce columns or widen the frame.`,
  )
  ok(H <= 620, `diagram is ${H}px tall — too tall to sit in a presenter scene without scrolling`)
}

console.log('Fraud Decisioning Frameworks — content and geometry assertions')

for (const m of MAPS) checkMap(m)

console.log(`\n▸ typologies — ${TYPOLOGIES.length} records`)
const tids = new Set<string>()
for (const t of TYPOLOGIES) {
  ok(!tids.has(t.id), `duplicate typology id "${t.id}"`)
  tids.add(t.id)
  ok(t.falsePositive.trim().length > 60, `typology "${t.id}" false positive is too thin — it is the point of the page`)
  ok(t.signals.length >= 4, `typology "${t.id}" has fewer than 4 signals`)
  ok(t.ruleShape.trim().length > 200, `typology "${t.id}" rule shape is too thin`)
  ok(!/\b\d+\s*%|\bmore than \d|\bover \d{2,}/i.test(t.ruleShape),
     `typology "${t.id}" rule shape appears to state a numeric threshold — thresholds are portfolio-specific and must not be given`)
}
ok(TYPOLOGIES.length >= 14, `expected at least 14 typologies, got ${TYPOLOGIES.length}`)

console.log(`\n${failures === 0 ? '✓ PASS' : '✗ FAIL'} — ${checks - failures}/${checks} assertions passed`)
if (failures > 0) process.exit(1)

/* ── class-name collisions ────────────────────────────────────────────────
   Tailwind ships utilities under bare English words. A component class called
   `fixed` silently becomes `position: fixed`, and a modifier called `pres`
   inherits the presenter shell's full-viewport flex column. Both happened in
   this build and neither is visible in a screenshot, so it is checked here. */
const RESERVED = new Set([
  'fixed', 'absolute', 'relative', 'static', 'sticky', 'block', 'inline', 'flex',
  'grid', 'hidden', 'visible', 'table', 'contents', 'container', 'isolate',
  'truncate', 'italic', 'underline', 'capitalize', 'uppercase', 'lowercase',
  'border', 'rounded', 'shadow', 'transform', 'transition', 'sr-only', 'group',
  'peer', 'dark', 'light', 'pres', 'wrap', 'card', 'app', 'col',
])
/* names this codebase deliberately owns, defined in its own stylesheets */
const OWNED = new Set([
  'wrap', 'card', 'app', 'col',
  /* the presenter shell defines .pres itself, and sr-only is Tailwind's — both intended */
  'pres', 'sr-only',
])

const { readdirSync, readFileSync, statSync } = await import('node:fs')
const { join } = await import('node:path')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : []
  })
}

console.log('\n▸ class-name collisions')
const collisions: string[] = []
for (const file of walk('src')) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    const literal = (m[1] ?? m[2] ?? '')
      .replace(/\$\{[^}]*\?\s*'([^']*)'\s*:\s*'([^']*)'\}/g, ' $1 $2 ')
      .replace(/\$\{[^}]*\}/g, ' ')
    for (const cls of literal.split(/\s+/).filter(Boolean)) {
      if (RESERVED.has(cls) && !OWNED.has(cls)) {
        collisions.push(`${file}: "${cls}" collides with a Tailwind utility or the presenter shell`)
      }
    }
  }
}
collisions.forEach((c) => console.error(`  ✗ ${c}`))
ok(collisions.length === 0, `${collisions.length} reserved class name(s) used as component classes`)

console.log(`\n${failures === 0 ? '✓ PASS' : '✗ FAIL'} — ${checks - failures}/${checks} assertions passed (final)`)
if (failures > 0) process.exit(1)
