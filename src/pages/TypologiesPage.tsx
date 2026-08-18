import { useMemo, useState } from 'react'
import { SectionHeader } from '../components/common/SectionHeader'
import { DetailDrawer } from '../components/common/DetailDrawer'
import { Tag } from '../components/common/Tag'
import { TYPOLOGIES, TYPOLOGY_INTRO } from '../data/typologies.ts'
import type { Typology } from '../data/types.ts'

const FAMILIES = ['all', 'card fraud', 'account takeover', 'first-party', 'internal misuse', 'merchant', 'AML-adjacent'] as const

const LAYER_TONE: Record<string, 'bad' | 'warn' | 'info' | 'grey' | 'brass'> = {
  'real-time decline': 'bad',
  'real-time step-up': 'warn',
  'near-real-time alert': 'info',
  'batch / periodic review': 'grey',
  onboarding: 'brass',
}

export function TypologiesPage({ presenting = false }: { presenting?: boolean }) {
  const [family, setFamily] = useState<(typeof FAMILIES)[number]>('all')
  const [open, setOpen] = useState<string | null>(null)

  const list = useMemo(
    () => (family === 'all' ? TYPOLOGIES : TYPOLOGIES.filter((t) => t.family === family)),
    [family],
  )
  const t = TYPOLOGIES.find((x) => x.id === open)

  if (presenting) {
    const show = TYPOLOGIES.slice(0, 6)
    return (
      <div className="wrap wide">
        <p className="principle lead">
          A signal without its innocent explanation is pattern-matching, not judgement.
        </p>
        <div className="ty-pres">
          {show.map((x) => (
            <article key={x.id} className="ty-pres-card">
              <h4>{x.name}</h4>
              <p className="ty-sig">{x.oneLine}</p>
              <p className="ty-fp"><span>Also catches</span>{x.falsePositive}</p>
            </article>
          ))}
        </div>
        <p className="legend-line">
          Fourteen typologies in the full view. Every one of them is paired with the legitimate behaviour
          that trips the same rule — and for a spend-management product, that behaviour is very often the
          product working exactly as intended.
        </p>
      </div>
    )
  }

  return (
    <div className="wrap wide">
      <SectionHeader
        eyebrow="04 · Reference"
        title="Typology → rule map"
        lede={TYPOLOGY_INTRO}
      />

      <div className="filters no-print" role="group" aria-label="Filter by family">
        {FAMILIES.map((f) => (
          <button key={f} className={family === f ? 'on' : ''} onClick={() => setFamily(f)} aria-pressed={family === f}>
            {f === 'all' ? `All ${TYPOLOGIES.length}` : f}
          </button>
        ))}
      </div>

      <div className="ty-grid">
        {list.map((x) => (
          <article key={x.id} className="ty-card">
            <header>
              <h3>{x.name}</h3>
              <div className="ty-tags">
                <Tag tone="grey">{x.family}</Tag>
                <Tag tone={LAYER_TONE[x.layer] ?? 'grey'}>{x.layer}</Tag>
              </div>
            </header>
            <p className="ty-one">{x.oneLine}</p>
            <div className="ty-two">
              <div>
                <p className="ty-l">The rule that catches it</p>
                <p>{x.ruleShape}</p>
              </div>
              <div className="ty-fp-block">
                <p className="ty-l">And the legitimate behaviour it also catches</p>
                <p>{x.falsePositive}</p>
              </div>
            </div>
            <button className="ty-more" onClick={() => setOpen(x.id)}>
              Signals, first action and how you would judge it
            </button>
          </article>
        ))}
      </div>

      <DetailDrawer
        open={Boolean(t)}
        onClose={() => setOpen(null)}
        eyebrow={t ? `${t.family} · first action: ${t.action}` : undefined}
        title={t?.name}
        wide
      >
        {t ? <TypologyDetail t={t} /> : null}
      </DetailDrawer>
    </div>
  )
}

function TypologyDetail({ t }: { t: Typology }) {
  return (
    <>
      <p className="detail-lede">{t.how}</p>
      <h4 className="detail-h">What you can observe</h4>
      <ul className="detail-list">{t.signals.map((s) => <li key={s}>{s}</li>)}</ul>
      <h4 className="detail-h">The shape of the rule</h4>
      <p>{t.ruleShape}</p>
      <h4 className="detail-h">Where the control belongs</h4>
      <p><strong>{t.layer}</strong> — first action: <strong>{t.action}</strong>.</p>
      <div className="failure">
        <p className="failure-l">The legitimate behaviour that trips the same rule</p>
        <p>{t.falsePositive}</p>
        <p className="failure-why">{t.fpWhy}</p>
      </div>
      <h4 className="detail-h">Where it attaches to the product</h4>
      <p>{t.productHook}</p>
      <h4 className="detail-h">How you would judge the rule</h4>
      <p>{t.metric}</p>
    </>
  )
}
