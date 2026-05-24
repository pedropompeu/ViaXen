import { useState, useEffect, useRef } from 'react'

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
  const [selected, setSelected] = useState<string>('')
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
      // Respeita rate limit de 1 req/s do Nominatim
      const now = Date.now()
      const elapsed = now - lastRequestRef.current
      if (elapsed < 1000) {
        await new Promise(r => setTimeout(r, 1000 - elapsed))
      }
      lastRequestRef.current = Date.now()

      setLoading(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=br`
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'pt-BR' }
        })
        const data = await res.json()
        const results: AddressResult[] = data.map((item: any) => {
          const addr = item.address ?? {}
          const city =
            addr.city ?? addr.town ?? addr.municipality ??
            addr.village ?? addr.county ?? item.display_name
          const state = addr.state ?? ''
          return {
            label: state ? `${city}, ${state}` : city,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }
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

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, selected])

  function handleSelect(result: AddressResult) {
    setQuery(result.label)
    setSelected(result.label)
    setSuggestions([])
    setOpen(false)
    onSelect(result)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected('') }}
          placeholder={placeholder}
          className="w-full bg-slate-950 p-3 pr-8 rounded-xl border border-slate-800 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className="px-4 py-3 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-0 leading-snug"
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
