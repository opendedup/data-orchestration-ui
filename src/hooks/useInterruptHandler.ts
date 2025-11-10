/**
 * Hook for handling agent interrupts (HITL confirmations).
 * 
 * This hook monitors the agent state for interrupt signals and provides
 * handlers for approving or rejecting the interrupted action.
 */

"use client";

import { useCoAgent } from "@copilotkit/react-core";
import { useState, useEffect, useCallback } from "react";
import type { InterruptPayload } from "@/types/agent-state";

interface UseInterruptHandlerReturn {
  isInterrupted: boolean;
  interruptPayload: InterruptPayload | null;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
}

/**
 * Custom hook to handle agent interrupts for HITL flows.
 * 
 * Detects when the agent has paused execution (interrupted) and provides
 * functions to approve or reject the action, which resumes the agent.
 */
export function useInterruptHandler(): UseInterruptHandlerReturn {
  const { state, setState } = useCoAgent({
    name: "langgraph_orchestration_agent",
  });

  const [isInterrupted, setIsInterrupted] = useState(false);
  const [interruptPayload, setInterruptPayload] = useState<InterruptPayload | null>(null);

  // Detect when agent is interrupted
  useEffect(() => {
    const interrupted = state?.interrupted as boolean;
    const payloads = state?.interrupt_payload as InterruptPayload[] | undefined;

    if (interrupted && payloads && payloads.length > 0) {
      console.log("[Interrupt] Agent interrupted:", payloads[0]);
      setIsInterrupted(true);
      setInterruptPayload(payloads[0]);
    } else {
      setIsInterrupted(false);
      setInterruptPayload(null);
    }
  }, [state]);

  /**
   * Handle user approval of the interrupted action.
   * Sends resume command with approval to the agent.
   */
  const handleApprove = useCallback(async () => {
    console.log("[Interrupt] User approved query execution");
    setIsInterrupted(false);
    setInterruptPayload(null);
    
    // Send approval back to agent by updating state
    // The agent will resume with the approval value
    await setState({ interrupt_response: true });
  }, [setState]);

  /**
   * Handle user rejection of the interrupted action.
   * Sends resume command with rejection to the agent.
   */
  const handleReject = useCallback(async () => {
    console.log("[Interrupt] User rejected query execution");
    setIsInterrupted(false);
    setInterruptPayload(null);
    
    // Send rejection back to agent
    await setState({ interrupt_response: false });
  }, [setState]);

  return {
    isInterrupted,
    interruptPayload,
    handleApprove,
    handleReject,
  };
}

