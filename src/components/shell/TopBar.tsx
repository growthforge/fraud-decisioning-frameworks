import { Presentation, BookOpen, Menu } from 'lucide-react'

interface Props {
  onPresenter: () => void
  onSources: () => void
  onMenu: () => void
  title: string
}

export function TopBar({ onPresenter, onSources, onMenu, title }: Props) {
  return (
    <header className="topbar no-print">
      <button className="menu-btn" onClick={onMenu} aria-label="Open navigation">
        <Menu size={18} aria-hidden="true" />
      </button>
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-right">
        <span className="micro-label" title="This site is built by a candidate from public information">
          CANDIDATE-BUILT · PUBLIC / JD-BASED VIEW
        </span>
        <button className="tb-btn" onClick={onSources}>
          <BookOpen size={15} aria-hidden="true" /> Sources
        </button>
        <button className="tb-btn solid" onClick={onPresenter}>
          <Presentation size={15} aria-hidden="true" /> Presenter
        </button>
      </div>
    </header>
  )
}
