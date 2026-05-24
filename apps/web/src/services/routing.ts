export interface RoutePoint {
  lat: number
  lng: number
  label?: string
}

export interface RouteResult {
  distance: number // meters
  duration: number // seconds
  geometry: any   // GeoJSON LineString
}

export async function getRoute(points: RoutePoint[]): Promise<RouteResult[]> {
  const coords = points.map(p => `${p.lng},${p.lat}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&alternatives=3`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`OSRM retornou ${response.status}`)
  const data = await response.json()

  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('Rota não encontrada para os pontos informados')
  }

  return data.routes.map((r: any) => ({
    distance: r.distance,
    duration: r.duration,
    geometry: r.geometry,
  }))
}
