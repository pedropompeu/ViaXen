import { useRoute } from '../context/RouteContext'
import { AddressInput, type AddressResult } from './AddressInput'
import { type StopSlot } from '../hooks/useStops'

interface RouteFormProps {
  stopSlots: StopSlot[]
  onAddStop: () => void
  onRemoveStop: (idx: number) => void
  onSetStop: (idx: number, point: { lat: number; lng: number; label: string }) => void
  onCalculate: () => void
}

function Dot({ color }: { color: string }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      background: color, display: 'inline-block', flexShrink: 0,
    }} />
  )
}

export function RouteForm({ stopSlots, onAddStop, onRemoveStop, onSetStop, onCalculate }: RouteFormProps) {
  const { state, dispatch } = useRoute()
  const { origin, destination, axles, loading } = state

  return (
    <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: 20 }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase' as const,
        color: 'var(--vx-text-muted)', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Parâmetros de Rota
      </div>

      {/* Vehicle select */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>
          Configuração do Veículo
        </label>
        <select
          value={axles}
          onChange={e => dispatch({ type: 'SET_AXLES', payload: Number(e.target.value) })}
          style={{
            width: '100%', background: 'var(--vx-surface)',
            border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8,
            color: 'var(--vx-text-primary)', fontFamily: 'var(--font-body)',
            fontSize: 13, padding: '9px 12px', height: 38, outline: 'none', cursor: 'pointer',
            appearance: 'none' as const, WebkitAppearance: 'none' as const,
          }}
        >
          <option value={2}>2 Eixos — VUC / Toco</option>
          <option value={3}>3 Eixos — Truck</option>
          <option value={5}>5 Eixos — Carreta</option>
          <option value={7}>7 Eixos — Bitrem</option>
          <option value={9}>9 Eixos — Rodotrem</option>
        </select>
      </div>

      {/* Stop timeline */}
      <div style={{ marginBottom: 16 }}>

        {/* Origem */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 10, gap: 2 }}>
            <Dot color="var(--vx-text-muted)" />
            <div style={{ width: 1, flex: 1, minHeight: 16, background: 'rgba(0,229,255,0.15)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>Origem</label>
            <AddressInput
              placeholder="Ex: São Paulo, SP"
              onSelect={(r: AddressResult) => dispatch({ type: 'SET_ORIGIN', payload: { lat: r.lat, lng: r.lng, label: r.label } })}
            />
            {origin && <p style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{origin.label}</p>}
          </div>
        </div>

        {/* Paradas intermediárias */}
        {stopSlots.map((slot, idx) => (
          <div key={slot.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 10, gap: 2 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: slot.point ? 'var(--vx-cyan)' : 'var(--vx-graphite)', border: '1px solid rgba(0,229,255,0.4)', display: 'inline-block', flexShrink: 0 }} />
              <div style={{ width: 1, flex: 1, minHeight: 16, background: 'rgba(0,229,255,0.15)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>
                Parada {idx + 1}
              </label>
              <AddressInput
                placeholder="Ex: Curitiba, PR"
                onSelect={(r: AddressResult) => onSetStop(idx, { lat: r.lat, lng: r.lng, label: r.label })}
              />
              {slot.point && <p style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{slot.point.label}</p>}
            </div>
            <button
              onClick={() => onRemoveStop(idx)}
              title="Remover parada"
              style={{
                marginTop: 22, background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--vx-text-muted)', padding: '4px',
                borderRadius: 4, transition: 'color 120ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FF4D4D')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--vx-text-muted)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}

        {/* Botão adicionar parada */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 4, gap: 2 }}>
            <div style={{ width: 1, height: 8, background: 'rgba(0,229,255,0.15)' }} />
          </div>
          <button
            onClick={onAddStop}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: '1px dashed rgba(0,229,255,0.2)',
              color: 'var(--vx-text-muted)', fontFamily: 'var(--font-display)',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
              padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
              transition: 'color 150ms, border-color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--vx-cyan)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--vx-text-muted)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Adicionar parada
          </button>
        </div>

        {/* Destino */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 10 }}>
            <Dot color="var(--vx-cyan)" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>Destino</label>
            <AddressInput
              placeholder="Ex: Florianópolis, SC"
              onSelect={(r: AddressResult) => dispatch({ type: 'SET_DESTINATION', payload: { lat: r.lat, lng: r.lng, label: r.label } })}
            />
            {destination && <p style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{destination.label}</p>}
          </div>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={onCalculate}
        disabled={loading || !origin || !destination}
        style={{
          width: '100%',
          background: (loading || !origin || !destination) ? 'var(--vx-graphite)' : 'var(--vx-cyan)',
          color: (loading || !origin || !destination) ? 'var(--vx-text-muted)' : '#080C10',
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          border: 'none', borderRadius: 8, padding: '11px 20px',
          cursor: (loading || !origin || !destination) ? 'not-allowed' : 'pointer',
          transition: 'background 150ms, transform 100ms',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
        onMouseEnter={e => { if (!loading && origin && destination) e.currentTarget.style.background = 'var(--vx-cyan-dark)' }}
        onMouseLeave={e => { if (!loading && origin && destination) e.currentTarget.style.background = 'var(--vx-cyan)' }}
        onMouseDown={e => { if (!loading && origin && destination) e.currentTarget.style.transform = 'scale(0.98)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {loading ? (
          <>
            <div style={{ width: 14, height: 14, border: '2px solid rgba(8,12,16,0.3)', borderTopColor: '#080C10', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Calculando...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Calcular Rota
          </>
        )}
      </button>
      {!origin && !destination && (
        <p style={{ marginTop: 10, textAlign: 'center' as const, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--vx-text-muted)' }}>
          Informe origem e destino para habilitar
        </p>
      )}
    </div>
  )
}
