import { useRoute } from '../context/RouteContext'
import { getRoute } from '../services/routing'
import { calculateFreight } from '../services/duckdb'
import { exportToCSV } from '../services/export'
import { analytics } from '../services/analytics'
import { type StopSlot } from './useStops'

export function useRouteCalculator(stopSlots: StopSlot[]) {
  const { state, dispatch } = useRoute()
  const { origin, destination, axles, history, routeOptions } = state

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
      analytics.calcularRota({ eixos: axles, paradas: stopSlots.filter(s => s.point).length, sucesso: false })
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

  return { handleCalculateRoute, handleSelectRoute, handleExport }
}
