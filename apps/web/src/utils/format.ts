export function fmtDist(m: number) { return (m / 1000).toFixed(0) + ' km' }

export function fmtTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.round((s % 3600) / 60)
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export const ROUTE_LABELS = ['Principal', 'Alternativa 1', 'Alternativa 2', 'Alternativa 3']
