"use client";

import { useCoAgent } from "@copilotkit/react-core";
import ToolVisualization from "./ToolVisualization";
import SessionInfo from "./SessionInfo";

export default function StatePanel() {
  const { state } = useCoAgent({
    name: "data_orchestration_agent",
  });

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Agent State & Visualizations</h2>
      
      {/* Session Information */}
      <SessionInfo state={state} />
      
      {/* Tool Execution Status */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Tool Executions</h3>
        <ToolVisualization />
      </div>
      
      {/* State Details */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Session State</h3>
        <pre className="bg-white p-4 rounded-lg text-xs overflow-x-auto border">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
}

