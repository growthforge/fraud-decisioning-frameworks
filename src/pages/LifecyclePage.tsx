import { useEffect, useState } from 'react'
import { SectionHeader } from '../components/common/SectionHeader'
import { SwimlaneMap } from '../components/maps/SwimlaneMap'
import { NodeDetail } from '../components/maps/NodeDetail'
import { MAPS } from '../data/maps.ts'
import { TECHNIQUES } from '../data/frame.ts'

export function LifecyclePage({ focus, presenting = false }: { focus?: string; presenting?: boolean }) {
  const initial = MAPS.findIndex((m) => m.id === focus)
  const [tab, setTab] = useState(initial >= 0 ? initial : 0)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const i = MAPS.findIndex((m) => m.id === focus)
    if (i >= 0) { setTab(i); setActive(null) }
  }, [focus])

  const map = MAPS[tab]

  if (presenting) {
    return (
      <div className="wrap wide">
        <p className="principle lead">{map.principle}</p>
        <SwimlaneMap map={map} activeId={null} onSelect={() => {}} fixed />
        {map.lanes.length <= 2 ? <p className="legend-line">{map.legend}</p> : null}
      </div>
    )
  }

  return (
    <div className="wrap wide">
      <SectionHeader
        eyebrow="03 · The lifecycle"
        title="The rule lifecycle"
        lede="A fraud rule is a controlled change to a system that decides whether a real company can spend money. These two views run the same seven stages: the first asks who holds each one, the second asks what each one costs."
      />

      <div className="tabs" role="tablist" aria-label="Views of the lifecycle">
        {MAPS.map((m, i) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={tab === i}
            className={tab === i ? 'on' : ''}
            onClick={() => { setTab(i); setActive(null) }}
          >
            {m.tab}
          </button>
        ))}
      </div>

      <h3 className="map-title">{map.title}</h3>
      <p className="map-sub">{map.subtitle}</p>
      <p className="principle">{map.principle}</p>

      <SwimlaneMap map={map} activeId={active} onSelect={setActive} />
      <p className="hint no-print">Select any step for what happens there, what to ask, and the way it goes wrong.</p>

      <NodeDetail map={map} activeId={active} onClose={() => setActive(null)} />

      <section className="tech">
        <h3 className="sub">The techniques these stages depend on</h3>
        <p className="tech-lede">
          Each of these has a follow-up question attached to it. The follow-up is the tell — it is what
          separates someone who has run the technique from someone who has read about it.
        </p>
        <div className="tech-grid">
          {TECHNIQUES.map((t) => (
            <article key={t.name} className="tech-card">
              <h4>{t.name}</h4>
              <p>{t.what}</p>
              <p className="tech-why">{t.whyItMatters}</p>
              <p className="tech-ask"><span>The question it invites</span>{t.askedAbout}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
