import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../lib/motion'

export function Loader({ onDone }: { onDone: () => void }) {
  const reduced = prefersReducedMotion()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const hold = reduced ? 120 : 760
    const a = window.setTimeout(() => setLeaving(true), hold)
    const b = window.setTimeout(onDone, hold + (reduced ? 60 : 260))
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [onDone, reduced])

  return (
    <div className={`ldr${leaving ? ' out' : ''}`} role="status" aria-live="polite">
      <div className="ldr-in">
        <div className="ldr-t">
          <span>FRAUD DECISIONING</span>
          <strong>FRAMEWORKS</strong>
        </div>
        <div className="ldr-rule" aria-hidden="true"><i /></div>
        <div className="ldr-c">Card &amp; payment risk · the rule lifecycle</div>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
