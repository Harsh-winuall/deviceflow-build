"use client";

import { useCallback, useMemo } from "react";
import { TaskType } from "../types/task"; // Import TaskType from the correct path

// Stable callback hooks to prevent unnecessary re-renders
export const useStableCallbacks = (edges: any[]) => {
  const hasOutgoingConnection = useCallback(
    (nodeId: string, nodeType: TaskType) => {
      const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
      if (nodeType === TaskType.SPLIT) {
        return false; // Always show add button for split nodes
      }
      return outgoingEdges.length > 0;
    },
    [edges]
  );

  const hasConnectionFromHandle = useCallback(
    (nodeId: string, handleId: string) => {
      return edges.some(
        (edge) => edge.source === nodeId && edge.sourceHandle === handleId
      );
    },
    [edges]
  );

  const getConnectionCount = useCallback(
    (nodeId: string) => {
      return edges.filter((edge) => edge.source === nodeId).length;
    },
    [edges]
  );

  return useMemo(
    () => ({
      hasOutgoingConnection,
      hasConnectionFromHandle,
      getConnectionCount,
    }),
    [hasOutgoingConnection, hasConnectionFromHandle, getConnectionCount]
  );
};
