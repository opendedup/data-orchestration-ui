/**
 * Chat panel component that wraps CopilotChat with mode selector at the bottom.
 */

"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import ModeSelector from "./ModeSelector";

export default function ChatPanel() {
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Chat area - takes all available space */}
      <div 
        className="flex-1 min-h-0 overflow-hidden relative"
        style={{
          "--copilot-kit-primary-color": "#2e3342",
          "--copilot-kit-contrast-color": "#eef0f6",
          "--copilot-kit-background-color": "#0b0d12",
          "--copilot-kit-secondary-color": "#1c202a",
          "--copilot-kit-secondary-contrast-color": "#d5d8e5",
          "--copilot-kit-separator-color": "#262b36",
          "--copilot-kit-muted-color": "#5d6473",
        } as CopilotKitCSSProperties}
      >
        <CopilotChat
          instructions="You are a data orchestration assistant with three modes: Ask (explore datasets), Planning (create PRPs), and Action (execute PRPs)."
          labels={{
            title: "Data Orchestration Agent",
            initial: "Hi! 👋 I can help you discover, plan, or create data products.",
            placeholder: "",
          }}
          className="h-full copilot-chat-container"
        />
        
        {/* Mode selector injected inside input area */}
        <div className="mode-selector-injection">
          <ModeSelector />
        </div>
      </div>
    </div>
  );
}

