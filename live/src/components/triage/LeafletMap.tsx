import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';
import { EmergencyWaitRoomResponse } from '../../tools/get-emergency-waitroom-info';

// Initialize icon paths
const defaultIcon = new Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface MapProps {
  waitRoomInfo: EmergencyWaitRoomResponse;
}

export function LeafletMap({ waitRoomInfo }: MapProps) {
  const mapRef = useRef(null);
  const { facilities, userLocation } = waitRoomInfo;

  useEffect(() => {
    // Force map to update its size when mounted
    const timer = setTimeout(() => {
      if (mapRef.current) {
        (mapRef.current as any).invalidateSize();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const center: [number, number] = [userLocation.lat, userLocation.lng];

  return (
    <MapContainer 
      center={center}
      zoom={12} 
      ref={mapRef}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {/* User location */}
      <Marker position={center} icon={defaultIcon}>
        <Popup>Your Location</Popup>
      </Marker>

      {/* Facility markers */}
      {facilities.map((facility, idx) => (
        <Marker 
          key={idx}
          position={[facility.coordinates.lat, facility.coordinates.lng]}
          icon={defaultIcon}
        >
          <Popup>
            <Box sx={{ p: 1, minWidth: '200px' }}>
              <Typography variant="subtitle2" gutterBottom>
                {facility.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wait Time: {facility.waitTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {facility.address}
              </Typography>
              {facility.note && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {facility.note}
                </Typography>
              )}
              <Typography 
                variant="caption" 
                component="a" 
                href={facility.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', mt: 1 }}
              >
                More Info →
              </Typography>
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
