"use client";

import { useState } from "react";

interface ToolCall {
  name: string;
  status: "running" | "success" | "error";
  timestamp: Date;
  result?: string;
}

export default function ToolVisualization() {
  const [toolCalls] = useState<ToolCall[]>([]);

  // Monitor tool executions
  // This would integrate with CopilotKit's tool execution hooks

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-gray-800 text-gray-100 border border-gray-600";
      case "success":
        return "bg-emerald-600 text-white border border-emerald-400";
      case "error":
        return "bg-gray-900 text-red-300 border border-red-400";
      default:
        return "bg-gray-800 text-gray-200 border border-gray-600";
    }
  };

  return (
    <div className="space-y-2">
      {toolCalls.length === 0 ? (
        <p className="text-sm text-gray-200">No tool executions yet</p>
      ) : (
        toolCalls.map((call, idx) => (
          <div key={idx} className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-50">{call.name}</span>
              <span
                className={`rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusColor(
                  call.status
                )}`}
              >
                {call.status}
              </span>
            </div>
            {call.result && (
              <p className="mt-2 text-xs text-gray-200">{call.result}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

