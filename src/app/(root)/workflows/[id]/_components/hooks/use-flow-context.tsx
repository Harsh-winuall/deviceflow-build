import { createContext, useContext, useMemo } from "react";
import { TaskType } from "../types/task";

interface FlowContextType {
  handleAddNode: (
    sourceNodeId: string,
    nodeType: TaskType,
    appType?: string
  ) => void;
  handleAddNodeForPath: (
    sourceNodeId: string,
    branchId: string,
    nodeType: TaskType,
    appType?: string
  ) => void;
  handleAddSplitPath: (sourceNodeId: string) => void;
  handleAddSplitPathForPath: (
    sourceNodeId: string,
    branchId: string,
    nodeType: TaskType,
    splitAppName: string
  ) => void;
  handleAddNodeFromHandle: (
    sourceNodeId: string,
    handleId: string,
    nodeType: TaskType,
    appType?: string,
    appPosition?: any
  ) => void;
  searchResults?: string[];
  hasOutgoingConnection: (nodeId: string, nodeType: TaskType) => boolean;
  getConnectionCount: (nodeId: string) => number;
  hasConnectionFromHandle: (nodeId: string, handleId: string) => boolean;
  workflowData?: { workflowId: string; status: string };
}

export const FlowContext = createContext<FlowContextType | null>(null);

interface FlowContextProviderProps {
  children: React.ReactNode;
  value: FlowContextType;
}

export const FlowContextProvider = ({
  children,
  value,
}: FlowContextProviderProps) => {
  const memoizedValue = useMemo(
    () => value,
    [
      value.handleAddNode,
      value.handleAddNodeForPath,
      value.handleAddSplitPath,
      value.handleAddSplitPathForPath,
      value.handleAddNodeFromHandle,
      value.hasOutgoingConnection,
      value.getConnectionCount,
      value.hasConnectionFromHandle,
      // value.searchResults, // Removed to fix lint/correctness/useExhaustiveDependencies error
      value.workflowData,
    ]
  );

  return (
    <FlowContext.Provider value={memoizedValue}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within FlowContext.Provider");
  }
  return context;
};
