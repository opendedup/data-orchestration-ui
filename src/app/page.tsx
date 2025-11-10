"use client";

import { useRef, useState } from "react";
import StateTreeView from "@/components/StateTreeView";
import ContentEditor from "@/components/ContentEditor";
import ChatPanel from "@/components/ChatPanel";
import { useAgentState } from "@/hooks/useAgentState";
import type { StateItem } from "@/types/agent-state";

const TOTAL_PERCENT = 100;

const MIN_PANEL_WIDTHS = {
  left: 15,
  middle: 25,
  right: 20,
} as const;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const roundToTwo = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export default function Home() {
  const {
    treeData,
    updateQuery,
    updateDataset,
    updateQueryResult,
  } = useAgentState();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<StateItem | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelSizes, setPanelSizes] = useState<[number, number, number]>([15, 55, 30]);

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

  const handleResizeStart =
    (position: "left" | "right") => (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const handleElement = event.currentTarget;
      const pointerId = event.pointerId;
      const containerElement = containerRef.current;

      if (!containerElement) {
        return;
      }

      handleElement.setPointerCapture(pointerId);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const currentContainer = containerRef.current;
        if (!currentContainer) {
          return;
        }

        const rect = currentContainer.getBoundingClientRect();
        if (rect.width <= 0) {
          return;
        }

        const relativeX = moveEvent.clientX - rect.left;
        const percent = (relativeX / rect.width) * 100;

        if (position === "left") {
          setPanelSizes((current) => {
            const [, , right] = current;
            const available = TOTAL_PERCENT - right;
            const maxLeft = Math.max(
              MIN_PANEL_WIDTHS.left,
              available - MIN_PANEL_WIDTHS.middle,
            );
            let newLeft = clamp(percent, MIN_PANEL_WIDTHS.left, maxLeft);

            if (available - newLeft < MIN_PANEL_WIDTHS.middle) {
              newLeft = available - MIN_PANEL_WIDTHS.middle;
            }

            const normalizedRight = roundToTwo(right);
            const normalizedLeft = roundToTwo(newLeft);
            const normalizedMiddle = roundToTwo(
              TOTAL_PERCENT - normalizedRight - normalizedLeft,
            );

            return [normalizedLeft, normalizedMiddle, normalizedRight];
          });
        } else {
          setPanelSizes((current) => {
            const [left] = current;
            const minCombined = left + MIN_PANEL_WIDTHS.middle;
            const maxCombined = Math.max(
              minCombined,
              TOTAL_PERCENT - MIN_PANEL_WIDTHS.right,
            );
            const combined = clamp(percent, minCombined, maxCombined);

            let newMiddle = combined - left;
            if (newMiddle < MIN_PANEL_WIDTHS.middle) {
              newMiddle = MIN_PANEL_WIDTHS.middle;
            }

            let newRight = TOTAL_PERCENT - left - newMiddle;
            if (newRight < MIN_PANEL_WIDTHS.right) {
              newRight = MIN_PANEL_WIDTHS.right;
              newMiddle = TOTAL_PERCENT - left - newRight;
            }

            const normalizedLeft = roundToTwo(left);
            const normalizedMiddle = roundToTwo(newMiddle);
            const normalizedRight = roundToTwo(
              TOTAL_PERCENT - normalizedLeft - normalizedMiddle,
            );

            return [normalizedLeft, normalizedMiddle, normalizedRight];
          });
        }
      };

      const handlePointerStop = () => {
        if (handleElement.hasPointerCapture(pointerId)) {
          handleElement.releasePointerCapture(pointerId);
        }
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerStop);
        window.removeEventListener("pointercancel", handlePointerStop);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerStop);
      window.addEventListener("pointercancel", handlePointerStop);
    };

  return (
    <div ref={containerRef} className="flex h-screen bg-gray-900">
      {/* Left Panel: Tree View */}
      <div
        className="border-r border-gray-700 overflow-hidden"
        style={{
          backgroundColor: "var(--background)",
          flex: `0 0 ${panelSizes[0]}%`,
          minWidth: `${MIN_PANEL_WIDTHS.left}%`,
        }}
      >
        <div className="h-full flex flex-col">
          <div
            className="p-4 border-b border-gray-700"
            style={{ backgroundColor: "var(--background)" }}
          >
            <h1 className="text-lg font-bold text-gray-100">Data Orchestration</h1>
          </div>
          <div
            className="flex-1 overflow-hidden"
            style={{ backgroundColor: "var(--background)" }}
          >
            <StateTreeView
              treeData={treeData}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
            />
          </div>
        </div>
      </div>

      {/* Separator between Left and Middle */}
      <div className="relative z-20 flex-shrink-0" style={{ width: "0px" }}>
        <div
          aria-hidden="true"
          className="absolute top-0 -left-1 h-full w-2 cursor-col-resize rounded-full bg-transparent transition-colors hover:bg-gray-600/60"
          onPointerDown={handleResizeStart("left")}
        />
      </div>

      {/* Middle Panel: Content Editor */}
      <div
        className="border-r border-gray-700 overflow-hidden"
        style={{
          flex: `0 0 ${panelSizes[1]}%`,
          minWidth: `${MIN_PANEL_WIDTHS.middle}%`,
        }}
      >
        <ContentEditor
          selectedItem={selectedItem}
          selectedType={selectedType}
          selectedId={selectedId}
          onSave={handleSaveItem}
        />
      </div>

      {/* Separator between Middle and Right */}
      <div className="relative z-20 flex-shrink-0" style={{ width: "0px" }}>
        <div
          aria-hidden="true"
          className="absolute top-0 -left-1 h-full w-2 cursor-col-resize rounded-full bg-transparent transition-colors hover:bg-gray-600/60"
          onPointerDown={handleResizeStart("right")}
        />
      </div>

      {/* Right Panel: Chat */}
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: "var(--background)",
          flex: `0 0 ${panelSizes[2]}%`,
          minWidth: `${MIN_PANEL_WIDTHS.right}%`,
        }}
      >
        <ChatPanel />
      </div>
    </div>
  );
}
