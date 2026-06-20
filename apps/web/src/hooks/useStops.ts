import { useState, useRef } from 'react'
import { useRoute, type RoutePoint } from '../context/RouteContext'
import { analytics } from '../services/analytics'

export interface StopSlot {
  id: number
  point: RoutePoint | null
}

export function useStops() {
  const { dispatch } = useRoute()
  const [stopSlots, setStopSlots] = useState<StopSlot[]>([])
  const nextIdRef = useRef(1)

  const addStop = () => {
    analytics.adicionarParada()
    setStopSlots(prev => [...prev, { id: nextIdRef.current++, point: null }])
  }

  const removeStop = (idx: number) => {
    setStopSlots(prev => prev.filter((_, i) => i !== idx))
    dispatch({ type: 'SET_ROUTE_OPTIONS', routeOptions: [], freights: [] })
  }

  const setStop = (idx: number, point: RoutePoint) =>
    setStopSlots(prev => prev.map((s, i) => i === idx ? { ...s, point } : s))

  return { stopSlots, addStop, removeStop, setStop }
}
