import { ExternalLink } from 'lucide-react'
import { SOURCES, SOURCE_NOTE, SOURCES_CHECKED } from '../../data/sources'
import { DetailDrawer } from './DetailDrawer'

export function SourceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <DetailDrawer open={open} onClose={onClose} eyebrow="Provenance" title="Sources" wide>
      <p className="detail-lede">{SOURCE_NOTE}</p>
      <p className="src-checked">{SOURCES_CHECKED}</p>
      <ul className="src-list">
        {SOURCES.map((s) => (
          <li key={s.title}>
            <div className="src-t">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer noopener">
                  {s.title} <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <span>{s.title}</span>
              )}
            </div>
            <p className="src-s">{s.supports}</p>
          </li>
        ))}
      </ul>
    </DetailDrawer>
  )
}
