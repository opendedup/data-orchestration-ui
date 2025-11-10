/**
 * Chat panel component that wraps CopilotChat with mode selector at the bottom.
 */

"use client";

import type { CSSProperties, ReactElement } from "react";
import { CopilotChat, CopilotKitCSSProperties } from "@copilotkit/react-ui";
import ModeSelector from "./ModeSelector";
import ChatMessageRenderer from "./ChatMessageRenderer";
import ComposerDropZone from "./ComposerDropZone";
import QueryConfirmationDialog from "./QueryConfirmationDialog";

const DOT_ANIMATION_DELAYS = [0, 0.2, 0.4] as const;

const activityIcon: ReactElement = (
  <div className="thinking-indicator thinking-indicator--assistant" aria-hidden="true">
    {DOT_ANIMATION_DELAYS.map((delay) => (
      <span
        key={`activity-indicator-dot-${delay}`}
        className="thinking-indicator-dot"
        style={{ animationDelay: `${delay}s` } as CSSProperties}
      />
    ))}
  </div>
);

export default function ChatPanel(): ReactElement {
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Chat area - takes all available space */}
      <div
        className="flex-1 min-h-0 overflow-hidden relative"
        style={{
          "--copilot-kit-primary-color": "#2e3342",
          "--copilot-kit-contrast-color": "#f7f9ff",
          "--copilot-kit-background-color": "#0b0d12",
          "--copilot-kit-secondary-color": "#1c202a",
          "--copilot-kit-secondary-contrast-color": "#eef2ff",
          "--copilot-kit-separator-color": "#262b36",
          "--copilot-kit-muted-color": "#8e95aa",
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
          RenderMessage={ChatMessageRenderer}
          icons={{ activityIcon }}
        />

        {/* Query Confirmation Dialog for HITL */}
        <QueryConfirmationDialog />

        {/* Drop zone for dragging datasets */}
        <ComposerDropZone />

        {/* Mode selector injected inside input area */}
        <div className="mode-selector-injection">
          <ModeSelector />
        </div>
      </div>
    </div>
  );
}

