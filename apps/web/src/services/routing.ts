export interface RoutePoint {
  lat: number
  lng: number
  label?: string
}

export interface RouteResult {
  distance: number // meters
  duration: number // seconds
  geometry: any // GeoJSON
}

export async function getRoute(points: RoutePoint[]): Promise<RouteResult> {
  const coords = points.map(p => `${p.lng},${p.lat}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.code !== 'Ok') {
    throw new Error('Erro ao calcular rota: ' + data.code)
  }
  
  const route = data.routes[0]
  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry
  }
}
