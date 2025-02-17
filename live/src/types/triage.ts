export interface VitalsData {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
}

export interface TriageReportData {
  summary: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  vitals: VitalsData;
  symptoms: {
    primary: string;
    duration: string;
    additional: string[];
  };
  painAssessment: {
    level: number;
    location: string;
    character: string;
  };
  medicalHistory: string[];
  medications: string[];
  allergies: string[];
}
