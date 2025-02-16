import { useEffect, useState, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

const triagePrompt =
  "You are a medical triage assistant. Ask the patient for their symptoms, medical history, " +
  "and key vitals. Once sufficient information is gathered, generate a concise report summarizing " +
  "the patient's condition for caregivers. (Tool integration will be added later.)";

function TriageAssistantComponent() {
  const [report, setReport] = useState("");
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
        parts: [
          { text: triagePrompt },
        ],
      },
      tools: [],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log("Received tool call in TriageAssistant:", toolCall);
      if (toolCall.functionCalls.length) {
        const triageData = toolCall.functionCalls
          .map((fc) => JSON.stringify(fc.args, null, 2))
          .join("\n");
        setReport((prev) => prev + "\n" + triageData);
      }
    };

    if (client) {
      client.on("toolcall", onToolCall);
      // Return cleanup function that removes the event listener
      return () => {
        client.off("toolcall", onToolCall);
      };
    }
  }, [client]);

  return (
    <div className="triage-assistant">
      <h2>Medical Triage Assistant</h2>
      <p>{report || "Awaiting patient input..."}</p>
    </div>
  );
}

export const TriageAssistant = memo(TriageAssistantComponent);
