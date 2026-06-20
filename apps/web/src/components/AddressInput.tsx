import { useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'

export interface AddressResult {
  label: string
  lat: number
  lng: number
}

interface Props {
  placeholder: string
  onSelect: (result: AddressResult) => void
}

export function AddressInput({ placeholder, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AddressResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastRequestRef = useRef<number>(0)

  useEffect(() => {
    if (query.length < 3 || query === selected) {
      setSuggestions([])
      setOpen(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const now = Date.now()
      const elapsed = now - lastRequestRef.current
      if (elapsed < 1000) await new Promise(r => setTimeout(r, 1000 - elapsed))
      lastRequestRef.current = Date.now()
      setLoading(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=br`
        const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } })
        const data = await res.json()
        const results: AddressResult[] = data.map((item: any) => {
          const addr = item.address ?? {}
          const city = addr.city ?? addr.town ?? addr.municipality ?? addr.village ?? addr.county ?? item.display_name
          const state = addr.state ?? ''
          return { label: state ? `${city}, ${state}` : city, lat: parseFloat(item.lat), lng: parseFloat(item.lon) }
        })
        setSuggestions(results)
        setOpen(results.length > 0)
      } catch {
        setSuggestions([])
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }, 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, selected])

  function handleSelect(result: AddressResult) {
    setQuery(result.label)
    setSelected(result.label)
    setSuggestions([])
    setOpen(false)
    onSelect(result)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        {/* Ícone de busca à esquerda */}
        <div style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--vx-muted)', pointerEvents: 'none',
          display: 'flex', alignItems: 'center',
        }}>
          <Search size={13} strokeWidth={2} />
        </div>

        <input
          type="text"
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected('') }}
          placeholder={placeholder}
          style={{
            width: '100%',
            background: 'var(--vx-surface)',
            border: '1px solid var(--vx-cyan-border)',
            borderRadius: 8,
            color: 'var(--vx-text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            padding: '9px 32px 9px 30px',
            height: 38,
            transition: 'border-color 150ms var(--ease-fast)',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--vx-cyan)')}
          onBlur={e => (e.target.style.borderColor = 'var(--vx-cyan-border)')}
        />

        {/* Spinner de loading à direita */}
        {loading && (
          <div style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--vx-cyan)',
            display: 'flex', alignItems: 'center',
            animation: 'spin 0.7s linear infinite',
          }}>
            <Loader2 size={13} strokeWidth={2} />
          </div>
        )}
      </div>

      {open && (
        <ul style={{
          position: 'absolute', zIndex: 9999, marginTop: 4, width: '100%',
          background: 'var(--vx-card)',
          border: '1px solid var(--vx-subtle)',
          borderRadius: 8, overflow: 'hidden', listStyle: 'none',
          padding: 0, margin: '4px 0 0',
          boxShadow: '0 8px 24px rgba(120,85,35,0.15)',
        }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                padding: '9px 14px', fontSize: 12, cursor: 'pointer',
                color: 'var(--vx-text-secondary)',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--vx-graphite)' : 'none',
                transition: 'background 120ms',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--vx-graphite)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
