import { Presentation } from 'lucide-react'
import { FRAME } from '../data/frame.ts'

export function OverviewPage({ presenting = false, onPresenter }: { presenting?: boolean; onPresenter?: () => void }) {
  return (
    <div className="wrap">
      <section className="ov-hero">
        <p className="micro-label solo">CANDIDATE-BUILT · PUBLIC / JD-BASED VIEW</p>
        <h2 className="ov-id">
          Fraud decisioning<br />frameworks
        </h2>
        <p className="ov-sub">Card &amp; payment risk · the rule lifecycle</p>
        <p className="ov-thesis">{FRAME.thesis}</p>
      </section>

      {!presenting ? (
        <>
          <p className="ov-lede">{FRAME.overview}</p>

          <div className="ov-two">
            <div className="card">
              <h3 className="sub">What this is built from</h3>
              <ul className="rule-list">
                {FRAME.builtFrom.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
            <div className="card">
              <h3 className="sub">What it deliberately does not do</h3>
              <ul className="rule-list neg">
                {FRAME.notDoing.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </div>

          {onPresenter ? (
            <div className="ov-cta no-print">
              <button className="tb-btn solid big" onClick={onPresenter}>
                <Presentation size={17} aria-hidden="true" /> Walk through it
              </button>
              <span>Eight screens, about four minutes. Press <kbd>P</kbd> at any time.</span>
            </div>
          ) : null}
        </>
      ) : (
        <div className="ov-two pres-two">
          <div className="card">
            <h3 className="sub">Built from</h3>
            <ul className="rule-list">
              {FRAME.builtFrom.slice(0, 4).map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="card">
            <h3 className="sub">Deliberately not</h3>
            <ul className="rule-list neg">
              {FRAME.notDoing.slice(0, 4).map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
