import { useRoute } from '../context/RouteContext'
import { fmtDist, fmtTime, ROUTE_LABELS } from '../utils/format'

interface RouteAlternativesProps {
  onSelect: (idx: number) => void
}

export function RouteAlternatives({ onSelect }: RouteAlternativesProps) {
  const { state } = useRoute()
  const { routeOptions, selectedRouteIdx } = state

  if (routeOptions.length === 0) return null

  return (
    <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: 20, animation: 'fadeSlideIn 240ms var(--ease-out) both' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)', marginBottom: 12 }}>
        Alternativas de Rota
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
        {routeOptions.map((r, i) => {
          const isSelected = i === selectedRouteIdx
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                background: isSelected ? 'rgba(0,229,255,0.07)' : 'var(--vx-graphite)',
                border: isSelected ? '1px solid rgba(0,229,255,0.4)' : '1px solid rgba(0,229,255,0.08)',
                transition: 'background 150ms, border-color 150ms',
                textAlign: 'left' as const, width: '100%',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0,229,255,0.08)' }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                border: isSelected ? '2px solid var(--vx-cyan)' : '2px solid var(--vx-muted)',
                background: isSelected ? 'var(--vx-cyan)' : 'transparent',
                boxShadow: isSelected ? '0 0 6px rgba(0,229,255,0.5)' : 'none',
                transition: 'all 150ms',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: isSelected ? 'var(--vx-text-primary)' : 'var(--vx-text-secondary)', marginBottom: 2 }}>
                  {ROUTE_LABELS[i] ?? `Rota ${i + 1}`}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isSelected ? 'var(--vx-cyan)' : 'var(--vx-text-muted)' }}>
                  {fmtDist(r.distance)} · {fmtTime(r.duration)}
                </div>
              </div>
              {isSelected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--vx-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>
      {routeOptions.length === 1 && (
        <p style={{ marginTop: 10, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--vx-text-muted)', textAlign: 'center' as const }}>
          Apenas 1 rota disponível para este trajeto
        </p>
      )}
    </div>
  )
}
