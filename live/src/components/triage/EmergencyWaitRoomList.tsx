import { Card, CardContent, CardHeader, Chip, List, ListItem, ListItemText, Typography } from '@mui/material';
import { EmergencyWaitRoomResponse } from '../../tools/get-emergency-waitroom-info';

interface EmergencyWaitRoomListProps {
  waitRoomInfo: EmergencyWaitRoomResponse;
}

export function EmergencyWaitRoomList({ waitRoomInfo }: EmergencyWaitRoomListProps) {
  return (
    <Card sx={{ height: '100%', minHeight: '400px' }}>
      <CardHeader 
        title="Nearby Emergency Rooms"
        action={
          <Chip 
            label={`${waitRoomInfo.facilities.length} Available`}
            color="primary"
            size="small"
          />
        }
      />
      <CardContent>
        <List>
          {waitRoomInfo.facilities.map((facility, idx) => (
            <ListItem key={idx} divider>
              <ListItemText
                primary={facility.name}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Wait Time: {facility.waitTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Address: {facility.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Note: {facility.note}
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
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
