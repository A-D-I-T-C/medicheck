import { VitalsData } from '../../types/triage';

interface VitalsDisplayProps {
  vitals: VitalsData;
}

export function VitalsDisplay({ vitals }: VitalsDisplayProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="vitals-item">
        <span className="text-sm text-neutral-500">Heart Rate</span>
        <div className="text-lg font-medium">{vitals.heartRate} <span className="text-xs">bpm</span></div>
      </div>
      <div className="vitals-item">
        <span className="text-sm text-neutral-500">Blood Pressure</span>
        <div className="text-lg font-medium">
          {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
          <span className="text-xs">mmHg</span>
        </div>
      </div>
      <div className="vitals-item">
        <span className="text-sm text-neutral-500">Temperature</span>
        <div className="text-lg font-medium">{vitals.temperature}°C</div>
      </div>
      <div className="vitals-item">
        <span className="text-sm text-neutral-500">O2 Saturation</span>
        <div className="text-lg font-medium">{vitals.oxygenSaturation}%</div>
      </div>
      <div className="vitals-item">
        <span className="text-sm text-neutral-500">Respiratory Rate</span>
        <div className="text-lg font-medium">{vitals.respiratoryRate} <span className="text-xs">bpm</span></div>
      </div>
    </div>
  );
}
