import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  label: string
}

export function SearchInput({ value, onChange, placeholder, label }: Props) {
  return (
    <div className="search">
      <Search size={16} aria-hidden="true" />
      <input
        type="search"
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <button className="icon-btn sm" onClick={() => onChange('')} aria-label="Clear search">
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
