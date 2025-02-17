import { Box, Card, CardContent, CardHeader, Chip, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { EmergencyWaitRoomResponse } from '../../tools/get-emergency-waitroom-info';

// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface EmergencyWaitRoomMapProps {
  waitRoomInfo: EmergencyWaitRoomResponse;
  userLocation: { lat: number; lng: number };
}

export function EmergencyWaitRoomMap({ waitRoomInfo, userLocation }: EmergencyWaitRoomMapProps) {
  const center: [number, number] = [userLocation.lat, userLocation.lng];

  return (
    <Card sx={{ height: '100%', minHeight: '400px', p: 1, ml: 1 }}>
      <CardHeader 
        title="Nearby Emergency Rooms"
        action={
          <Chip 
            label={`${waitRoomInfo.facilities.length} Available`}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        }
      />
      <CardContent sx={{ height: 'calc(100% - 64px)' }}>
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <Marker position={center}>
            <Popup>Your Location</Popup>
          </Marker>

          {waitRoomInfo.facilities.map((facility, idx) => (
            <Marker 
              key={idx}
              position={[facility.coordinates.lat, facility.coordinates.lng]}
            >
              <Popup>
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2">{facility.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wait Time: {facility.waitTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {facility.note}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    component="a" 
                    href={facility.url}
                    target="_blank"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    More Info →
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
