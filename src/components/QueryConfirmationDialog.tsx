/**
 * Dialog component for confirming SQL query execution.
 * 
 * This component displays a confirmation dialog when the agent generates
 * a SQL query and pauses execution waiting for user approval.
 */

"use client";

import { useInterruptHandler } from "@/hooks/useInterruptHandler";
import { useEffect, useState } from "react";

/**
 * Modal dialog that appears when the agent interrupts for query confirmation.
 * 
 * Shows the query preview and provides Yes/No buttons for the user to
 * approve or reject the query execution.
 */
export default function QueryConfirmationDialog() {
  const { isInterrupted, interruptPayload, handleApprove, handleReject } = useInterruptHandler();
  const [isVisible, setIsVisible] = useState(false);

  // Show dialog when interrupt is detected
  useEffect(() => {
    if (isInterrupted) {
      setIsVisible(true);
    }
  }, [isInterrupted]);

  // Don't render anything if not visible or no payload
  if (!isVisible || !interruptPayload) {
    return null;
  }

  /**
   * Handle user confirmation - approve query execution.
   */
  const handleConfirm = async () => {
    await handleApprove();
    setIsVisible(false);
  };

  /**
   * Handle user cancellation - reject query execution.
   */
  const handleCancel = async () => {
    await handleReject();
    setIsVisible(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Dialog modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full pointer-events-auto border border-gray-700 animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h2
              id="dialog-title"
              className="text-xl font-semibold text-white flex items-center gap-2"
            >
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Confirm Query Execution
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            <p id="dialog-description" className="text-gray-300 text-base">
              {interruptPayload.message}
            </p>

            {/* Query preview */}
            {interruptPayload.query_preview && (
              <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">
                  Query Preview
                </p>
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
                  {interruptPayload.query_preview}
                </pre>
              </div>
            )}

            <div className="flex items-start gap-2 text-sm text-gray-400 bg-blue-900/20 border border-blue-800/30 rounded-md p-3">
              <svg
                className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                This query was generated automatically. Review it before execution.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors font-medium"
              aria-label="Reject query execution"
            >
              No, Don&apos;t Run
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium shadow-lg shadow-blue-600/20"
              aria-label="Approve query execution"
            >
              Yes, Run Query
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

