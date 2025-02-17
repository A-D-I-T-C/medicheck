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
  Slide,
} from "@mui/material";
import { getEmergencyWaitRoomInfo, executeGetEmergencyWaitRoomInfo, type EmergencyWaitRoomResponse } from "../../tools/get-emergency-waitroom-info";
import { EmergencyWaitRoomMap } from './EmergencyWaitRoomMap';

interface ToolResponse {
  response: {
    output: any;
    success?: boolean;
    message?: string;
  };
  id: string;
}

const triagePrompt =
    "You are MediCheck, a medical triage assistant. Ask the patient for their symptoms, medical history, " +
    "and key vitals. Once you have gathered sufficient information, use the createTriageReport tool " +
    "to generate a structured summary for caregivers. After gathering information, you shuold provide preliminary " +
    "insights about possible causes based on the symptoms, while emphasizing that these are preliminary " +
    "observations only and proper medical diagnosis can only be made by qualified healthcare professionals. " +
    "Be thorough but efficient in your assessment.";

function TriageAssistantComponent() {
  const [report, setReport] = useState<TriageReportData | null>(null);
  const [waitRoomInfo, setWaitRoomInfo] = useState<EmergencyWaitRoomResponse | null>(null);
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
        parts: [{ 
          text: triagePrompt + " After creating the triage report, check if emergency care is needed. " +
                "If so, use getEmergencyWaitRoomInfo to find nearby emergency rooms." 
        }],
      },
      tools: [
        { 
          functionDeclarations: [
            createTriageReport({ onReport: (newReport) => setReport(newReport) }),
            getEmergencyWaitRoomInfo({ onWaitRoomInfo: (info) => setWaitRoomInfo(info) })
          ] 
        },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = async (toolCall: ToolCall) => {
      console.log("Received tool call in TriageAssistant:", toolCall);
      
      const responses: ToolResponse[] = [];
      
      for (const fc of toolCall.functionCalls) {
        if (fc.name === "createTriageReport") {
          const args = fc.args as TriageReportData;
          const result = await executeCreateTriageReport(args, (newReport) => setReport(newReport));
          responses.push({
            response: { output: result },
            id: fc.id,
          });
        }
        else if (fc.name === "getEmergencyWaitRoomInfo") {
          const args = fc.args as { userCity: string; urgencyLevel: string; maxDistance?: number };
          const result = await executeGetEmergencyWaitRoomInfo(args, (info) => setWaitRoomInfo(info));
          responses.push({
            response: { 
              output: result.output,
              success: result.success,
              message: result.message
            },
            id: fc.id,
          });
        }
      }
  
      if (responses.length) {
        setTimeout(
          () => client.sendToolResponse({ functionResponses: responses }),
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

  // Add a safe access helper
  const safeAccess = <T,>(obj: T | null | undefined, accessor: (obj: T) => any, fallback: any = []) => {
    try {
      return obj ? accessor(obj) : fallback;
    } catch (error) {
      console.warn('Safe access error:', error);
      return fallback;
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
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom 
          sx={{ m: 2, color: 'text.primary', textAlign: 'center' }}
        >
          MediCheck Triage Assistant
        </Typography>

        {report ? (
          <Grid container spacing={2}>
            <Grid item xs={12} lg={waitRoomInfo ? 8 : 12}>
              <Stack spacing={2}>
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
                    <Typography variant="body2">{report?.summary || 'No summary available'}</Typography>
                  </CardContent>
                </Card>

                <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
                  {/* Vitals Section */}
                  <Grid item xs={12} lg={8}>
                    <Card sx={{ height: '100%' }}>
                      <CardHeader title="Vital Signs" />
                      <CardContent>
                        <VitalsDisplay vitals={report?.vitals} />
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
                            { label: 'Level', value: `${report?.painAssessment?.level || 'N/A'}/10`, color: 'error' },
                            { label: 'Location', value: report?.painAssessment?.location || 'Not specified' },
                            { label: 'Character', value: report?.painAssessment?.character || 'Not specified' },
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
                            <Typography variant="body1">{report?.symptoms?.primary || 'None reported'}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Duration</Typography>
                            <Typography variant="body1">{report?.symptoms?.duration || 'Not specified'}</Typography>
                          </Box>
                          {safeAccess(report?.symptoms?.additional, arr => arr.length > 0, false) && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">Additional Symptoms</Typography>
                              <List dense>
                                {safeAccess(report?.symptoms?.additional, arr => 
                                  arr.map((symptom, i) => (
                                    <ListItem key={i}>
                                      <ListItemText primary={symptom} />
                                    </ListItem>
                                  ))
                                )}
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
                            { title: 'Medical History', items: report?.medicalHistory },
                            { title: 'Current Medications', items: report?.medications },
                            { title: 'Allergies', items: report?.allergies },
                          ].map((section, index) => 
                            safeAccess(section.items, arr => arr.length > 0, false) && (
                              <Box key={index}>
                                <Typography variant="caption" color="text.secondary">{section.title}</Typography>
                                <List dense>
                                  {safeAccess(section.items, arr =>
                                    arr.map((item, i) => (
                                      <ListItem key={i}>
                                        <ListItemText primary={item} />
                                      </ListItem>
                                    ))
                                  )}
                                </List>
                              </Box>
                            )
                          )}
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
            </Grid>

            {waitRoomInfo && (
              <Grid item xs={12} lg={4}>
                <Slide direction="left" in={Boolean(waitRoomInfo)} mountOnEnter unmountOnExit>
                  <Box sx={{ height: '100%' }}>
                    <EmergencyWaitRoomMap 
                      waitRoomInfo={waitRoomInfo}
                      userLocation={waitRoomInfo.userLocation}
                    />
                  </Box>
                </Slide>
              </Grid>
            )}
          </Grid>
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
