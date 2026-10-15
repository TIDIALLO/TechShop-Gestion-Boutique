import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { customersService } from "../../services/customersService"

// Correctif standard : Leaflet cherche ses icônes via des chemins relatifs
// qui ne fonctionnent pas avec les bundlers comme Vite. On les importe
// directement pour qu'elles s'affichent correctement.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Icône distincte pour la boutique (pour la différencier des clients)
const boutiqueIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  className: "hue-rotate-180",
})

// Recentre/zoome automatiquement la carte pour que tous les points soient visibles
function FitBounds({ points }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [points, map])

  return null
}

export default function MapPage() {
  // Coordonnées de la boutique à Mbour 3, Thiès
  const boutique = [14.7886, -16.9241]

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    customersService.getAll({ page_size: 1000 })
      .then(res => {
        if (!isMounted) return
        const data = res.data.results || res.data || []
        setCustomers(data)
      })
      .catch(() => { if (isMounted) setError("Impossible de charger les clients.") })
      .finally(() => { if (isMounted) setLoading(false) })

    return () => { isMounted = false }
  }, [])

  const customersWithLocation = customers.filter(
    c => c.latitude != null && c.longitude != null && c.latitude !== "" && c.longitude !== ""
  )

  const allPoints = [
    boutique,
    ...customersWithLocation.map(c => [Number(c.latitude), Number(c.longitude)]),
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-3xl font-bold">🗺️ Carte des livraisons</h1>
        <p className="text-sm text-gray-500">
          {loading
            ? "Chargement des clients..."
            : `${customersWithLocation.length} client(s) géolocalisé(s) sur ${customers.length} au total`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl overflow-hidden shadow-lg border">
        <MapContainer
          center={boutique}
          zoom={13}
          style={{ height: "650px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={allPoints} />

          <Marker position={boutique} icon={boutiqueIcon}>
            <Popup>
              <strong>🏪 TechShop Electronics</strong>
              <br />
              Mbour 3 - Thiès
            </Popup>
          </Marker>

          {customersWithLocation.map(customer => (
            <Marker
              key={customer.id}
              position={[Number(customer.latitude), Number(customer.longitude)]}
            >
              <Popup>
                <strong>{customer.name}</strong>
                <br />
                {customer.phone}
                <br />
                {customer.address}
                {customer.city ? `, ${customer.city}` : ""}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {!loading && customersWithLocation.length === 0 && (
        <p className="text-sm text-gray-500 mt-3">
          Aucun client n'a encore de position GPS enregistrée.
        </p>
      )}
    </div>
  )
}
