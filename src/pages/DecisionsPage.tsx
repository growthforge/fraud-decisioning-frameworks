import { SectionHeader } from '../components/common/SectionHeader'
import { ARTEFACTS } from '../data/artefacts.ts'

export function DecisionsPage({ presenting = false }: { presenting?: boolean }) {
  return (
    <div className="wrap wide">
      {!presenting ? (
        <SectionHeader
          eyebrow="09 · After deployment"
          title="Decision forms"
          lede="A rule review has eight possible outcomes and only one of them is “tighten it”. A team whose reviews always tighten is not reviewing, it is ratcheting — and an estate that only ever grows is itself a control failure, because eventually nobody can say what any individual rule contributes."
        />
      ) : (
        <p className="principle lead">
          A rule review has eight outcomes and only one of them is “tighten it”. The distribution is the point.
        </p>
      )}

      <div className="df-grid">
        {ARTEFACTS.decisionForms.map((d) => (
          <article key={d.form} className="df">
            <h3>{d.form}</h3>
            <p className="df-when">{d.when}</p>
            {!presenting ? (
              <>
                <p className="df-ev"><span>You must be able to show</span>{d.evidence}</p>
                <p className="df-risk"><span>How it goes wrong</span>{d.risk}</p>
                <p className="df-eg"><span>For example</span>{d.example}</p>
              </>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
