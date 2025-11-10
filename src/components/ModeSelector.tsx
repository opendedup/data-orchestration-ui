"use client";

import { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { Infinity, FileEdit, Zap } from "lucide-react";
import clsx from "clsx";

export default function ModeSelector() {
  const [currentMode, setCurrentMode] = useState<string>("ask");

  // This action can be called by the agent or user to switch modes
  useCopilotAction({
    name: "switch_mode",
    description: "Switch the agent operational mode",
    parameters: [
      {
        name: "mode",
        type: "string",
        description: "Mode to switch to: ask, planning, or action",
        enum: ["ask", "planning", "action"],
      }
    ],
    handler: async ({ mode }) => {
      setCurrentMode(mode);
      return `Switched to ${mode} mode`;
    },
  });

  const modes = [
    { value: "ask", label: "Ask", icon: Infinity },
    { value: "planning", label: "Plan", icon: FileEdit },
    { value: "action", label: "Action", icon: Zap },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.value;
        return (
          <button
            key={mode.value}
            onClick={() => setCurrentMode(mode.value)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              isActive
                ? "border border-gray-600 bg-gray-700 text-white shadow-sm"
                : "text-gray-200 hover:text-gray-50 hover:bg-gray-800 border border-transparent"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

