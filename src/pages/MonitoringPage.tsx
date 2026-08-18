import { SectionHeader } from '../components/common/SectionHeader'
import { ARTEFACTS } from '../data/artefacts.ts'
import { METRICS } from '../data/frame.ts'

export function MonitoringPage({ presenting = false }: { presenting?: boolean }) {
  return (
    <div className="wrap wide">
      {!presenting ? (
        <SectionHeader
          eyebrow="08 · After deployment"
          title="Monitoring and decay"
          lede="A rule is not finished when it ships. It is finished when someone can say what it is now contributing — and rules degrade, because the world moves on both sides at once. Fraudsters adapt and customers change, which is why fraud decays faster than credit."
        />
      ) : null}

      <section>
        <h3 className="sub">What a rule owner actually watches</h3>
        <div className="mon-grid">
          {ARTEFACTS.monitoring.map((m) => (
            <article key={m.signal} className="mon">
              <h4>{m.signal}</h4>
              <p className="mon-cadence">{m.cadence}</p>
              <p>{m.what}</p>
              <p className="mon-trigger"><span>When it means act</span>{m.trigger}</p>
              <p className="mon-trap"><span>How it misleads</span>{m.trap}</p>
            </article>
          ))}
        </div>
      </section>

      {!presenting ? (
        <>
          <section className="card decay">
            <h3 className="sub">How you know a rule has gone stale</h3>
            {ARTEFACTS.decay.split('\n\n').map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </section>

          <section className="metrics">
            <h3 className="sub">The metrics, and the limitation of each</h3>
            <p className="tech-lede">
              Naming a metric is easy. Naming its limitation is the tell. Every one of these can be made to
              say something flattering by choosing the denominator, the window or the segment.
            </p>
            <div className="met-grid">
              {METRICS.map((m) => (
                <article key={m.name} className="met">
                  <h4>{m.name}</h4>
                  <p>{m.means}</p>
                  <p className="met-lim"><span>Limitation</span>{m.limitation}</p>
                  <p className="met-use"><span>Use it when</span>{m.useWhen}</p>
                  <p className="met-refuse"><span>Refuse it when</span>{m.refuseWhen}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
