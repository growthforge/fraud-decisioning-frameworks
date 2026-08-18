import { SectionHeader } from '../components/common/SectionHeader'
import { FRAME } from '../data/frame.ts'

export function ClosingPage({ presenting = false }: { presenting?: boolean }) {
  return (
    <div className="wrap">
      {!presenting ? (
        <SectionHeader eyebrow="10 · Close" title="What this is built from" />
      ) : (
        <p className="principle lead">The gaps are the discipline, not the omission.</p>
      )}

      <div className="ov-two">
        <div className="card">
          <h3 className="sub">Built from</h3>
          <ul className="rule-list">{FRAME.builtFrom.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
        <div className="card">
          <h3 className="sub">Deliberately not</h3>
          <ul className="rule-list neg">{FRAME.notDoing.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
      </div>

      {!presenting ? (
        <section className="card closing-body">
          {FRAME.closing.split('\n\n').map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </section>
      ) : null}
    </div>
  )
}
