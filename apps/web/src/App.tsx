import { useEffect, useState, useRef } from 'react'
import { Map } from './components/Map'
import { AddressInput, type AddressResult } from './components/AddressInput'
import { getRoute } from './services/routing'
import { initDuckDB, calculateFreight } from './services/duckdb'
import { exportToCSV } from './services/export'
import { useRoute, type RoutePoint } from './context/RouteContext'
import { analytics } from './services/analytics'
import './App.css'

const VNodeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 52 52" fill="none">
    <rect x="1" y="1" width="50" height="50" rx="14"
      fill="#0D1117" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/>
    <path d="M12 14 L22 38 L26 30 L30 38 L40 14"
      stroke="#00E5FF" strokeWidth="3.5"
      strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="30" r="3" fill="#00E5FF"/>
    <line x1="34" y1="23" x2="44" y2="23"
      stroke="rgba(0,229,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="36" y1="27" x2="44" y2="27"
      stroke="rgba(0,229,255,0.2)" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

interface StopSlot {
  id: number
  point: RoutePoint | null
}

function fmtDist(m: number) { return (m / 1000).toFixed(0) + ' km' }
function fmtTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.round((s % 3600) / 60)
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

const ROUTE_LABELS = ['Principal', 'Alternativa 1', 'Alternativa 2', 'Alternativa 3']

