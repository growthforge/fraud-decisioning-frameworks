import { ROUTES, NAV_GROUPS, buildHash, type RouteId } from '../../app/routes'

interface Props {
  current: RouteId
  open: boolean
  onNavigate: () => void
}

export function SideNav({ current, open, onNavigate }: Props) {
  return (
    <aside className={`sidenav no-print${open ? ' open' : ''}`} id="sidenav">
      <a className="brand" href={buildHash('overview')} onClick={onNavigate}>
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span className="brand-text">
          <strong>FRAUD DECISIONING</strong>
          <strong>FRAMEWORKS</strong>
          <em>Card &amp; payment risk · rule lifecycle</em>
        </span>
      </a>

      <nav className="nav" aria-label="Sections">
        {NAV_GROUPS.map((g) => (
          <div className="nav-group" key={g}>
            <p className="nav-glabel">{g}</p>
            {ROUTES.filter((r) => r.group === g).map((r) => (
              <a
                key={r.id}
                className={`nav-item${current === r.id ? ' on' : ''}`}
                href={buildHash(r.id)}
                aria-current={current === r.id ? 'page' : undefined}
                onClick={onNavigate}
              >
                <span className="nav-n">{r.n}</span>
                <span className="nav-l">{r.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>

      <p className="nav-foot">
        Built from the published role and public sources. No firm&rsquo;s rules, thresholds, systems or
        fraud performance appear here &mdash; none of it is public.
      </p>
    </aside>
  )
}
