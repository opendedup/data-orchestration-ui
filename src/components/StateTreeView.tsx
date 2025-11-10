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
  const [isDragging, setIsDragging] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isFolder = hasChildren && !node.data;
  const isDataset = node.type === "datasets" && node.data && !isFolder;

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else if (node.data) {
      onSelect(node.data, node.type, node.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!isDataset || !node.data) return;
    
    setIsDragging(true);
    const dataset = node.data as { table_id?: string; details?: string };
    const dragData = {
      tableId: dataset.table_id || node.id,
      label: node.label,
      details: dataset.details || "",
    };
    
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.setData("text/plain", dragData.tableId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getIcon = () => {
    const sharedClasses = "w-4 h-4 text-gray-200";
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
          isSelected && "bg-gray-700",
          !isFolder && "ml-4",
          isDragging && "opacity-50",
          isDataset && "cursor-grab active:cursor-grabbing"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        draggable={isDataset}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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
              <ChevronDown className="w-4 h-4 text-gray-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-200" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        {getIcon()}
        <span
          className={clsx(
            "flex-1 text-sm truncate",
            isFolder ? "font-semibold text-gray-100" : "text-gray-100"
          )}
        >
          {node.label}
        </span>
        {node.timestamp && (
          <span className="text-xs text-gray-300">
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
  onSelectItem,
}: StateTreeViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (item: StateItem, type: string, id: string) => {
    setSelectedId(id);
    onSelectItem(item, type, id);
  };

  if (treeData.length === 0) {
    return (
      <div
        className="h-full flex items-center justify-center p-6"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="text-center text-gray-200">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-80" />
          <p className="text-sm text-gray-100">No data yet</p>
          <p className="text-xs mt-1 text-gray-200">Start exploring datasets in Ask Mode</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto p-2"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="mb-3 px-2" style={{ backgroundColor: "var(--background)" }}>
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wide">
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

