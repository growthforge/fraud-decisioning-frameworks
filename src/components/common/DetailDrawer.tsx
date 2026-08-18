import { useRef } from 'react'
import { X } from 'lucide-react'
import { useFocusTrap } from '../../lib/accessibility'

interface Props {
  open: boolean
  onClose: () => void
  eyebrow?: string
  title?: string
  children?: React.ReactNode
  wide?: boolean
}

export function DetailDrawer({ open, onClose, eyebrow, title, children, wide }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)

  return (
    <>
      <div
        className={`scrim${open ? ' on' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`drawer${open ? ' on' : ''}${wide ? ' wide' : ''}`}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Detail'}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="drawer-head">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h3 className="drawer-title">{title}</h3> : null}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close detail">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </>
  )
}
