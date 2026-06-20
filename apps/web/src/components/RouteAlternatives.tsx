import { Check } from 'lucide-react'
import { useRoute } from '../context/RouteContext'
import { fmtDist, fmtTime, ROUTE_LABELS } from '../utils/format'

interface RouteAlternativesProps {
  onSelect: (idx: number) => void
}

// Cores visuais — decorativo (traço mapa, dot, indicador lateral: 3:1 aceitável)
const ROUTE_COLORS = ['#D95F00', '#1D4ED8', '#6D28D9'] as const

// Cores de texto — WCAG AA 4.5:1 em canvas #EDE0C4
const ROUTE_TEXT_COLORS = ['#7A3800', '#1D4ED8', '#6D28D9'] as const

export function RouteAlternatives({ onSelect }: RouteAlternativesProps) {
  const { state } = useRoute()
  const { routeOptions, selectedRouteIdx } = state

  if (routeOptions.length === 0) return null

  return (
    <div style={{
      background: 'var(--vx-card)',
      border: '1px solid var(--vx-cyan-border)',
      borderRadius: 10,
      padding: 20,
      animation: 'fadeSlideIn 240ms var(--ease-out) both',
      boxShadow: '0 1px 3px rgba(120,85,35,0.06)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--vx-text-muted)',
        marginBottom: 12,
      }}>
        Alternativas de Rota
      </div>

      <div
        role="radiogroup"
        aria-label="Selecionar alternativa de rota"
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {routeOptions.map((r, i) => {
          const isSelected = i === selectedRouteIdx
          const routeColor     = ROUTE_COLORS[i]     ?? '#8C7454'
          const routeTextColor = ROUTE_TEXT_COLORS[i] ?? '#5C4020'

          return (
            <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
              {/* Indicador lateral colorido */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                  background: isSelected ? routeColor : 'var(--vx-subtle)',
                  opacity: isSelected ? 1 : 0.3,
                  transition: 'background 150ms, opacity 150ms',
                }}
              />
              <button
                role="radio"
                aria-checked={isSelected}
                aria-label={`${ROUTE_LABELS[i] ?? `Rota ${i + 1}`}: ${fmtDist(r.distance)}, ${fmtTime(r.duration)}`}
                onClick={() => onSelect(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px 10px 16px',
                  width: '100%', cursor: 'pointer',
                  textAlign: 'left',
                  background: isSelected ? `${routeColor}12` : 'var(--vx-graphite)',
                  border: isSelected
                    ? `1px solid ${routeColor}50`
                    : '1px solid var(--vx-cyan-border)',
                  borderLeft: 'none',
                  borderRadius: '0 8px 8px 0',
                  transition: 'background 150ms, border-color 150ms',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = `${routeColor}40` }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--vx-cyan-border)' }}
              >
                {/* Dot colorido */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: isSelected ? routeColor : 'transparent',
                    border: `2px solid ${isSelected ? routeColor : 'var(--vx-subtle)'}`,
                    transition: 'all 150ms',
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 12, fontWeight: 600,
                    color: isSelected ? 'var(--vx-text-primary)' : 'var(--vx-text-secondary)',
                    marginBottom: 2,
                  }}>
                    {ROUTE_LABELS[i] ?? `Rota ${i + 1}`}
                  </div>
                  {/* Usa routeTextColor (WCAG AA) em vez da cor visual do traço */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontVariantNumeric: 'tabular-nums',
                    color: isSelected ? routeTextColor : 'var(--vx-text-muted)',
                  }}>
                    {fmtDist(r.distance)} · {fmtTime(r.duration)}
                  </div>
                </div>

                {isSelected && (
                  <Check size={14} strokeWidth={2.5} color={routeColor} aria-hidden="true" />
                )}
              </button>
            </div>
          )
        })}
      </div>

      {routeOptions.length === 1 && (
        <p style={{
          marginTop: 10,
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--vx-text-muted)',
          textAlign: 'center',
        }}>
          Apenas 1 rota disponível para este trajeto
        </p>
      )}
    </div>
  )
}