function App() {
  const { state, dispatch } = useRoute()
  const { origin, destination, axles, routeOptions, selectedRouteIdx, route, freights, history, loading, error } = state

  const [stopSlots, setStopSlots] = useState<StopSlot[]>([])
  const nextIdRef = useRef(1)

  useEffect(() => {
    initDuckDB().catch(() => {
      dispatch({ type: 'SET_ERROR', payload: 'Falha ao inicializar o motor de cálculo. Recarregue a página.' })
    })
  }, [])

  const handleCalculateRoute = async () => {
    if (!origin || !destination) {
      dispatch({ type: 'SET_ERROR', payload: 'Informe a origem e o destino antes de calcular.' })
      return
    }
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const filledStops = stopSlots.filter(s => s.point !== null).map(s => s.point!)
      const allPoints = [
        { lat: origin.lat, lng: origin.lng, label: origin.label },
        ...filledStops.map(s => ({ lat: s.lat, lng: s.lng, label: s.label })),
        { lat: destination.lat, lng: destination.lng, label: destination.label },
      ]
      const results = await getRoute(allPoints)
      const distKm = results[0].distance / 1000
      const freightList = await calculateFreight(distKm, axles)

      analytics.calcularRota({ eixos: axles, paradas: filledStops.length, sucesso: true })
      dispatch({ type: 'SET_ROUTE_OPTIONS', routeOptions: results, freights: freightList })
      dispatch({
        type: 'ADD_HISTORY',
        payload: {
          data: new Date().toISOString(),
          origem: origin.label,
          destino: destination.label,
          paradas: filledStops.map(s => s.label).join(' → '),
          distancia_km: distKm.toFixed(2),
          tempo_h: (results[0].duration / 3600).toFixed(2),
          eixos: axles,
          frete_geral: freightList.find((f: any) => f.tipo_carga === 'Geral')?.frete_minimo.toFixed(2) ?? 0,
        },
      })
    } catch (err: any) {
      analytics.calcularRota({ eixos: axles, paradas: filledStops.length, sucesso: false })
      console.error('[VIAXEN] erro no cálculo:', err)
      const msg = err?.message ?? ''
      if (msg.includes('OSRM') || msg.includes('fetch')) {
        dispatch({ type: 'SET_ERROR', payload: 'Serviço de rotas indisponível. Verifique sua conexão e tente novamente.' })
      } else if (msg.includes('não encontrada')) {
        dispatch({ type: 'SET_ERROR', payload: 'Rota não encontrada. Verifique se os pontos são acessíveis por estrada.' })
      } else {
        dispatch({ type: 'SET_ERROR', payload: `Erro: ${msg || 'falha desconhecida — abra o console para detalhes.'}` })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleSelectRoute = async (idx: number) => {
    const selected = routeOptions[idx]
    if (!selected) return
    if (idx > 0) analytics.selecionarAlternativa(idx)
    const distKm = selected.distance / 1000
    const freightList = await calculateFreight(distKm, axles)
    dispatch({ type: 'SELECT_ROUTE', idx, freights: freightList })
  }

  const handleExport = () => {
    if (history.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Nenhum dado para exportar. Calcule ao menos uma rota primeiro.' })
      return
    }
    analytics.exportarCSV(history.length)
    exportToCSV(history, `viaxen-export-${new Date().toISOString().split('T')[0]}`)
  }

  const addStop = () => {
    analytics.adicionarParada()
    setStopSlots(prev => [...prev, { id: nextIdRef.current++, point: null }])
  }

  const removeStop = (idx: number) => {
    setStopSlots(prev => prev.filter((_, i) => i !== idx))
    dispatch({ type: 'SET_ROUTE_OPTIONS', routeOptions: [], freights: [] })
  }

  const setStop = (idx: number, point: RoutePoint) => {
    setStopSlots(prev => prev.map((s, i) => i === idx ? { ...s, point } : s))
  }

  // Geometrias de todas as rotas alternativas para o mapa
  const routeOptionsGeom = routeOptions.map(r =>
    r.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number])
  )

  const filledStops = stopSlots.filter(s => s.point !== null).map(s => s.point!)
  const mapCenter: [number, number] = origin ? [origin.lat, origin.lng] : [-23.75, -46.5]
  const mapMarkers = [
    origin ? { position: [origin.lat, origin.lng] as [number, number], label: origin.label } : null,
    ...filledStops.map(s => ({ position: [s.lat, s.lng] as [number, number], label: s.label })),
    destination ? { position: [destination.lat, destination.lng] as [number, number], label: destination.label } : null,
  ].filter(Boolean) as { position: [number, number]; label: string }[]

  const distKm = route ? (route.distance / 1000).toFixed(0) : null
  const timeH = route ? fmtTime(route.duration) : null
  const diesel = route ? ((route.distance / 1000) / 2.5).toFixed(0) : null

  // Dot indicator para o timeline de paradas
  const dot = (color: string) => (
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      background: color, display: 'inline-block', flexShrink: 0,
    }} />
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>

      {/* ── Topbar ── */}
      <header className="vx-topbar" style={{
        height: 52, flexShrink: 0,
        background: 'var(--vx-surface)',
        borderBottom: '1px solid var(--vx-cyan-border)',
        boxShadow: '0 1px 0 0 rgba(0,229,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VNodeIcon />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1 }}>
            <span style={{ color: 'var(--vx-cyan)' }}>V</span>
            <span style={{ color: 'var(--vx-text-primary)' }}>IAXEN</span>
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const,
          color: 'var(--vx-cyan)', background: 'rgba(0,229,255,0.1)',
          border: '1px solid rgba(0,229,255,0.2)', padding: '3px 8px', borderRadius: 6,
        }}>Route Intelligence</div>
        <div style={{ flex: 1 }} />
        <div className="vx-topbar-session" style={{ flexDirection: 'column' as const, alignItems: 'flex-end', marginRight: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>Sessão</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--vx-cyan)' }}>{history.length} percursos</span>
        </div>
        <button
          onClick={handleExport}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', color: 'var(--vx-text-primary)',
            border: '1px solid rgba(0,229,255,0.25)',
            fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
            transition: 'background 150ms, border-color 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span className="vx-topbar-export-label">Exportar CSV</span>
        </button>
      </header>

      {/* ── Error toast ── */}
      {error && (
        <div style={{
          margin: '16px 24px 0',
          background: '#1F2B3A', border: '1px solid rgba(0,229,255,0.18)',
          borderLeft: '3px solid #FF4D4D', borderRadius: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
          animation: 'fadeSlideIn 240ms var(--ease-out) both',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--vx-text-secondary)', flex: 1 }}>{error}</span>
          <button onClick={() => dispatch({ type: 'SET_ERROR', payload: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vx-text-muted)', padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* ── Main layout ── */}
      <main className="vx-main-grid">

        {/* ── Left panel ── */}
        <aside style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

          {/* Controls card */}
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

            {/* ── Timeline de paradas ── */}
            <div style={{ marginBottom: 16 }}>

              {/* Origem */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 10, gap: 2 }}>
                  {dot('var(--vx-text-muted)')}
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
                      placeholder={`Ex: Curitiba, PR`}
                      onSelect={(r: AddressResult) => setStop(idx, { lat: r.lat, lng: r.lng, label: r.label })}
                    />
                    {slot.point && <p style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{slot.point.label}</p>}
                  </div>
                  <button
                    onClick={() => removeStop(idx)}
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
                  onClick={addStop}
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
                  {dot('var(--vx-cyan)')}
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
              onClick={handleCalculateRoute}
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

          {/* ── Alternativas de rota ── */}
          {routeOptions.length > 0 && (
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
                      onClick={() => handleSelectRoute(i)}
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
                      {/* Radio dot */}
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
          )}

          {/* Freight results */}
          {freights.length > 0 && (
            <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: 20, animation: 'fadeSlideIn 240ms var(--ease-out) both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>Fretes ANTT</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--vx-cyan)', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', padding: '2px 7px', borderRadius: 5 }}>Res. 5820/2019</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {freights.map((f: any, idx: number) => (
                  <div key={idx} style={{ padding: '10px 12px', background: 'var(--vx-graphite)', border: '1px solid rgba(0,229,255,0.08)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--vx-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{f.tipo_carga}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--vx-text-primary)', flexShrink: 0 }}>R$ {f.frete_minimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Right: map + KPIs ── */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16, minWidth: 0 }}>
          <Map
            center={mapCenter}
            zoom={origin ? 11 : 10}
            routeOptions={routeOptionsGeom}
            selectedRouteIdx={selectedRouteIdx}
            markers={mapMarkers}
            loading={loading}
          />

          {/* KPI cards */}
          <div className="vx-kpi-grid">
            <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vx-cyan)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M12 3v4"/><path d="M12 17v4"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)', marginBottom: 2 }}>Distância</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: distKm ? 'var(--vx-text-primary)' : 'var(--vx-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {distKm ?? '—'}{distKm && <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--vx-text-muted)', marginLeft: 4 }}>km</span>}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(26,107,255,0.08)', border: '1px solid rgba(26,107,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4DA6FF' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)', marginBottom: 2 }}>Tempo</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: timeH ? 'var(--vx-text-primary)' : 'var(--vx-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {timeH ?? '—'}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(255,155,33,0.08)', border: '1px solid rgba(255,155,33,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9B21' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)', marginBottom: 2 }}>Diesel Est.</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: diesel ? 'var(--vx-text-primary)' : 'var(--vx-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {diesel ?? '—'}{diesel && <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--vx-text-muted)', marginLeft: 4 }}>L</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="vx-footer" style={{ borderTop: '1px solid rgba(0,229,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vx-success)', boxShadow: '0 0 6px var(--vx-success)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>OSRM Online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vx-success)', boxShadow: '0 0 6px var(--vx-success)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>ANTT Carregada</span>
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-text-muted)', letterSpacing: '0.05em' }}>
          © 2026 VIAXEN · Route Intelligence Platform
        </span>
      </footer>
    </div>
  )
}

export default App
