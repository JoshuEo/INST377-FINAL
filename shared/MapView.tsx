import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

type Props = { lat: number; lon: number };

export default function MapView({ lat, lon }: Props) {
  const icon = useMemo(() => {
    // Fix default marker icon path in many bundlers
    return new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
  }, []);

  return (
    <div style={{ height: 420, width: "100%", borderRadius: 16, overflow: "hidden" }}>
      <MapContainer center={[lat, lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} icon={icon}>
          <Popup>
            Lat {lat.toFixed(4)}, Lon {lon.toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
