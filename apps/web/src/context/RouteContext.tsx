import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { RouteResult } from '../services/routing'

export interface RoutePoint {
  lat: number
  lng: number
  label: string
}

export interface FreightResult {
  tipo_carga: string
  frete_minimo: number
}

export interface HistoryItem {
  data: string
  origem: string
  destino: string
  distancia_km: string
  tempo_h: string
  eixos: number
  frete_geral: string | number
}

interface State {
  origin: RoutePoint | null
  destination: RoutePoint | null
  axles: number
  route: RouteResult | null
  freights: FreightResult[]
  history: HistoryItem[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'SET_ORIGIN'; payload: RoutePoint | null }
  | { type: 'SET_DESTINATION'; payload: RoutePoint | null }
  | { type: 'SET_AXLES'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ROUTE'; route: RouteResult; freights: FreightResult[] }
  | { type: 'ADD_HISTORY'; payload: HistoryItem }

const initialState: State = {
  origin: null,
  destination: null,
  axles: 5,
  route: null,
  freights: [],
  history: [],
  loading: false,
  error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ORIGIN':      return { ...state, origin: action.payload, route: null, freights: [] }
    case 'SET_DESTINATION': return { ...state, destination: action.payload, route: null, freights: [] }
    case 'SET_AXLES':       return { ...state, axles: action.payload }
    case 'SET_LOADING':     return { ...state, loading: action.payload }
    case 'SET_ERROR':       return { ...state, error: action.payload }
    case 'SET_ROUTE':       return { ...state, route: action.route, freights: action.freights }
    case 'ADD_HISTORY':     return { ...state, history: [action.payload, ...state.history] }
    default:                return state
  }
}

const RouteContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <RouteContext.Provider value={{ state, dispatch }}>{children}</RouteContext.Provider>
}

export function useRoute() {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('useRoute deve ser usado dentro de RouteProvider')
  return ctx
}
