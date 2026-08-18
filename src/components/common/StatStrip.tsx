export interface Stat {
  v: string
  k: string
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <dl className="stats">
      {stats.map((s) => (
        <div key={s.k} className="stat">
          <dt>{s.v}</dt>
          <dd>{s.k}</dd>
        </div>
      ))}
    </dl>
  )
}
