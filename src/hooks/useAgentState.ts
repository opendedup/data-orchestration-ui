/**
 * Custom hook for managing Data Orchestration Agent state.
 * Provides access to queries, datasets, and query results from agent state.
 */

"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { useState, useEffect, useCallback } from "react";
import type {
  AgentState,
  Query,
  Dataset,
  QueryResult,
  StateItemType,
  TreeNode,
} from "@/types/agent-state";

/**
 * Hook return type with state data and update functions.
 */
interface UseAgentStateReturn {
  queries: Query[];
  datasets: Record<string, Dataset>;
  queryResults: QueryResult[];
  isLoading: boolean;
  error: string | null;
  treeData: TreeNode[];
  updateQuery: (index: number, updatedQuery: Partial<Query>) => Promise<void>;
  updateDataset: (tableId: string, updatedDataset: Partial<Dataset>) => Promise<void>;
  updateQueryResult: (index: number, updatedResult: Partial<QueryResult>) => Promise<void>;
  refreshState: () => void;
}

/**
 * Custom hook to access and manage agent state for ask mode.
 */
export function useAgentState(): UseAgentStateReturn {
  const { state } = useCoAgent({
    name: "data_orchestration_agent",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract state data with safe defaults
  const queries: Query[] = (state?.["user:queries"] as Query[]) || [];
  const datasets: Record<string, Dataset> = (state?.["user:datasets"] as Record<string, Dataset>) || {};
  const queryResults: QueryResult[] = (state?.["user:query_results"] as QueryResult[]) || [];

  // Register actions for updating state
  useCopilotAction({
    name: "update_query",
    description: "Update a query in the agent state",
    parameters: [
      {
        name: "index",
        type: "number",
        description: "Index of the query to update",
      },
      {
        name: "data",
        type: "object",
        description: "Updated query data",
      },
    ],
    handler: async ({ index, data }) => {
      const updatedQueries = [...queries];
      updatedQueries[index] = { ...updatedQueries[index], ...data };
      return `Updated query at index ${index}`;
    },
  });

  useCopilotAction({
    name: "update_dataset",
    description: "Update a dataset in the agent state",
    parameters: [
      {
        name: "table_id",
        type: "string",
        description: "Table ID of the dataset to update",
      },
      {
        name: "data",
        type: "object",
        description: "Updated dataset data",
      },
    ],
    handler: async ({ table_id, data }) => {
      const updatedDatasets = { ...datasets };
      updatedDatasets[table_id] = { ...updatedDatasets[table_id], ...data };
      return `Updated dataset ${table_id}`;
    },
  });

  useCopilotAction({
    name: "update_query_result",
    description: "Update a query result in the agent state",
    parameters: [
      {
        name: "index",
        type: "number",
        description: "Index of the query result to update",
      },
      {
        name: "data",
        type: "object",
        description: "Updated query result data",
      },
    ],
    handler: async ({ index, data }) => {
      const updatedResults = [...queryResults];
      updatedResults[index] = { ...updatedResults[index], ...data };
      return `Updated query result at index ${index}`;
    },
  });

  // Build tree structure from state data
  const buildTreeData = useCallback((): TreeNode[] => {
    const tree: TreeNode[] = [];

    // Queries folder
    if (queries.length > 0) {
      tree.push({
        id: "queries",
        label: `Queries (${queries.length})`,
        type: "queries",
        children: queries.map((query, index) => ({
          id: `query-${index}`,
          label: query.querysummary || `Query ${index + 1}`,
          type: "queries",
          timestamp: query.timestamp,
          data: query,
        })),
      });
    }

    // Datasets folder
    const datasetEntries = Object.entries(datasets);
    if (datasetEntries.length > 0) {
      tree.push({
        id: "datasets",
        label: `Datasets (${datasetEntries.length})`,
        type: "datasets",
        children: datasetEntries.map(([tableId, dataset]) => ({
          id: `dataset-${tableId}`,
          label: tableId.split(".").pop() || tableId,
          type: "datasets",
          timestamp: dataset.timestamp,
          data: dataset,
        })),
      });
    }

    // Query Results folder
    if (queryResults.length > 0) {
      tree.push({
        id: "query_results",
        label: `Query Results (${queryResults.length})`,
        type: "query_results",
        children: queryResults.map((result, index) => ({
          id: `result-${index}`,
          label: `Result ${index + 1}`,
          type: "query_results",
          timestamp: result.timestamp,
          data: result,
        })),
      });
    }

    return tree;
  }, [queries, datasets, queryResults]);

  const treeData = buildTreeData();

  // Update functions that trigger agent actions
  const updateQuery = async (index: number, updatedQuery: Partial<Query>) => {
    try {
      // In a real implementation, this would call the agent action
      // For now, we'll rely on the agent to update its own state
      console.log("Update query:", index, updatedQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update query");
    }
  };

  const updateDataset = async (tableId: string, updatedDataset: Partial<Dataset>) => {
    try {
      console.log("Update dataset:", tableId, updatedDataset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update dataset");
    }
  };

  const updateQueryResult = async (index: number, updatedResult: Partial<QueryResult>) => {
    try {
      console.log("Update query result:", index, updatedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update query result");
    }
  };

  const refreshState = useCallback(() => {
    setIsLoading(true);
    // State is automatically refreshed through CopilotKit
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  useEffect(() => {
    if (state) {
      setIsLoading(false);
    }
  }, [state]);

  return {
    queries,
    datasets,
    queryResults,
    isLoading,
    error,
    treeData,
    updateQuery,
    updateDataset,
    updateQueryResult,
    refreshState,
  };
}

