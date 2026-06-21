import { supabase } from './supabase'

export interface HistoryEntry {
  id: string
  origin: string
  destination: string
  distance_km: number | null
  duration_min: number | null
  calculated_at: string
}

export interface SaveRouteParams {
  origin: string
  destination: string
  distance_km: number | null
  duration_min: number | null
}

export async function saveRoute(params: SaveRouteParams): Promise<void> {
  if (!supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('route_history').insert({ ...params, user_id: user.id })
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('route_history')
    .select('id, origin, destination, distance_km, duration_min, calculated_at')
    .order('calculated_at', { ascending: false })
    .limit(50)
  if (error || !data) return []
  return data as HistoryEntry[]
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  if (!supabase) return
  await supabase.from('route_history').delete().eq('id', id)
}
