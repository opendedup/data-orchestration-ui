/**
 * API route for fetching and updating agent state.
 * Proxies requests to the data-orchestration-agent backend.
 */

import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.AGENT_URL || "http://localhost:8085";

/**
 * GET /api/agent-state - Fetch current agent state.
 */
export async function GET() {
  try {
    // The state is managed by CopilotKit and accessible through useCoAgent hook
    // This endpoint serves as a fallback for direct API access if needed
    return NextResponse.json({
      success: true,
      message: "Use useCoAgent hook from @copilotkit/react-core to access state directly",
    });
  } catch (error) {
    console.error("Error fetching agent state:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agent-state - Update agent state items.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: type, id, data",
        },
        { status: 400 }
      );
    }

    // State updates should be handled through CopilotKit actions
    // This endpoint can be used for direct updates if needed
    return NextResponse.json({
      success: true,
      message: "State updates should be handled through CopilotKit actions",
    });
  } catch (error) {
    console.error("Error updating agent state:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

