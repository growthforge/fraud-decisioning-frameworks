import { useCallback, useEffect, useState } from 'react'
import { ROUTES, buildHash, parseHash, type RouteId } from './app/routes'
import { PRESENTER_SCENES } from './app/presenter'
import { isTypingTarget } from './lib/keyboard'
import { Loader } from './components/common/Loader'
import { TopBar } from './components/shell/TopBar'
import { SideNav } from './components/shell/SideNav'
import { SourceDrawer } from './components/common/SourceDrawer'
import { PresenterShell } from './components/presenter/PresenterShell'
import { OverviewPage } from './pages/OverviewPage'
import { LayerPage } from './pages/LayerPage'
import { LifecyclePage } from './pages/LifecyclePage'
import { TypologiesPage } from './pages/TypologiesPage'
import { SimulatorPage } from './pages/SimulatorPage'
import { SpecPage } from './pages/SpecPage'
import { ChangePage } from './pages/ChangePage'
import { MonitoringPage } from './pages/MonitoringPage'
import { DecisionsPage } from './pages/DecisionsPage'
import { ClosingPage } from './pages/ClosingPage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState(() => parseHash(window.location.hash))
  const [sources, setSources] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [moved, setMoved] = useState(false)

  useEffect(() => {
    const onHash = () => {
      setState(parseHash(window.location.hash))
      setNavOpen(false)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.replace(buildHash('overview'))
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((route: RouteId, presenter = false, scene = 0) => {
    window.location.hash = buildHash(route, presenter, scene)
  }, [])

  const enterPresenter = useCallback(() => {
    setMoved(false)
    setSources(false)
    const s = PRESENTER_SCENES[0]
    go(s.route, true, 0)
  }, [go])

  const exitPresenter = useCallback(() => {
    go(state.route, false)
  }, [go, state.route])

  const setScene = useCallback(
    (n: number) => {
      const i = Math.max(0, Math.min(n, PRESENTER_SCENES.length - 1))
      setMoved(true)
      go(PRESENTER_SCENES[i].route, true, i)
    },
    [go],
  )

  /* global keyboard — never hijacked while the user is typing in a field */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      const k = e.key
      if (k === 'Escape') {
        if (sources) setSources(false)
        return
      }
      if (k === 'p' || k === 'P') {
        if (!state.presenter) { e.preventDefault(); enterPresenter() }
        return
      }
      if (k === 'o' || k === 'O') {
        e.preventDefault()
        go(state.presenter ? PRESENTER_SCENES[state.scene].route : state.route, false)
        return
      }
      if (!state.presenter) return
      if (k === 'ArrowRight' || k === ' ' || k === 'Spacebar') { e.preventDefault(); setScene(state.scene + 1) }
      else if (k === 'ArrowLeft') { e.preventDefault(); setScene(state.scene - 1) }
      else if (k === 'Home') { e.preventDefault(); setScene(0) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, sources, enterPresenter, setScene, go])

  const sceneIdx = Math.min(state.scene, PRESENTER_SCENES.length - 1)
  const scene = state.presenter ? PRESENTER_SCENES[sceneIdx] : null
  const route = state.presenter && scene ? scene.route : state.route
  const focus = scene?.focus
  const presenting = state.presenter

  const page = (() => {
    switch (route) {
      case 'layer':      return <LayerPage presenting={presenting} />
      case 'lifecycle':  return <LifecyclePage focus={focus} presenting={presenting} />
      case 'typologies': return <TypologiesPage presenting={presenting} />
      case 'simulator':  return <SimulatorPage presenting={presenting} />
      case 'spec':       return <SpecPage presenting={presenting} />
      case 'change':     return <ChangePage presenting={presenting} />
      case 'monitoring': return <MonitoringPage presenting={presenting} />
      case 'decisions':  return <DecisionsPage presenting={presenting} />
      case 'closing':    return <ClosingPage presenting={presenting} />
      default:           return <OverviewPage presenting={presenting} onPresenter={enterPresenter} />
    }
  })()

  if (loading) return <Loader onDone={() => setLoading(false)} />

  if (presenting) {
    return (
      <PresenterShell
        scene={sceneIdx}
        onPrev={() => setScene(sceneIdx - 1)}
        onNext={() => setScene(sceneIdx + 1)}
        onExit={exitPresenter}
        showHint={!moved}
      >
        {page}
      </PresenterShell>
    )
  }

  const title = ROUTES.find((r) => r.id === route)?.label ?? 'Overview'

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <SideNav current={route} open={navOpen} onNavigate={() => setNavOpen(false)} />
      <div className="col">
        <TopBar
          title={title}
          onPresenter={enterPresenter}
          onSources={() => setSources(true)}
          onMenu={() => setNavOpen((v) => !v)}
        />
        <main id="main" tabIndex={-1}>{page}</main>
      </div>
      <SourceDrawer open={sources} onClose={() => setSources(false)} />
    </div>
  )
}
