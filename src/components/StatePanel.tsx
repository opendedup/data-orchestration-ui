"use client";

import { useCoAgent } from "@copilotkit/react-core";
import ToolVisualization from "./ToolVisualization";
import SessionInfo from "./SessionInfo";

export default function StatePanel() {
  const { state } = useCoAgent({
    name: "langgraph_orchestration_agent",
  });

  return (
    <div className="h-full flex flex-col overflow-y-auto p-6 text-gray-100">
      <h2 className="mb-4 text-xl font-bold text-gray-50">Agent State & Visualizations</h2>
      
      {/* Session Information */}
      <SessionInfo state={state} />
      
      {/* Tool Execution Status */}
      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-50">Tool Executions</h3>
        <ToolVisualization />
      </div>
      
      {/* State Details */}
      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-50">Session State</h3>
        <pre className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-4 text-xs text-gray-100">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
}

