import { useState } from 'react'
import { SectionHeader } from '../components/common/SectionHeader'
import { WORKED } from '../data/workedChange.ts'

export function ChangePage({ presenting = false }: { presenting?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)

  if (presenting) {
    return (
      <div className="wrap">
        <p className="principle lead">{WORKED.title}</p>
        <div className="card wrong">
          <h3 className="sub">What the process missed</h3>
          {WORKED.whatWentWrong.split('\n\n').map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </div>
        <p className="synthetic-note">{WORKED.syntheticNotice}</p>
      </div>
    )
  }

  return (
    <div className="wrap">
      <SectionHeader eyebrow="07 · Worked example" title={WORKED.title} lede={WORKED.standfirst} />
      <p className="synthetic-note big">{WORKED.syntheticNotice}</p>

      <ol className="steps">
        {WORKED.steps.map((s, i) => (
          <li key={s.n} className={open === i ? 'on' : ''}>
            <button className="step-head" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span className="step-n mono">{String(s.n).padStart(2, '0')}</span>
              <span className="step-t">
                <b>{s.title}</b>
                <em>{s.stage}</em>
              </span>
              <span className="step-x" aria-hidden="true">{open === i ? '−' : '+'}</span>
            </button>
            {open === i ? (
              <div className="step-body">
                <p>{s.body}</p>
                {s.figures.length ? (
                  <dl className="figs">
                    {s.figures.map((f) => (
                      <div key={f.k}>
                        <dt>{f.k}</dt>
                        <dd>{f.v}</dd>
                        <p>{f.note}</p>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <p className="step-art"><span>Artefact</span>{s.artefact}</p>
                <p className="step-judge"><span>The call, and what was rejected</span>{s.judgement}</p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <section className="card wrong">
        <h3 className="sub">What the process missed</h3>
        {WORKED.whatWentWrong.split('\n\n').map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
      </section>

      <p className="closing-note">{WORKED.closing}</p>
    </div>
  )
}
