import { useEffect, useCallback } from 'react'
import { Map } from './components/Map'
import { Topbar } from './components/Topbar'
import { ErrorToast } from './components/ErrorToast'
import { RouteForm } from './components/RouteForm'
import { RouteAlternatives } from './components/RouteAlternatives'
import { FreightTable } from './components/FreightTable'
import { KpiCards } from './components/KpiCards'
import { AppFooter } from './components/AppFooter'
import { InstallBanner } from './components/InstallBanner'
import { useRoute } from './context/RouteContext'
import { useAuth } from './context/AuthContext'
import { useStops } from './hooks/useStops'
import { useRouteCalculator } from './hooks/useRouteCalculator'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { initDuckDB } from './services/duckdb'
import { saveRoute } from './services/history'
import './App.css'

function App() {
  const { state, dispatch } = useRoute()
  const { origin, destination, routeOptions, selectedRouteIdx, route, freights, history, error } = state
  const { user } = useAuth()

  const { stopSlots, addStop, removeStop, setStop } = useStops()
  const { handleCalculateRoute, handleSelectRoute, handleExport } = useRouteCalculator(stopSlots)
  const { installState, install, dismiss } = useInstallPrompt()

  useEffect(() => {
    initDuckDB().catch(() => {
      dispatch({ type: 'SET_ERROR', payload: 'Falha ao inicializar o motor de cálculo. Recarregue a página.' })
    })
  }, [])

  // Lê query params na inicialização — share_target e shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const shared = params.get('text') || params.get('title') || params.get('url')
    if (shared) dispatch({ type: 'SET_SHARED_TEXT', payload: shared.trim() })

    const acao = params.get('acao')
    if (acao === 'nova-rota') {
      dispatch({ type: 'SET_ORIGIN', payload: null })
      dispatch({ type: 'SET_DESTINATION', payload: null })
    } else if (acao === 'frete') {
      setTimeout(() => {
        document.getElementById('freight-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }

    if (shared || acao) window.history.replaceState({}, '', '/')
  }, [])

  // Salva rota no histórico Supabase quando usuário está logado e rota é calculada
  useEffect(() => {
    if (!user || !route || !origin || !destination) return
    const distKm = route.distance ? route.distance / 1000 : null
    const durMin = route.duration ? Math.round(route.duration / 60) : null
    saveRoute({
      origin: origin.label,
      destination: destination.label,
      distance_km: distKm,
      duration_min: durMin,
    })
  }, [route])

  // Reaplicar rota do histórico — preenche origem e destino
  const handleReapply = useCallback((originLabel: string, destinationLabel: string) => {
    dispatch({ type: 'SET_ORIGIN', payload: { label: originLabel, lat: 0, lng: 0 } })
    dispatch({ type: 'SET_DESTINATION', payload: { label: destinationLabel, lat: 0, lng: 0 } })
  }, [dispatch])

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
      <Topbar
        historyCount={history.length}
        onExport={handleExport}
        onReapply={handleReapply}
      />

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

      <InstallBanner
        installState={installState}
        onInstall={install}
        onDismiss={dismiss}
      />
    </div>
  )
}

export default App
