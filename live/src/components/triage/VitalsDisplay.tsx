import { Grid, Typography, Box } from '@mui/material';

interface VitalSigns {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

interface VitalsDisplayProps {
  vitals?: VitalSigns | null;
}

const formatVital = (value: number | undefined, unit: string): string => {
  return value ? `${value}${unit}` : 'Not recorded';
};

const VitalDisplay = ({ 
  label, 
  value, 
  unit, 
  normal 
}: { 
  label: string; 
  value: number | undefined; 
  unit: string; 
  normal?: string;
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography variant="body1" color={value ? 'text.primary' : 'text.secondary'}>
      {formatVital(value, unit)}
    </Typography>
    {normal && (
      <Typography variant="caption" color="text.secondary">
        Normal range: {normal}
      </Typography>
    )}
  </Box>
);

export const VitalsDisplay = ({ vitals }: VitalsDisplayProps) => {
  const bp = vitals?.bloodPressure;
  const bloodPressure = bp ? `${bp.systolic}/${bp.diastolic} mmHg` : 'Not recorded';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Blood Pressure
          </Typography>
          <Typography variant="body1" color={bp ? 'text.primary' : 'text.secondary'}>
            {bloodPressure}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Normal range: 90-120/60-80 mmHg
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <VitalDisplay
          label="Heart Rate"
          value={vitals?.heartRate}
          unit=" bpm"
          normal="60-100 bpm"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <VitalDisplay
          label="Temperature"
          value={vitals?.temperature}
          unit="°C"
          normal="36.5-37.5°C"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <VitalDisplay
          label="Respiratory Rate"
          value={vitals?.respiratoryRate}
          unit=" breaths/min"
          normal="12-20 breaths/min"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <VitalDisplay
          label="Oxygen Saturation"
          value={vitals?.oxygenSaturation}
          unit="%"
          normal="95-100%"
        />
      </Grid>
    </Grid>
  );
};
