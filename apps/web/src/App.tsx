import { useEffect } from 'react'
import { Map } from './components/Map'
import { AddressInput, type AddressResult } from './components/AddressInput'
import { getRoute } from './services/routing'
import { initDuckDB, calculateFreight } from './services/duckdb'
import { exportToCSV } from './services/export'
import { useRoute } from './context/RouteContext'
import './App.css'

function App() {
  const { state, dispatch } = useRoute()
  const { origin, destination, axles, route, freights, history, loading, error } = state

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
      const points = [
        { lat: origin.lat, lng: origin.lng, label: origin.label },
        { lat: destination.lat, lng: destination.lng, label: destination.label },
      ]
      const result = await getRoute(points)
      const distKm = result.distance / 1000
      const freightList = await calculateFreight(distKm, axles)

      dispatch({ type: 'SET_ROUTE', route: result, freights: freightList })
      dispatch({
        type: 'ADD_HISTORY',
        payload: {
          data: new Date().toISOString(),
          origem: origin.label,
          destino: destination.label,
          distancia_km: distKm.toFixed(2),
          tempo_h: (result.duration / 3600).toFixed(2),
          eixos: axles,
          frete_geral: freightList.find((f: any) => f.tipo_carga === 'Geral')?.frete_minimo.toFixed(2) ?? 0,
        },
      })
    } catch (err: any) {
      const msg = err?.message ?? ''
      if (msg.includes('Erro ao calcular rota')) {
        dispatch({ type: 'SET_ERROR', payload: 'Serviço de rotas indisponível. Verifique sua conexão e tente novamente.' })
      } else if (msg.includes('eixos')) {
        dispatch({ type: 'SET_ERROR', payload: 'Configuração de veículo inválida. Selecione um tipo de veículo válido.' })
      } else if (msg.includes('ANTT')) {
        dispatch({ type: 'SET_ERROR', payload: 'Tabela de fretes não carregada ainda. Aguarde alguns instantes e tente novamente.' })
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao calcular rota ou frete. Tente novamente.' })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleExport = () => {
    if (history.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Nenhum dado para exportar. Calcule ao menos uma rota primeiro.' })
      return
    }
    exportToCSV(history, `rotacerta-export-${new Date().toISOString().split('T')[0]}`)
  }

  const routePositions = route?.geometry.coordinates.map(
    (coord: number[]) => [coord[1], coord[0]] as [number, number]
  )

  const mapCenter: [number, number] = origin ? [origin.lat, origin.lng] : [-23.75, -46.5]
  const mapMarkers = [
    origin ? { position: [origin.lat, origin.lng] as [number, number], label: origin.label } : null,
    destination ? { position: [destination.lat, destination.lng] as [number, number], label: destination.label } : null,
  ].filter(Boolean) as { position: [number, number]; label: string }[]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-8 font-sans">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tighter text-emerald-500 italic">RotaCerta</h1>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-mono">LOGISTICS OS</span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Plataforma de inteligência de frete • Orçamento Zero</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-end px-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Sessão Ativa</span>
            <span className="text-xs font-mono text-emerald-400">{history.length} percursos</span>
          </div>
          <button
            onClick={handleExport}
            className="bg-slate-100 text-slate-950 hover:bg-emerald-400 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar para Power BI
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-950/60 border border-red-800/60 text-red-300 text-sm px-5 py-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
          <button onClick={() => dispatch({ type: 'SET_ERROR', payload: null })} className="ml-auto text-red-500 hover:text-red-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>

            <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
              </div>
              Parâmetros de Carga
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Configuração do Veículo</label>
                <select
                  value={axles}
                  onChange={e => dispatch({ type: 'SET_AXLES', payload: Number(e.target.value) })}
                  className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  <option value={2}>2 Eixos (VUC/Toco)</option>
                  <option value={3}>3 Eixos (Truck)</option>
                  <option value={5}>5 Eixos (Carreta)</option>
                  <option value={7}>7 Eixos (Bitrem)</option>
                  <option value={9}>9 Eixos (Rodotrem)</option>
                </select>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[31px] top-3 w-2 h-2 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Origem</label>
                  <AddressInput
                    placeholder="Ex: São Paulo, SP"
                    onSelect={(r: AddressResult) => dispatch({ type: 'SET_ORIGIN', payload: { lat: r.lat, lng: r.lng, label: r.label } })}
                  />
                  {origin && <p className="text-[10px] text-emerald-500 mt-1 truncate">{origin.label}</p>}
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-3 w-2 h-2 rounded-full bg-emerald-500 border-4 border-slate-950"></div>
                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Destino</label>
                  <AddressInput
                    placeholder="Ex: Curitiba, PR"
                    onSelect={(r: AddressResult) => dispatch({ type: 'SET_DESTINATION', payload: { lat: r.lat, lng: r.lng, label: r.label } })}
                  />
                  {destination && <p className="text-[10px] text-emerald-500 mt-1 truncate">{destination.label}</p>}
                </div>
              </div>

              <button
                onClick={handleCalculateRoute}
                disabled={loading || !origin || !destination}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:bg-slate-800 disabled:text-slate-600 p-4 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <span>GERAR PLANEJAMENTO</span>
                )}
              </button>

              {!origin && !destination && (
                <p className="text-[10px] text-slate-600 text-center">Informe origem e destino para habilitar o cálculo</p>
              )}
            </div>
          </div>

          {freights.length > 0 && (
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Resultado DuckDB</h3>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">Tabela ANTT</span>
              </div>
              <div className="space-y-3">
                {freights.map((f, idx) => (
                  <div key={idx} className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                    <span className="text-[10px] text-slate-500 font-bold">{f.tipo_carga}</span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-black font-mono">R$ {f.frete_minimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className="text-[10px] text-slate-600">Frete Líquido</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="lg:col-span-3 space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-[40px] blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
            <div className="relative">
              <Map center={mapCenter} zoom={origin ? 11 : 10} routeGeometry={routePositions} markers={mapMarkers} />
              {loading && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3 z-[1000]">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-emerald-400 tracking-wider">Calculando rota...</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black">Tempo de Viagem</p>
                <p className="text-xl font-black">{route ? (route.duration / 3600).toFixed(1) : '--'} <span className="text-xs font-normal text-slate-600 italic">horas</span></p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 20V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12"/><path d="M9 20v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M11 7V5a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v2"/><path d="M15 13h2"/><path d="M15 17h2"/><path d="M7 13h2"/><path d="M7 17h2"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black">Pedágios (Est.)</p>
                <p className="text-xl font-black text-slate-400">R$ -- <span className="text-[10px] font-normal text-slate-600 block">Sprint 3</span></p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Z"/><path d="M15 13s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1h-5Z"/><path d="M2 20h20"/><path d="M12 20V10"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black">Consumo Diesel</p>
                <p className="text-xl font-black">{route ? ((route.distance / 1000) / 2.5).toFixed(0) : '--'} <span className="text-xs font-normal text-slate-600 italic">litros</span></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] uppercase font-black tracking-tighter">System Health: OK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-[10px] uppercase font-black tracking-tighter">Cloud OSRM: Connected</span>
          </div>
        </div>
        <p className="text-[10px] font-mono tracking-widest">© 2026 RotaCerta Logistics • Zero Budget Architecture</p>
      </footer>
    </div>
  )
}

export default App
