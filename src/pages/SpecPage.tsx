import { SectionHeader } from '../components/common/SectionHeader'
import { ARTEFACTS } from '../data/artefacts.ts'

export function SpecPage({ presenting = false }: { presenting?: boolean }) {
  const { ruleSpec, specFields } = ARTEFACTS
  return (
    <div className="wrap">
      {!presenting ? (
        <SectionHeader eyebrow="06 · The artefact" title="Rule specification" lede={ruleSpec.intro} />
      ) : null}

      <p className="synthetic-note">
        SYNTHETIC · ILLUSTRATIVE — a worked specification for an invented rule. No real rule, threshold or
        system is described.
      </p>

      <div className="spec">
        {ruleSpec.worked.map((f) => (
          <div key={f.field} className="spec-row">
            <p className="spec-f">{f.field}</p>
            <div className="spec-v">
              <p>{f.value}</p>
              <p className="spec-why">{f.why}</p>
            </div>
          </div>
        ))}
      </div>

      {!presenting ? (
        <section className="template">
          <h3 className="sub">The blank template</h3>
          <p className="tech-lede">
            The specification is the control, not the logic. Logic that lives only in the tool can be read
            but not questioned — you can see what fires and not why the number is the number it is.
          </p>
          <ol className="template-list">
            {specFields.map((f) => <li key={f}>{f}</li>)}
          </ol>
        </section>
      ) : null}
    </div>
  )
}
