/**
 * Content editor component for viewing and editing selected state items.
 * Supports markdown editing with live preview.
 */

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Save, Edit2, Eye, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { StateItem, Query, Dataset, QueryResult } from "@/types/agent-state";
import clsx from "clsx";

// Dynamically import markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface ContentEditorProps {
  selectedItem: StateItem | null;
  selectedType: string | null;
  selectedId: string | null;
  onSave: (type: string, id: string, data: Partial<StateItem>) => void;
}

/**
 * Main content editor component.
 */
export default function ContentEditor({
  selectedItem,
  selectedType,
  selectedId,
  onSave,
}: ContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedMetadata, setEditedMetadata] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedItem) {
      // Initialize content based on item type
      if (selectedType === "queries") {
        const query = selectedItem as Query;
        setEditedContent(query.query || "");
        setEditedMetadata({
          querysummary: query.querysummary || "",
          question: query.question || "",
        });
      } else if (selectedType === "datasets") {
        const dataset = selectedItem as Dataset;
        setEditedContent(dataset.details || "");
        setEditedMetadata({
          table_id: dataset.table_id || "",
        });
      } else if (selectedType === "query_results") {
        const result = selectedItem as QueryResult;
        setEditedContent(result.result || "");
        setEditedMetadata({
          query: result.query || "",
        });
      }
    }
  }, [selectedItem, selectedType]);

  const handleSave = () => {
    if (!selectedType || !selectedId) return;

    let updatedData: Partial<StateItem> = {};

    if (selectedType === "queries") {
      updatedData = {
        query: editedContent,
        querysummary: editedMetadata.querysummary,
        question: editedMetadata.question,
      } as Partial<Query>;
    } else if (selectedType === "datasets") {
      updatedData = {
        details: editedContent,
        table_id: editedMetadata.table_id,
      } as Partial<Dataset>;
    } else if (selectedType === "query_results") {
      updatedData = {
        result: editedContent,
        query: editedMetadata.query,
      } as Partial<QueryResult>;
    }

    onSave(selectedType, selectedId, updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original content
    if (selectedItem) {
      if (selectedType === "queries") {
        setEditedContent((selectedItem as Query).query);
      } else if (selectedType === "datasets") {
        setEditedContent((selectedItem as Dataset).details);
      } else if (selectedType === "query_results") {
        setEditedContent((selectedItem as QueryResult).result);
      }
    }
  };

  if (!selectedItem) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-panel)" }}
      >
        <div className="text-center text-gray-400">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No item selected</p>
          <p className="text-sm mt-2">Select an item from the tree to view or edit</p>
        </div>
      </div>
    );
  }

  const renderMetadata = () => {
    const item = selectedItem as any;
    return (
      <div
        className="border-b border-gray-700 p-4"
        style={{ backgroundColor: "var(--surface-panel)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-100">
            {selectedType === "queries" && "Query"}
            {selectedType === "datasets" && "Dataset"}
            {selectedType === "query_results" && "Query Result"}
          </h2>
          <div className="flex items-center gap-2">
            {item.timestamp && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            )}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-500 text-gray-100 rounded transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-300 hover:bg-gray-200 text-gray-900 rounded transition-colors"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Metadata fields */}
        {selectedType === "queries" && (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Question</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedMetadata.question || ""}
                  onChange={(e) =>
                    setEditedMetadata({ ...editedMetadata, question: e.target.value })
                  }
                  className="w-full px-2 py-1 text-sm bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-200">{item.question}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Summary</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedMetadata.querysummary || ""}
                  onChange={(e) =>
                    setEditedMetadata({ ...editedMetadata, querysummary: e.target.value })
                  }
                  className="w-full px-2 py-1 text-sm bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-200">{item.querysummary}</p>
              )}
            </div>
          </div>
        )}

        {selectedType === "datasets" && (
          <div>
            <label className="text-xs text-gray-400 block mb-1">Table ID</label>
            <p className="text-sm text-gray-200 font-mono">{item.table_id}</p>
          </div>
        )}

        {selectedType === "query_results" && (
          <div>
            <label className="text-xs text-gray-400 block mb-1">Query</label>
            <p className="text-sm text-gray-200 font-mono truncate">{item.query}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: "var(--surface-panel)" }}
    >
      {renderMetadata()}

      <div className="flex-1 overflow-y-auto p-4">
        {isEditing ? (
          <div className="h-full" data-color-mode="dark">
            <MDEditor
              value={editedContent}
              onChange={(val) => setEditedContent(val || "")}
              height="100%"
              preview="live"
              className="markdown-editor"
            />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {selectedType === "queries" ? (
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                <code className="text-gray-200">{editedContent}</code>
              </pre>
            ) : (
              <ReactMarkdown
                components={{
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-700" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-gray-700 px-4 py-2 bg-gray-800" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-gray-700 px-4 py-2" {...props} />
                  ),
                }}
              >
                {editedContent}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

