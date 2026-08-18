/* Emit the deliverable's domain content as a plain script for the private prep
   board, so he revises from exactly the same material he will be showing.
   Run after any content change: node --experimental-strip-types scripts/export-domain.ts */

import { writeFileSync } from 'node:fs'
import { MAPS } from '../src/data/maps.ts'
import { TYPOLOGIES } from '../src/data/typologies.ts'
import { METRICS, TECHNIQUES } from '../src/data/frame.ts'
import { GOVERNANCE } from '../src/data/governance.ts'

const OUT = '/Users/hemanthvallamkonda/Downloads/general | claude/pleo-decisioning-studio/docs/assets/domain.js'

const payload = { maps: MAPS, typologies: TYPOLOGIES, metrics: METRICS, techniques: TECHNIQUES, governance: GOVERNANCE }

writeFileSync(
  OUT,
  `/* domain.js — generated from the deliverable's content tree.
   Do not edit by hand: run scripts/export-domain.ts in fraud-decisioning-frameworks. */
window.XS_DOMAIN = ${JSON.stringify(payload, null, 1)};
`,
  'utf8',
)
console.log(`wrote ${OUT}`)
console.log(`  ${MAPS.length} maps · ${TYPOLOGIES.length} typologies · ${METRICS.length} metrics · ${TECHNIQUES.length} techniques · ${GOVERNANCE.length} governance entries`)
