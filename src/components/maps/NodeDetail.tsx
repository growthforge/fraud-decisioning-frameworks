import { DetailDrawer } from '../common/DetailDrawer'
import type { LaneMap } from '../../data/types.ts'

const KIND_LABEL: Record<string, string> = {
  stage: 'Stage', decision: 'Decision', evidence: 'Evidence',
  control: 'Control', escalation: 'Escalation', outcome: 'Outcome',
}

export function NodeDetail({
  map, activeId, onClose,
}: { map: LaneMap; activeId: string | null; onClose: () => void }) {
  const n = map.nodes.find((x) => x.id === activeId)
  return (
    <DetailDrawer
      open={Boolean(n)}
      onClose={onClose}
      eyebrow={n ? `${map.lanes[n.lane]} · ${KIND_LABEL[n.kind] ?? n.kind}` : undefined}
      title={n?.label}
    >
      {n ? (
        <>
          <p className="detail-lede">{n.detail}</p>
          <h4 className="detail-h">What a good analyst asks here</h4>
          <ul className="detail-list">
            {n.asks.map((a) => <li key={a}>{a}</li>)}
          </ul>
          <div className="failure">
            <p className="failure-l">Where this step goes wrong</p>
            <p>{n.failure}</p>
          </div>
        </>
      ) : null}
    </DetailDrawer>
  )
}
