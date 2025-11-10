/**
 * Drop zone wrapper for Copilot composer that accepts dragged datasets.
 * Manages dropped dataset chips for visual feedback to users.
 * Dataset IDs are appended to the message text for the agent to process.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";

interface DroppedDataset {
  tableId: string;
  label: string;
  details: string;
}

export default function ComposerDropZone() {
  const [droppedDatasets, setDroppedDatasets] = useState<DroppedDataset[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const chipsContainerRef = useRef<HTMLDivElement>(null);
  const [inputElement, setInputElement] = useState<HTMLDivElement | null>(null);
  const hasVisibleChips = droppedDatasets.length > 0;

  // Locate the composer input element for portal rendering.
  useEffect(() => {
    let animationFrameId: number | null = null;

    const locateInput = () => {
      const element = document.querySelector<HTMLDivElement>(".copilotKitInput");
      if (element) {
        setInputElement(element);
      } else {
        animationFrameId = window.requestAnimationFrame(locateInput);
      }
    };

    locateInput();

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Ensure the textarea keeps its default padding regardless of chip presence.
  useEffect(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>(
      ".copilot-chat-container textarea"
    );

    if (textarea) {
      textarea.style.paddingTop = "";
    }

    return () => {
      if (textarea) {
        textarea.style.paddingTop = "";
      }
    };
  }, [hasVisibleChips, inputElement]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const jsonData = e.dataTransfer.getData("application/json");
      
      if (jsonData) {
        const dataset = JSON.parse(jsonData) as DroppedDataset;
        
        // Avoid duplicates
        if (!droppedDatasets.some((d) => d.tableId === dataset.tableId)) {
          setDroppedDatasets([...droppedDatasets, dataset]);
          
          // Append to the composer textarea
          const textarea = document.querySelector<HTMLTextAreaElement>(
            ".copilot-chat-container textarea"
          );
          
          if (textarea) {
            const currentValue = textarea.value;
            const newValue = currentValue
              ? `${currentValue}\n\nDataset: ${dataset.tableId}`
              : `Dataset: ${dataset.tableId}`;
            
            // Set value and trigger input event
            textarea.value = newValue;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            textarea.focus();
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse dropped dataset:", error);
    }
  };

  const handleRemoveChip = (tableId: string) => {
    const updatedDatasets = droppedDatasets.filter((d) => d.tableId !== tableId);
    setDroppedDatasets(updatedDatasets);
    
    // Remove from textarea
    const textarea = document.querySelector<HTMLTextAreaElement>(
      ".copilot-chat-container textarea"
    );
    if (textarea) {
      const currentValue = textarea.value;
      const pattern = new RegExp(`\\n?\\n?Dataset: ${tableId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g");
      const newValue = currentValue.replace(pattern, "").trim();
      textarea.value = newValue;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      
      // Reset padding if no chips remain
      if (updatedDatasets.length === 0) {
        textarea.style.paddingTop = "";
      }
    }
  };

  // Track when anything is being dragged in the window
  useEffect(() => {
    let dragCounter = 0;
    
    const handleWindowDragEnter = () => {
      dragCounter++;
      setIsDragOver(true);
    };
    
    const handleWindowDragLeave = () => {
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragOver(false);
      }
    };
    
    const handleWindowDrop = () => {
      dragCounter = 0;
      setIsDragOver(false);
    };
    
    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('dragend', handleWindowDrop);
    
    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('dragend', handleWindowDrop);
    };
  }, []);

  return (
    <>
      {/* Drop zone - only visible and active during drag operations */}
      {isDragOver && (
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0",
            "transition-colors duration-200 bg-blue-500/10"
          )}
          style={{ 
            height: "120px",
            zIndex: 100,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}
      
      {/* Chip list - rendered within the composer input */}
      {inputElement &&
        hasVisibleChips &&
        createPortal(
          <div ref={chipsContainerRef} className="composer-chip-region">
            <div className="composer-chip-row">
              {droppedDatasets.map((dataset) => (
                <div key={dataset.tableId} className="composer-chip">
                  <span className="composer-chip__label" title={dataset.tableId}>
                    {dataset.label}
                  </span>
                  <button
                    onClick={() => handleRemoveChip(dataset.tableId)}
                    className="composer-chip__remove"
                    aria-label={`Remove ${dataset.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>,
          inputElement
        )}

      {/* Drag over indicator message */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div
            className="px-6 py-3 rounded-lg text-sm font-medium border-2 border-dashed"
            style={{
              backgroundColor: "var(--copilot-kit-secondary-color)",
              color: "var(--copilot-kit-secondary-contrast-color)",
              borderColor: "var(--copilot-kit-primary-color)",
            }}
          >
            Drop dataset here to add to context
          </div>
        </div>
      )}
    </>
  );
}

