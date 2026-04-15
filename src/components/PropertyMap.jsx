import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { School, TreePine, ShoppingCart, Bus } from 'lucide-react';

// Correção para ícones do Leaflet no React
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function PropertyMap({ coords, address }) {
  const [pois, setPois] = useState([]);

  // Função para buscar pontos de interesse gratuitos via Overpass API
  const fetchNearbyPOIs = async () => {
    const { lat, lng } = coords;
    const radius = 1000; // 1km
    const query = `
      [out:json];
      (
        node["amenity"~"school|kindergarten"](around:${radius},${lat},${lng});
        node["leisure"="park"](around:${radius},${lat},${lng});
        node["shop"="supermarket"](around:${radius},${lat},${lng});
        node["highway"="bus_stop"](around:${radius},${lat},${lng});
      );
      out body;
    `;
    
    try {
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      setPois(data.elements || []);
    } catch (error) {
      console.error("Erro ao buscar POIs:", error);
    }
  };

  useEffect(() => {
    fetchNearbyPOIs();
  }, [coords]);

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      <div className="h-[400px] w-full">
        <MapContainer center={[coords.lat, coords.lng]} zoom={15} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coords.lat, coords.lng]}>
            <Popup>{address}</Popup>
          </Marker>
          
          {/* Marcadores dos Pontos de Interesse */}
          {pois.map((poi, idx) => (
            <Marker key={idx} position={[poi.lat, poi.lon]}>
              <Popup>{poi.tags.name || "Ponto de Interesse"}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legenda de Proximidade (Similar ao site de referência) */}
      <div className="bg-white p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <School size={18} className="text-blue-500" /> Escolas
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TreePine size={18} className="text-green-500" /> Parques
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShoppingCart size={18} className="text-orange-500" /> Mercados
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bus size={18} className="text-purple-500" /> Transporte
        </div>
      </div>
    </div>
  );
}