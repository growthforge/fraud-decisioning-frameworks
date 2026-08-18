/* Release gate: nothing private, nothing rehearsal-shaped, and no claim about any
   firm's internals may reach the published site.

   The employer may be named ONLY as provenance — "built from their own published
   legal documents" — because citing a company's own filings is the opposite of
   guessing at its internals. It may never appear attached to a rule, a threshold,
   a system, a vendor or a fraud figure. */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const HARD: [string, RegExp][] = [
  ['candidate identity', /Hemanth|Vallamkonda|vallamkondahemanth|07553\s?909828/i],
  ['the decisioning vendor (prep board only)', /\bTaktile\b/i],
  ['the interviewer', /Sylvestre|Thenor/i],
  ['unresolved supply markers', /\[\[SUPPLY/],
  ['CV employers', /\bAirTM\b|Bnk\s?To\s?The\s?Future|Lax Capital|Mtest Labs/i],
  ['CV metrics', /first-time pass rate|280\+\s|400\+ higher-risk|150 case backlog/i],
  ['named individuals at the firm', /Hannah Becher|Jeppe Rindom|Niccolo Perra/i],
  /* `\[\[` is omitted deliberately — it matches minified React internals (`new Map([[`) */
  ['rehearsal vocabulary', /story bank|mark rehearsed|natural example — do not memorise|my CV\b/i],
]

/* the employer, used in a CLAIMING construction rather than as provenance */
const CLAIMING =
  /Pleo(?:'s|’s)?\s+(?:actual|internal|current|fraud rate|loss|rules?|thresholds?|platform|vendors?|systems?|team|decline rate|alert|approval route|SLA)/i

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) return walk(p)
    return /\.(js|css|html|ts|tsx|json|svg)$/.test(p) ? [p] : []
  })
}

let bad = 0
const files = [...walk('src'), ...walk('docs')]
for (const f of files) {
  const txt = readFileSync(f, 'utf8')
  for (const [label, pat] of HARD) {
    const m = txt.match(pat)
    if (m) {
      bad++
      const i = txt.indexOf(m[0])
      console.error(`  ✗ ${label} in ${f}\n      …${txt.slice(Math.max(0, i - 70), i + 70).replace(/\n/g, ' ')}…`)
    }
  }
  const c = txt.match(CLAIMING)
  if (c) {
    bad++
    const i = txt.indexOf(c[0])
    console.error(`  ✗ employer named in a CLAIMING construction in ${f}\n      …${txt.slice(Math.max(0, i - 90), i + 90).replace(/\n/g, ' ')}…`)
  }
}

console.log(
  bad === 0
    ? `✓ CONTAMINATION GATE CLEAN — ${files.length} files scanned. The employer appears only as provenance.`
    : `✗ CONTAMINATION GATE FAILED — ${bad} finding(s)`,
)
if (bad > 0) process.exit(1)
