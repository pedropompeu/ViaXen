import { useEffect } from 'react'
import { Map } from './components/Map'
import { Topbar } from './components/Topbar'
import { ErrorToast } from './components/ErrorToast'
import { RouteForm } from './components/RouteForm'
import { RouteAlternatives } from './components/RouteAlternatives'
import { FreightTable } from './components/FreightTable'
import { KpiCards } from './components/KpiCards'
import { AppFooter } from './components/AppFooter'
import { useRoute } from './context/RouteContext'
import { useStops } from './hooks/useStops'
import { useRouteCalculator } from './hooks/useRouteCalculator'
import { initDuckDB } from './services/duckdb'
import './App.css'

function App() {
  const { state, dispatch } = useRoute()
  const { origin, destination, routeOptions, selectedRouteIdx, route, freights, history, error } = state

  const { stopSlots, addStop, removeStop, setStop } = useStops()
  const { handleCalculateRoute, handleSelectRoute, handleExport } = useRouteCalculator(stopSlots)

  useEffect(() => {
    initDuckDB().catch(() => {
      dispatch({ type: 'SET_ERROR', payload: 'Falha ao inicializar o motor de cálculo. Recarregue a página.' })
    })
  }, [])

  // Lê query params na inicialização — share_target e shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // share_target: endereço compartilhado de outro app (Google Maps, WhatsApp etc.)
    const shared = params.get('text') || params.get('title') || params.get('url')
    if (shared) {
      dispatch({ type: 'SET_SHARED_TEXT', payload: shared.trim() })
    }

    // shortcuts: ações rápidas do menu de contexto do app instalado
    const acao = params.get('acao')
    if (acao === 'nova-rota') {
      dispatch({ type: 'SET_ORIGIN', payload: null })
      dispatch({ type: 'SET_DESTINATION', payload: null })
    } else if (acao === 'frete') {
      // Rola até a seção de frete após o app montar
      setTimeout(() => {
        document.getElementById('freight-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }

    if (shared || acao) window.history.replaceState({}, '', '/')
  }, [])

  const routeOptionsGeom = routeOptions.map(r =>
    r.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number])
  )

  const mapCenter: [number, number] = origin ? [origin.lat, origin.lng] : [-23.75, -46.5]
  const mapMarkers = [
    origin ? { position: [origin.lat, origin.lng] as [number, number], label: origin.label, type: 'origin' as const } : null,
    ...stopSlots.filter(s => s.point).map(s => ({ position: [s.point!.lat, s.point!.lng] as [number, number], label: s.point!.label, type: 'stop' as const })),
    destination ? { position: [destination.lat, destination.lng] as [number, number], label: destination.label, type: 'destination' as const } : null,
  ].filter(Boolean) as { position: [number, number]; label: string; type: 'origin' | 'stop' | 'destination' }[]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>
      <Topbar historyCount={history.length} onExport={handleExport} />

      {error && (
        <ErrorToast
          error={error}
          onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
        />
      )}

      <main className="vx-main-grid">
        <aside style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
          <RouteForm
            stopSlots={stopSlots}
            onAddStop={addStop}
            onRemoveStop={removeStop}
            onSetStop={setStop}
            onCalculate={handleCalculateRoute}
          />
          <RouteAlternatives onSelect={handleSelectRoute} />
          <div id="freight-section"><FreightTable freights={freights} /></div>
        </aside>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16, minWidth: 0 }}>
          <Map
            center={mapCenter}
            zoom={origin ? 11 : 10}
            routeOptions={routeOptionsGeom}
            selectedRouteIdx={selectedRouteIdx}
            markers={mapMarkers}
            loading={state.loading}
          />
          <KpiCards route={route} />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default App
