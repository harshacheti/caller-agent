import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { RetellWebClient } from "retell-client-js-sdk";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


const webClient = new RetellWebClient();

const App = () => {
  const [callStatus, setCallStatus] = useState<'not-started' | 'active' | 'inactive'>('not-started');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [additionalParams, setAdditionalParams] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    setAgentId(id);

    // Parse additional parameters
    const params: Record<string, string> = {};
    urlParams.forEach((value, key) => {
      if (key !== 'id') {
        params[key] = value;
      }
    });
    setAdditionalParams(params);

    // Set up event listeners
    webClient.on("conversationStarted", () => {
      console.log("conversationStarted");
      setCallStatus('active');
      setIsAgentSpeaking(true);
    });

    webClient.on("conversationEnded", ({ code, reason }) => {
      console.log("Closed with code:", code, ", reason:", reason);
      setCallStatus('inactive');
      setIsAgentSpeaking(false);
    });

    webClient.on("error", (error) => {
      console.error("An error occurred:", error);
      setCallStatus('inactive');
      setIsAgentSpeaking(false);
    });

    webClient.on("update", (update) => {
      console.log("update", update);
      if (update.turntaking === "user_turn") {
        setIsAgentSpeaking(false);
      } else if (update.turntaking === "agent_turn") {
        setIsAgentSpeaking(true);
      }
    });
  }, []);

  const toggleConversation = async () => {
    if (!agentId) {
      console.error("Agent ID is not available");
      return;
    }

    if (callStatus === 'active') {
      webClient.stopConversation();
    } else {
      setCallStatus('active');
      setIsAgentSpeaking(true);
      const registerCallResponse = await registerCall(agentId, additionalParams);
      if (registerCallResponse.callId) {
        webClient
          .startConversation({
            callId: registerCallResponse.callId,
            enableUpdate: true,
          })
          .catch(console.error);
      }
    }
  };

  async function registerCall(agentId: string, params: Record<string, string>): Promise<RegisterCallResponse> {
    console.log("Registering call for agent:", agentId, "with params:", params);
    try {
      const response = await fetch("/api/register-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: agentId,
          ...params
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: RegisterCallResponse = await response.json();
      console.log("Call registered successfully:", data);
      return data;
    } catch (err) {
      console.error("Error registering call:", err);
      throw new Error(String(err));
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      <img src={`${process.env.PUBLIC_URL}/logo3.png`} alt="Agent Portrait" />
      <h3>You are speaking with Eva</h3>
        <div 
          ref={containerRef} 
          className={`portrait-container 
            ${callStatus === 'active' ? 'active' : ''} 
            ${callStatus === 'inactive' ? 'inactive' : ''} 
            ${isAgentSpeaking ? 'agent-speaking' : ''}`}
          onClick={toggleConversation}
        >
        <Stack spacing={1} 
        sx={{
            justifyContent: "center",
            alignItems: "center",
            }}>
          <img 
            src={`${process.env.PUBLIC_URL}/wave.gif`}
            alt="Agent Portrait" 
            className="agent-portrait"
          />
          
          <Button 
              color={callStatus === 'active' ? "error" : "success"} 
              variant="contained" 
              size="medium"
            >
              {callStatus === 'active' ? "END CALL" : "START CALL"}
            </Button>
          </Stack>
        </div>
        
      </header>
    </div>
  );
};

export default App;
