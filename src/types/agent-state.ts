/**
 * TypeScript types for Data Orchestration Agent state management.
 * These types match the state schema stored in the agent's memory.
 */

/**
 * Represents a SQL query executed by the agent.
 */
export interface Query {
  query: string;
  querysummary: string;
  timestamp: string;
  question: string;
}

/**
 * Represents metadata and details about a BigQuery dataset/table.
 */
export interface Dataset {
  table_id: string;
  details: string; // Markdown formatted content
  timestamp: string;
}

/**
 * Represents the result of a query execution.
 */
export interface QueryResult {
  query: string;
  timestamp: string;
  result: string; // Markdown formatted table/results
}

/**
 * Complete agent state structure for ask mode.
 */
export interface AgentState {
  "user:queries": Query[];
  "user:datasets": Record<string, Dataset>;
  "user:query_results": QueryResult[];
}

/**
 * Type discriminator for different state item types.
 */
export type StateItemType = "queries" | "datasets" | "query_results";

/**
 * Union type for all possible state items.
 */
export type StateItem = Query | Dataset | QueryResult;

/**
 * Tree node structure for the state tree view.
 */
export interface TreeNode {
  id: string;
  label: string;
  type: StateItemType;
  timestamp?: string;
  data?: StateItem;
  children?: TreeNode[];
}

/**
 * Props for state update operations.
 */
export interface StateUpdateRequest {
  type: StateItemType;
  id: string;
  data: Partial<StateItem>;
}

/**
 * Response from state fetch operations.
 */
export interface StateResponse {
  success: boolean;
  data?: AgentState;
  error?: string;
}

