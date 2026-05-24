import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet + Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapProps {
  center?: [number, number]
  zoom?: number
  routeGeometry?: [number, number][]
  markers?: { position: [number, number], label: string }[]
}

export function Map({ 
  center = [-23.5505, -46.6333], 
  zoom = 13, 
  routeGeometry,
  markers = []
}: MapProps) {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((m, idx) => (
          <Marker key={idx} position={m.position}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}

        {routeGeometry && (
          <Polyline 
            positions={routeGeometry} 
            pathOptions={{ color: '#10b981', weight: 5, opacity: 0.7 }} 
          />
        )}
      </MapContainer>
    </div>
  )
}
