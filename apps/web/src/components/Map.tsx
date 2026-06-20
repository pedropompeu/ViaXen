import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Marcadores customizados — tema claro + accent amber
const ORIGIN_ICON = L.divIcon({
  className: '',
  html: `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="9" fill="#F8F0DC" stroke="#FF7A00" stroke-width="2.5"/>
    <circle cx="11" cy="11" r="3.5" fill="#8C7454"/>
  </svg>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
})

const STOP_ICON = L.divIcon({
  className: '',
  html: `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="16" height="16" rx="3" fill="#F8F0DC" stroke="#FF7A00" stroke-width="2"/>
    <rect x="5.5" y="5.5" width="7" height="7" rx="1.5" fill="#FF7A00"/>
  </svg>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
})

const DEST_ICON = L.divIcon({
  className: '',
  html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 0C4.93 0 0 4.93 0 11c0 8.25 11 19 11 19S22 19.25 22 11C22 4.93 17.07 0 11 0z" fill="#FF7A00"/>
    <circle cx="11" cy="11" r="4.5" fill="#F8F0DC"/>
  </svg>`,
  iconSize: [22, 30],
  iconAnchor: [11, 30],
  popupAnchor: [0, -32],
})

const ICONS = {
  origin:      ORIGIN_ICON,
  stop:        STOP_ICON,
  destination: DEST_ICON,
}

interface MapProps {
  center?: [number, number]
  zoom?: number
  routeOptions?: [number, number][][]
  selectedRouteIdx?: number
  markers?: { position: [number, number]; label: string; type?: 'origin' | 'stop' | 'destination' }[]
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
    <div
      role="img"
      aria-label="Mapa interativo de rota rodoviária"
      style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--vx-cyan-border)' }}
    >
      <MapContainer center={center} zoom={zoom} className="vx-map-height" style={{ width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController routeOptions={routeOptions} selectedRouteIdx={selectedRouteIdx} markers={markers} />

        {/* Rotas não selecionadas — tracejadas */}
        {routeOptions.map((positions, i) => {
          const altColors = ['#D95F00', '#1D4ED8', '#6D28D9']
          return i !== selectedRouteIdx ? (
            <Polyline
              key={i}
              positions={positions}
              pathOptions={{ color: altColors[i] ?? '#888', weight: 2, opacity: 0.30, dashArray: '5 8' }}
            />
          ) : null
        })}

        {/* Rota selecionada */}
        {routeOptions[selectedRouteIdx] && (
          <Polyline
            positions={routeOptions[selectedRouteIdx]}
            pathOptions={{ color: ['#D95F00', '#1D4ED8', '#6D28D9'][selectedRouteIdx] ?? '#D95F00', weight: 4, opacity: 0.90 }}
          />
        )}

        {markers.map((m, i) => (
          <Marker
            key={i}
            position={m.position}
            icon={ICONS[m.type ?? 'stop']}
          >
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          background: 'rgba(237,224,196,0.80)', backdropFilter: 'blur(2px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,122,0,0.70) 50%, transparent 100%)',
            animation: 'scanLine 2.4s ease-in-out infinite',
          }} />
          <div style={{
            width: 36, height: 36,
            border: '2.5px solid rgba(255,122,0,0.25)',
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
