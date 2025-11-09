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
        return "bg-gray-700 text-gray-200";
      case "success":
        return "bg-gray-600 text-gray-100";
      case "error":
        return "bg-gray-800 text-red-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div className="space-y-2">
      {toolCalls.length === 0 ? (
        <p className="text-gray-500 text-sm">No tool executions yet</p>
      ) : (
        toolCalls.map((call, idx) => (
          <div key={idx} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-gray-100">{call.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(call.status)}`}>
                {call.status}
              </span>
            </div>
            {call.result && (
              <p className="text-xs text-gray-300 mt-2">{call.result}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

