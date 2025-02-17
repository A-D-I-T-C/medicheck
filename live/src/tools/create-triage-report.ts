import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import type { TriageReportData } from '../types/triage';

interface CreateTriageReportProps {
  onReport: (report: TriageReportData) => void;
}

export const createTriageReport = ({ onReport }: CreateTriageReportProps): FunctionDeclaration => ({
  name: "createTriageReport",
  description: 'Create a detailed medical triage report with vital signs and patient assessment.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      summary: {
        type: SchemaType.STRING,
        description: 'Concise summary of patient symptoms, history, and vitals',
      },
      urgency: {
        type: SchemaType.STRING,
        enum: ['low', 'medium', 'high', 'emergency'],
        description: 'Assessment of case urgency',
      },
      vitals: {
        type: SchemaType.OBJECT,
        properties: {
          heartRate: { type: SchemaType.NUMBER, description: 'Heart rate in beats per minute' },
          bloodPressure: {
            type: SchemaType.OBJECT,
            properties: {
              systolic: { type: SchemaType.NUMBER, description: 'Systolic blood pressure in mmHg' },
              diastolic: { type: SchemaType.NUMBER, description: 'Diastolic blood pressure in mmHg' },
            },
            required: ['systolic', 'diastolic'],
          },
          temperature: { type: SchemaType.NUMBER, description: 'Body temperature in Celsius' },
          oxygenSaturation: { type: SchemaType.NUMBER, description: 'Oxygen saturation percentage (SpO2)' },
          respiratoryRate: { type: SchemaType.NUMBER, description: 'Respiratory rate in breaths per minute' },
        },
        required: ['heartRate', 'bloodPressure', 'temperature', 'oxygenSaturation', 'respiratoryRate'],
      },
      symptoms: {
        type: SchemaType.OBJECT,
        properties: {
          primary: { type: SchemaType.STRING, description: 'Chief complaint or main symptom' },
          duration: { type: SchemaType.STRING, description: 'Duration of symptoms' },
          additional: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Additional symptoms reported',
          },
        },
        required: ['primary', 'duration'],
      },
      painAssessment: {
        type: SchemaType.OBJECT,
        properties: {
          level: { type: SchemaType.NUMBER, description: 'Pain level (0-10)' },
          location: { type: SchemaType.STRING, description: 'Location of pain' },
          character: { type: SchemaType.STRING, description: 'Character of pain (sharp, dull, etc.)' },
        },
        required: ['level', 'location', 'character'],
      },
      medicalHistory: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: 'Relevant medical history items',
      },
      medications: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: 'Current medications',
      },
      allergies: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: 'Known allergies',
      },
    },
    required: ['summary', 'urgency', 'vitals', 'symptoms', 'painAssessment'],
  },
});

export const executeCreateTriageReport = async (
  args: TriageReportData,
  onReport: (report: TriageReportData) => void
) => {
  onReport(args);
  return { message: 'Detailed triage report has been created and displayed.' };
};