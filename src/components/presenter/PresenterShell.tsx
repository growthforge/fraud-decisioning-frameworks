import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PRESENTER_SCENES } from '../../app/presenter'

interface Props {
  scene: number
  onPrev: () => void
  onNext: () => void
  onExit: () => void
  showHint: boolean
  children: React.ReactNode
}

export function PresenterShell({ scene, onPrev, onNext, onExit, showHint, children }: Props) {
  const s = PRESENTER_SCENES[scene]
  const pct = ((scene + 1) / PRESENTER_SCENES.length) * 100

  return (
    <div className="pres">
      <div className="pres-bar no-print">
        <div className="pres-brand" aria-hidden="true">
          <span className="pres-mark"><i /><i /><i /></span>
          <span className="pres-brand-t">
            <strong>FRAUD DECISIONING FRAMEWORKS</strong>
            <em>Card &amp; payment risk · rule lifecycle</em>
          </span>
        </div>

        <div className="pres-meta">
          <span className="pres-n mono">
            {String(scene + 1).padStart(2, '0')} / {String(PRESENTER_SCENES.length).padStart(2, '0')}
          </span>
          {showHint ? <span className="pres-cue">press → to continue</span> : null}
          <div>
            <strong>{s.title}</strong>
            <em>{s.note}</em>
          </div>
        </div>
        <div className="pres-ctrl">
          <button className="icon-btn" onClick={onPrev} aria-label="Previous scene" disabled={scene === 0}>
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <button
            className="icon-btn"
            onClick={onNext}
            aria-label="Next scene"
            disabled={scene >= PRESENTER_SCENES.length - 1}
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
          <button className="tb-btn" onClick={onExit}>
            <X size={15} aria-hidden="true" /> Exit
          </button>
        </div>
        <div className="pres-progress" aria-hidden="true">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      <main className="pres-stage" id="main">
        <div className="pres-frame">
          <p className="pres-basis">
            <span>Built from</span>
            {s.basis}
          </p>
          {children}
        </div>
      </main>

    </div>
  )
}
