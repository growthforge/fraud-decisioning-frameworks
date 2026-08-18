export function Tag({
  children,
  tone = 'grey',
}: {
  children: React.ReactNode
  tone?: 'grey' | 'burgundy' | 'brass' | 'good' | 'warn' | 'bad' | 'info'
}) {
  return <span className={`tag t-${tone}`}>{children}</span>
}
