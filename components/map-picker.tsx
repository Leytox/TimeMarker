import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { icon, LatLngBounds } from "leaflet";
import { useState } from "react";

const ICON = icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onPositionChange: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

export function MapPicker({
  onPositionChange,
  initialPosition = [41, 12],
}: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);

  const bounds = new LatLngBounds([-90, -180], [90, 180]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const lat = Math.max(-90, Math.min(90, e.latlng.lat));
        const lng = Math.max(-180, Math.min(180, e.latlng.lng));

        setPosition([lat, lng]);
        onPositionChange(lat, lng);
      },
    });

    return position ? <Marker position={position} icon={ICON} /> : null;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
