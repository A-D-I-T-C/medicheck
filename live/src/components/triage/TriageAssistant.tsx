import { useEffect, useState, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";
import { createTriageReport, executeCreateTriageReport } from "../../tools/create-triage-report";
import { VitalsDisplay } from "./VitalsDisplay";
import { type TriageReportData } from "../../types/triage";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Stack,
  Icon,
} from "@mui/material";

const triagePrompt =
    "You are a medical triage assistant. Ask the patient for their symptoms, medical history, " +
    "and key vitals. Once you have gathered sufficient information, use the createTriageReport tool " +
    "to generate a structured summary for caregivers. After gathering information, you shuold provide preliminary " +
    "insights about possible causes based on the symptoms, while emphasizing that these are preliminary " +
    "observations only and proper medical diagnosis can only be made by qualified healthcare professionals. " +
    "Be thorough but efficient in your assessment.";

function TriageAssistantComponent() {
  const [report, setReport] = useState<TriageReportData | null>(null);
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: {
        parts: [{ text: triagePrompt }],
      },
      tools: [
        { functionDeclarations: [createTriageReport({ onReport: (newReport) => setReport(newReport) })] },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = async (toolCall: ToolCall) => {
      console.log("Received tool call in TriageAssistant:", toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === "createTriageReport",
      );
      if (fc) {
        const args = fc.args as TriageReportData;
        await executeCreateTriageReport(args, (newReport) => setReport(newReport));
      }
      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { success: true } },
                id: fc.id,
              })),
            }),
          200,
        );
      }
    };

    if (client) {
      client.on("toolcall", onToolCall);
      return () => {
        client.off("toolcall", onToolCall);
      };
    }
  }, [client]);

  const getSeverityColor = (urgency: string): "success" | "warning" | "error" | "default" => {
    switch (urgency) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high':
      case 'emergency': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100%',
      height: '100vh',
      overflow: 'auto',
      py: 2,
      px: 1
    }}>
      <Container maxWidth="xl" sx={{ px: 2 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom 
          sx={{ m: 2, color: 'text.primary', textAlign: 'center' }}
        >
          MediCheck Triage Assistant
        </Typography>

        {report ? (
          <Stack spacing={2} sx={{ width: '100%'}}>
            <Card sx={{ width: '100%', pl: 2 }}>
              <CardHeader
                sx={{ py: 1.5 }}
                action={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={report.urgency.toUpperCase()}
                      color={getSeverityColor(report.urgency)}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Stack>
                }
                title={
                  <Typography variant="subtitle1" component="h2">
                    Triage Summary
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="body2">{report.summary}</Typography>
              </CardContent>
            </Card>

            <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
              {/* Vitals Section */}
              <Grid item xs={12} lg={8}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="Vital Signs" />
                  <CardContent>
                    <VitalsDisplay vitals={report.vitals} />
                  </CardContent>
                </Card>
              </Grid>

              {/* Pain Assessment Section */}
              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="Pain Assessment" />
                  <CardContent>
                    <Stack spacing={2}>
                      {[
                        { label: 'Level', value: `${report.painAssessment.level}/10`, color: 'error' },
                        { label: 'Location', value: report.painAssessment.location },
                        { label: 'Character', value: report.painAssessment.character },
                      ].map((item, index) => (
                        <Box key={index}>
                          <Typography variant="caption" >
                            {item.label}
                          </Typography>
                          <Typography variant="body1" color={item.color || 'text.secondary'}>{item.value}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Symptoms & Medical Background in equal columns */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="Symptoms" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Primary Complaint</Typography>
                        <Typography variant="body1">{report.symptoms.primary}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Duration</Typography>
                        <Typography variant="body1">{report.symptoms.duration}</Typography>
                      </Box>
                      {report.symptoms.additional.length > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Additional Symptoms</Typography>
                          <List dense>
                            {report.symptoms.additional.map((symptom, i) => (
                              <ListItem key={i}>
                                <ListItemText primary={symptom} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="Medical Background" />
                  <CardContent>
                    <Stack spacing={2}>
                      {[
                        { title: 'Medical History', items: report.medicalHistory },
                        { title: 'Current Medications', items: report.medications },
                        { title: 'Allergies', items: report.allergies },
                      ].map((section, index) => section.items?.length > 0 && (
                        <Box key={index}>
                          <Typography variant="caption" color="text.secondary">{section.title}</Typography>
                          <List dense>
                            {section.items.map((item, i) => (
                              <ListItem key={i}>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              color: 'text.secondary',
              mt: 1,
              px: 1 
            }}>
              <Typography variant="caption">
                Assessed at {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Card sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: 3,
            minHeight: '200px'
          }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Awaiting patient assessment...
              </Typography>
            </Stack>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export const TriageAssistant = memo(TriageAssistantComponent);
