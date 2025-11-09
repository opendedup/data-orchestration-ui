/**
 * Tree view component for displaying agent state (queries, datasets, query results).
 * Displays collapsible folders with items that can be selected for viewing/editing.
 */

"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, Database, Table } from "lucide-react";
import type { TreeNode, StateItem } from "@/types/agent-state";
import clsx from "clsx";

interface StateTreeViewProps {
  treeData: TreeNode[];
  selectedItem: StateItem | null;
  onSelectItem: (item: StateItem, type: string, id: string) => void;
}

/**
 * Individual tree node component with collapse/expand functionality.
 */
function TreeNodeItem({
  node,
  level = 0,
  selectedId,
  onSelect,
}: {
  node: TreeNode;
  level?: number;
  selectedId: string | null;
  onSelect: (item: StateItem, type: string, id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isFolder = hasChildren && !node.data;

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else if (node.data) {
      onSelect(node.data, node.type, node.id);
    }
  };

  const getIcon = () => {
    const sharedClasses = "w-4 h-4 text-gray-400";
    if (node.type === "datasets") {
      return <Database className={sharedClasses} />;
    }
    if (node.type === "query_results") {
      return <Table className={sharedClasses} />;
    }
    return <FileText className={sharedClasses} />;
  };

  return (
    <div>
      <div
        className={clsx(
          "flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded transition-colors",
          "hover:bg-gray-700",
          isSelected && "bg-gray-600",
          !isFolder && "ml-4"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            className="p-0.5 hover:bg-gray-600 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        {getIcon()}
        <span
          className={clsx(
            "flex-1 text-sm truncate",
            isFolder ? "font-semibold text-gray-200" : "text-gray-300"
          )}
        >
          {node.label}
        </span>
        {node.timestamp && (
          <span className="text-xs text-gray-500">
            {new Date(node.timestamp).toLocaleDateString()}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Main tree view component.
 */
export default function StateTreeView({
  treeData,
  selectedItem,
  onSelectItem,
}: StateTreeViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (item: StateItem, type: string, id: string) => {
    setSelectedId(id);
    onSelectItem(item, type, id);
  };

  if (treeData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center text-gray-400">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No data yet</p>
          <p className="text-xs mt-1">Start exploring datasets in Ask Mode</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-2">
      <div className="mb-3 px-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Ask Mode State
        </h3>
      </div>
      <div className="space-y-1">
        {treeData.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}

