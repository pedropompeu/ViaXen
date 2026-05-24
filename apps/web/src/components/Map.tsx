import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon, shadowUrl: markerShadow,
  iconSize: [25, 41], iconAnchor: [12, 41],
})

interface MapProps {
  center?: [number, number]
  zoom?: number
  routeOptions?: [number, number][][]  // todas as alternativas
  selectedRouteIdx?: number
  markers?: { position: [number, number]; label: string }[]
  loading?: boolean
}

function MapController({ routeOptions, selectedRouteIdx, markers }: Pick<MapProps, 'routeOptions' | 'selectedRouteIdx' | 'markers'>) {
  const map = useMap()

  useEffect(() => {
    const idx = selectedRouteIdx ?? 0
    const selected = routeOptions?.[idx]

    if (selected && selected.length > 1) {
      map.fitBounds(L.latLngBounds(selected), { padding: [40, 40], maxZoom: 14, animate: true, duration: 0.8 })
      return
    }
    if (markers && markers.length > 0) {
      const points = markers.map(m => m.position)
      if (points.length === 1) {
        map.setView(points[0], 12, { animate: true, duration: 0.6 })
      } else {
        map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 13, animate: true, duration: 0.6 })
      }
    }
  }, [routeOptions, selectedRouteIdx, markers, map])

  return null
}

export function Map({
  center = [-23.5505, -46.6333],
  zoom = 13,
  routeOptions = [],
  selectedRouteIdx = 0,
  markers = [],
  loading,
}: MapProps) {
  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vx-cyan-border)' }}>
      <MapContainer center={center} zoom={zoom} className="vx-map-height" style={{ width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController routeOptions={routeOptions} selectedRouteIdx={selectedRouteIdx} markers={markers} />

        {/* Rotas não selecionadas — tracejadas e transparentes */}
        {routeOptions.map((positions, i) =>
          i !== selectedRouteIdx ? (
            <Polyline
              key={i}
              positions={positions}
              pathOptions={{ color: '#00E5FF', weight: 2, opacity: 0.22, dashArray: '5 8' }}
            />
          ) : null
        )}

        {/* Rota selecionada — destaque total */}
        {routeOptions[selectedRouteIdx] && (
          <Polyline
            positions={routeOptions[selectedRouteIdx]}
            pathOptions={{ color: '#00E5FF', weight: 3.5, opacity: 0.92 }}
          />
        )}

        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Scan-line durante loading */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          background: 'rgba(8,12,16,0.7)', backdropFilter: 'blur(2px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.7) 50%, transparent 100%)',
            animation: 'scanLine 2.4s ease-in-out infinite',
          }} />
          <div style={{
            width: 36, height: 36,
            border: '2.5px solid rgba(0,229,255,0.2)',
            borderTopColor: 'var(--vx-cyan)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.12em', color: 'var(--vx-cyan)', textTransform: 'uppercase',
          }}>
            Calculando rota
          </span>
        </div>
      )}
    </div>
  )
}
