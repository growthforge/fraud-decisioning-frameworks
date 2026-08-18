export type RouteId =
  | 'overview'
  | 'layer'
  | 'lifecycle'
  | 'typologies'
  | 'simulator'
  | 'spec'
  | 'change'
  | 'monitoring'
  | 'decisions'
  | 'closing'

export interface RouteDef {
  id: RouteId
  label: string
  short: string
  n: string
  group: string
}

/** The information architecture, in the order it should be read. */
export const NAV_GROUPS = ['Orientation', 'The lifecycle', 'The artefacts', 'After deployment', 'Close'] as const

export const ROUTES: RouteDef[] = [
  { id: 'overview',   label: 'Overview',              short: 'Overview',    n: '01', group: 'Orientation' },
  { id: 'layer',      label: 'The decisioning layer', short: 'The layer',   n: '02', group: 'Orientation' },
  { id: 'lifecycle',  label: 'The rule lifecycle',    short: 'Lifecycle',   n: '03', group: 'The lifecycle' },
  { id: 'typologies', label: 'Typology → rule map',   short: 'Typologies',  n: '04', group: 'The lifecycle' },
  { id: 'simulator',  label: 'The tuning simulator',  short: 'Simulator',   n: '05', group: 'The lifecycle' },
  { id: 'spec',       label: 'Rule specification',    short: 'Rule spec',   n: '06', group: 'The artefacts' },
  { id: 'change',     label: 'A worked rule change',  short: 'Worked change', n: '07', group: 'The artefacts' },
  { id: 'monitoring', label: 'Monitoring & decay',    short: 'Monitoring',  n: '08', group: 'After deployment' },
  { id: 'decisions',  label: 'Decision forms',        short: 'Decisions',   n: '09', group: 'After deployment' },
  { id: 'closing',    label: 'What this is built from', short: 'Closing',   n: '10', group: 'Close' },
]

export const ROUTE_IDS = ROUTES.map((r) => r.id)

export function isRouteId(v: string): v is RouteId {
  return (ROUTE_IDS as string[]).includes(v)
}

/** Hash routing: #/lifecycle — works on GitHub Pages with no server rewrite. */
export function parseHash(hash: string): { route: RouteId; presenter: boolean; scene: number } {
  const raw = hash.replace(/^#\/?/, '')
  const [path, query] = raw.split('?')
  const params = new URLSearchParams(query || '')
  const presenter = params.get('mode') === 'presenter'
  const scene = Math.max(0, Number(params.get('scene') || '0') || 0)
  const seg = (path || '').split('/')[0]
  return { route: isRouteId(seg) ? seg : 'overview', presenter, scene }
}

export function buildHash(route: RouteId, presenter = false, scene = 0): string {
  const q = presenter ? `?mode=presenter&scene=${scene}` : ''
  return `#/${route}${q}`
}
