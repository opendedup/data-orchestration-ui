"use client";

import { useState } from "react";
import StateTreeView from "@/components/StateTreeView";
import ContentEditor from "@/components/ContentEditor";
import ChatPanel from "@/components/ChatPanel";
import { useAgentState } from "@/hooks/useAgentState";
import type { StateItem } from "@/types/agent-state";

export default function Home() {
  const {
    treeData,
    updateQuery,
    updateDataset,
    updateQueryResult,
  } = useAgentState();

  const [selectedItem, setSelectedItem] = useState<StateItem | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectItem = (item: StateItem, type: string, id: string) => {
    setSelectedItem(item);
    setSelectedType(type);
    setSelectedId(id);
  };

  const handleSaveItem = async (type: string, id: string, data: Partial<StateItem>) => {
    try {
      if (type === "queries") {
        const index = parseInt(id.split("-")[1]);
        await updateQuery(index, data);
      } else if (type === "datasets") {
        const tableId = id.replace("dataset-", "");
        await updateDataset(tableId, data);
      } else if (type === "query_results") {
        const index = parseInt(id.split("-")[1]);
        await updateQueryResult(index, data);
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Panel: Tree View (25%) */}
      <div className="w-1/4 border-r border-gray-700 bg-gray-900 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-lg font-bold text-gray-100">Data Orchestration</h1>
          </div>
          <div className="flex-1 overflow-hidden">
            <StateTreeView
              treeData={treeData}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
            />
          </div>
        </div>
      </div>

      {/* Middle Panel: Content Editor (40%) */}
      <div className="w-2/5 border-r border-gray-700 overflow-hidden">
        <ContentEditor
          selectedItem={selectedItem}
          selectedType={selectedType}
          selectedId={selectedId}
          onSave={handleSaveItem}
        />
      </div>

      {/* Right Panel: Chat (35%) */}
      <div className="flex-1 overflow-hidden bg-gray-900">
        <ChatPanel />
      </div>
    </div>
  );
}
