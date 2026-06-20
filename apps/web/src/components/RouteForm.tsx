import { Route, X, Plus, Navigation2, Loader2 } from 'lucide-react'
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
  const isReady = !loading && !!origin && !!destination

  return (
    <div style={{
      background: 'var(--vx-card)',
      border: '1px solid var(--vx-cyan-border)',
      borderRadius: 10,
      padding: 20,
      boxShadow: '0 1px 3px rgba(120,85,35,0.06)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'var(--vx-text-muted)', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Route size={12} strokeWidth={1.5} />
        Parâmetros de Rota
      </div>

      {/* Seleção do veículo */}
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block', marginBottom: 6,
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          color: 'var(--vx-text-muted)',
        }}>
          Configuração do Veículo
        </label>
        <select
          value={axles}
          onChange={e => dispatch({ type: 'SET_AXLES', payload: Number(e.target.value) })}
          style={{
            width: '100%',
            background: 'var(--vx-surface)',
            border: '1px solid var(--vx-cyan-border)',
            borderRadius: 8,
            color: 'var(--vx-text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            padding: '9px 12px', height: 38,
            outline: 'none', cursor: 'pointer',
            appearance: 'none', WebkitAppearance: 'none',
          }}
        >
          <option value={2}>2 Eixos — VUC / Toco</option>
          <option value={3}>3 Eixos — Truck</option>
          <option value={5}>5 Eixos — Carreta</option>
          <option value={7}>7 Eixos — Bitrem</option>
          <option value={9}>9 Eixos — Rodotrem</option>
        </select>
      </div>

      {/* Timeline de paradas */}
      <div style={{ marginBottom: 16 }}>

        {/* Origem */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 2 }}>
            <Dot color="var(--vx-text-muted)" />
            <div style={{ width: 1, flex: 1, minHeight: 16, background: 'var(--vx-cyan-border)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--vx-text-muted)' }}>
              Origem
            </label>
            <AddressInput
              placeholder="Ex: São Paulo, SP"
              onSelect={(r: AddressResult) => dispatch({ type: 'SET_ORIGIN', payload: { lat: r.lat, lng: r.lng, label: r.label } })}
            />
            {origin && (
              <p style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {origin.label}
              </p>
            )}
          </div>
        </div>

        {/* Paradas intermediárias */}
        {stopSlots.map((slot, idx) => (
          <div key={slot.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 2 }}>
              <span style={{
                width: 8, height: 8, borderRadius: 2,
                background: slot.point ? 'var(--vx-cyan)' : 'var(--vx-graphite)',
                border: '1px solid rgba(255,122,0,0.40)',
                display: 'inline-block', flexShrink: 0,
              }} />
              <div style={{ width: 1, flex: 1, minHeight: 16, background: 'var(--vx-cyan-border)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--vx-text-muted)' }}>
                Parada {idx + 1}
              </label>
              <AddressInput
                placeholder="Ex: Curitiba, PR"
                onSelect={(r: AddressResult) => onSetStop(idx, { lat: r.lat, lng: r.lng, label: r.label })}
              />
              {slot.point && (
                <p style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {slot.point.label}
                </p>
              )}
            </div>
            <button
              onClick={() => onRemoveStop(idx)}
              aria-label={`Remover parada ${idx + 1}`}
              style={{
                marginTop: 22, background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--vx-text-muted)', padding: 4,
                borderRadius: 4, transition: 'color 120ms',
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--vx-danger)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--vx-text-muted)')}
            >
              <X size={14} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        ))}

        {/* Botão adicionar parada */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, gap: 2 }}>
            <div style={{ width: 1, height: 8, background: 'var(--vx-cyan-border)' }} />
          </div>
          <button
            onClick={onAddStop}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: '1px dashed rgba(255,122,0,0.25)',
              color: 'var(--vx-text-muted)', fontFamily: 'var(--font-display)',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
              padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
              transition: 'color 150ms, border-color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--vx-cyan)'; e.currentTarget.style.borderColor = 'rgba(255,122,0,0.50)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--vx-text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,122,0,0.25)' }}
          >
            <Plus size={12} strokeWidth={2.5} />
            Adicionar parada
          </button>
        </div>

        {/* Destino */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
            <Dot color="var(--vx-cyan)" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--vx-text-muted)' }}>
              Destino
            </label>
            <AddressInput
              placeholder="Ex: Florianópolis, SC"
              onSelect={(r: AddressResult) => dispatch({ type: 'SET_DESTINATION', payload: { lat: r.lat, lng: r.lng, label: r.label } })}
            />
            {destination && (
              <p style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {destination.label}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onCalculate}
        disabled={!isReady}
        style={{
          width: '100%',
          background: isReady ? 'var(--vx-cyan)' : 'var(--vx-graphite)',
          color: isReady ? '#080C10' : 'var(--vx-text-muted)',
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          border: 'none', borderRadius: 8, padding: '11px 20px',
          cursor: isReady ? 'pointer' : 'not-allowed',
          transition: 'background 150ms, transform 100ms',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
        onMouseEnter={e => { if (isReady) e.currentTarget.style.background = 'var(--vx-cyan-dark)' }}
        onMouseLeave={e => { if (isReady) e.currentTarget.style.background = 'var(--vx-cyan)' }}
        onMouseDown={e => { if (isReady) e.currentTarget.style.transform = 'scale(0.98)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {loading ? (
          <>
            <Loader2 size={14} strokeWidth={2} style={{ animation: 'spin 0.8s linear infinite' }} />
            Calculando...
          </>
        ) : (
          <>
            <Navigation2 size={14} strokeWidth={2} />
            Calcular Rota
          </>
        )}
      </button>

      {!origin && !destination && (
        <p style={{ marginTop: 10, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--vx-text-muted)' }}>
          Informe origem e destino para habilitar
        </p>
      )}
    </div>
  )
}
