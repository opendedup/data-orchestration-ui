export default function SessionInfo({ state }: { state: any }) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Mode:</span>
          <span className="font-semibold">{state?.current_mode || "ask"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Planning Complete:</span>
          <span className="font-semibold">
            {state?.planning_complete ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Action Step:</span>
          <span className="font-semibold">{state?.action_step || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}

