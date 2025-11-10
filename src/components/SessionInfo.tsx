export default function SessionInfo({ state }: { state: any }) {
  return (
    <div
      className="rounded-lg border border-gray-700 p-4 text-gray-100"
      style={{ backgroundColor: "var(--surface-panel)" }}
    >
      <div className="space-y-2 text-sm text-gray-100">
        <div className="flex justify-between">
          <span className="text-gray-200">Current Mode:</span>
          <span className="font-semibold text-gray-50">{state?.current_mode || "ask"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-200">Planning Complete:</span>
          <span className="font-semibold text-gray-50">
            {state?.planning_complete ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-200">Action Step:</span>
          <span className="font-semibold text-gray-50">{state?.action_step || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}

