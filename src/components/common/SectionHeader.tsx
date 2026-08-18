interface Props {
  eyebrow: string
  title: string
  lede?: string
  aside?: React.ReactNode
}

export function SectionHeader({ eyebrow, title, lede, aside }: Props) {
  return (
    <header className="sec-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="sec-title">{title}</h2>
        {lede ? <p className="sec-lede">{lede}</p> : null}
      </div>
      {aside ? <div className="sec-aside">{aside}</div> : null}
    </header>
  )
}
