/* Shared content types. The swimlane grid is fixed, so these carry geometry as data
   and `scripts/verify.ts` asserts it before anything is allowed to render. */

export type NodeKind = 'stage' | 'decision' | 'evidence' | 'escalation' | 'outcome' | 'control'
export type EdgeKind = 'flow' | 'handoff' | 'escalate' | 'loop'

export interface LaneNode {
  id: string
  /** hard maximum 26 characters — renders into a 102px box */
  label: string
  col: number
  lane: number
  kind: NodeKind
  detail: string
  asks: string[]
  /** the specific way this step goes wrong in real teams */
  failure: string
}

export interface LaneEdge {
  from: string
  to: string
  kind: EdgeKind
  label: string
}

export interface LaneMap {
  id: string
  tab: string
  title: string
  subtitle: string
  /** the one-line argument the geometry proves */
  principle: string
  legend: string
  lanes: string[]
  nodes: LaneNode[]
  edges: LaneEdge[]
}

export type TypologyFamily =
  | 'card fraud' | 'account takeover' | 'first-party'
  | 'internal misuse' | 'merchant' | 'AML-adjacent'

export type ControlAction =
  | 'alert only' | 'step up' | 'hold' | 'decline' | 'report to customer' | 'investigate'

export type ControlLayer =
  | 'real-time decline' | 'real-time step-up' | 'near-real-time alert'
  | 'batch / periodic review' | 'onboarding'

export interface Typology {
  id: string
  name: string
  family: TypologyFamily
  oneLine: string
  how: string
  signals: string[]
  ruleShape: string
  action: ControlAction
  falsePositive: string
  fpWhy: string
  layer: ControlLayer
  productHook: string
  metric: string
}

export interface Source {
  title: string
  url?: string
  supports: string
  cls: 'CONFIRMED' | 'RESEARCH' | 'INFERENCE'
}
