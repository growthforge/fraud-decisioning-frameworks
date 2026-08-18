import { useState } from 'react'
import { SectionHeader } from '../components/common/SectionHeader'
import { DetailDrawer } from '../components/common/DetailDrawer'
import { FRAME } from '../data/frame.ts'
import { SCHEMES, SCHEME_NOTE } from '../data/schemes.ts'
import { CONTINUITY, CONTINUITY_NOTE } from '../data/continuity.ts'

/* The four whose pressures pull hardest against each other — enough to make the
   point at a size that survives a screen share. */
const PRESENTER_PICK = ['FraudOps', 'Decision Intelligence', 'Product', 'AML / MLRO']

export function LayerPage({ presenting = false }: { presenting?: boolean }) {
  const [open, setOpen] = useState<string | null>(null)
  const a = FRAME.actors.find((x) => x.name === open)
  const PRESENTER_ACTORS = FRAME.actors.filter((x) =>
    PRESENTER_PICK.some((p) => x.name.toLowerCase().includes(p.toLowerCase().split(' / ')[0].toLowerCase())),
  ).slice(0, 4)

  return (
    <div className="wrap wide">
      {!presenting ? (
        <SectionHeader
          eyebrow="02 · Orientation"
          title="The decisioning layer"
          lede="Seven functions touch a fraud rule, and each is measured on something different. That is not dysfunction — it is the reason the rule gets challenged from every side before it ships. What matters is knowing which pressure is coming from where."
        />
      ) : (
        <p className="principle lead">
          Each of these is measured on something different. Knowing which pressure comes from where is
          most of the job.
        </p>
      )}

      <div className={`actor-grid${presenting ? ' on-stage' : ''}`}>
        {(presenting ? PRESENTER_ACTORS : FRAME.actors).map((x) => (
          <article key={x.name} className="actor">
            <h3>{x.name}</h3>
            <p className="actor-brings">{x.brings}</p>
            <p className="actor-wants"><span>Measured on</span>{x.wants}</p>
            {!presenting ? (
              <>
                <p className="actor-blind"><span>Cannot see</span>{x.blindSpot}</p>
                <button className="ty-more" onClick={() => setOpen(x.name)}>Where it pulls against decisioning</button>
              </>
            ) : null}
          </article>
        ))}
      </div>

      {!presenting ? (
        <>
          <section className="handoffs">
            <h3 className="sub">The hand-offs, and how each one breaks</h3>
            <ul>
              {FRAME.handoffs.map((h) => (
                <li key={`${h.from}-${h.to}`}>
                  <p className="ho-route"><b>{h.from}</b><i aria-hidden="true">→</i><b>{h.to}</b></p>
                  <p className="ho-what">{h.what}</p>
                  <p className="ho-fail">{h.failsHow}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="continuity">
            <h3 className="sub">The function, not the change</h3>
            <p className="tech-lede">{CONTINUITY_NOTE}</p>
            <ul>
              {CONTINUITY.map((x) => (
                <li key={x.risk}>
                  <h4>{x.risk}</h4>
                  <p className="ct-looks">{x.looksLike}</p>
                  <p className="ct-art"><span>What fixes it</span>{x.artefact}</p>
                  <p className="ct-test"><span>How to test whether it is fixed</span>{x.test}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="schemes">
            <h3 className="sub">The ceilings, and which side of the transaction they bind</h3>
            <p className="tech-lede">{SCHEME_NOTE}</p>
            <div className="scheme-grid">
              {SCHEMES.map((x) => (
                <article key={x.name} className={`scheme s-${x.side === 'issuer' ? 'iss' : 'acq'}`}>
                  <header>
                    <h4>{x.name}</h4>
                    <span>{x.side}</span>
                  </header>
                  <p className="scheme-n">{x.number}</p>
                  <p>{x.what}</p>
                  <p className="scheme-why">{x.why}</p>
                  <p className="scheme-src">{x.source}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="card fva">
            <h3 className="sub">Fraud and AML: the same inputs, almost none of the same outputs</h3>
            {FRAME.fraudVsAml.split('\n\n').map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </section>
        </>
      ) : null}

      <DetailDrawer open={Boolean(a)} onClose={() => setOpen(null)} eyebrow="Where it pulls" title={a?.name}>
        {a ? (
          <>
            <p className="detail-lede">{a.friction}</p>
            <h4 className="detail-h">What it uniquely knows</h4>
            <p>{a.brings}</p>
            <h4 className="detail-h">What it is measured on</h4>
            <p>{a.wants}</p>
            <h4 className="detail-h">What it cannot see from where it sits</h4>
            <p>{a.blindSpot}</p>
          </>
        ) : null}
      </DetailDrawer>
    </div>
  )
}
