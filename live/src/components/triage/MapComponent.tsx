import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '@mui/material';
import { EmergencyWaitRoomResponse } from '../../tools/get-emergency-waitroom-info';

// Initialize Leaflet icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapProps {
  waitRoomInfo: EmergencyWaitRoomResponse;
  userLocation: { lat: number; lng: number };
}

export default function MapComponent({ waitRoomInfo, userLocation }: MapProps) {
  const center: [number, number] = [userLocation.lat, userLocation.lng];

  // Force map refresh on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: '100%', minHeight: '400px' }}>
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* User location */}
        <Marker position={center}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Facility markers */}
        {waitRoomInfo.facilities.map((facility, idx) => (
          <Marker 
            key={idx}
            position={[facility.coordinates.lat, facility.coordinates.lng]}
          >
            <Popup>
              <Typography variant="subtitle2">{facility.name}</Typography>
              <Typography variant="body2">Wait: {facility.waitTime}</Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
