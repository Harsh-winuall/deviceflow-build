"use client";

import { createDoubleSplitPath } from "@/server/workflowActions/workflowById/workflowPaths";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { AppNode } from "../types/app-node";
import type { AppTaskType, TaskType } from "../types/task";
import {
  addNodeAfterNode,
  addNodeAfterPath,
  addNodeFromSplitPath,
  addSplitPathAfterPath,
} from "../utils/backend-actions";
import { useChangeStatusToDraft } from "./use-change-to-draft";
import { useNodePositions } from "./use-node-positions";
import { useInvalidateWorkflow } from "./use-invalidate-workflow";

export const useFlowActions = (workflow: any, nodes: AppNode[]) => {
  const { changeStatusToDraft } = useChangeStatusToDraft(workflow);
  const { invalidateWorkflow } = useInvalidateWorkflow(
    workflow.data.workflow._id
  );

  const {
    getPositionForNewNode,
    getPositionForPathNode,
    getPositionForSplitPath,
    getPositionForHandleNode,
  } = useNodePositions(nodes);

  const handleAddNode = useCallback(
    async (sourceNodeId: string, nodeType: TaskType, appType?: string) => {
      if (!workflow?.data) return;

      try {
        const newPosition = getPositionForNewNode(sourceNodeId);

        changeStatusToDraft();

        await addNodeAfterNode({
          sourceNodeId,
          nodeType,
          appType: appType as AppTaskType,
          position: newPosition,
          workflowId: workflow.data.workflow._id,
        });

        await invalidateWorkflow();
      } catch (error) {
        console.error("Error adding node:", error);
      }
    },
    [workflow, getPositionForNewNode, invalidateWorkflow]
  );

  const handleAddNodeForPath = useCallback(
    async (
      sourceNodeId: string,
      branchId: string,
      nodeType: TaskType,
      appType?: string
    ) => {
      if (!workflow?.data) return;

      try {
        // Find the path node to get its position
        const pathNode = nodes.find((n) => n.data.branchData?._id === branchId);
        const newPosition = pathNode
          ? getPositionForPathNode(pathNode.id)
          : getPositionForNewNode(sourceNodeId);

        changeStatusToDraft();

        await addNodeAfterPath({
          sourceNodeId,
          branchId,
          nodeType,
          appType: appType as AppTaskType,
          position: newPosition,
          workflowId: workflow.data.workflow._id,
        });

        await invalidateWorkflow();
      } catch (error) {
        console.error("Error adding node for path:", error);
      }
    },
    [
      workflow,
      nodes,
      getPositionForPathNode,
      getPositionForNewNode,
      invalidateWorkflow,
    ]
  );

  const handleAddSplitPath = useCallback(
    async (sourceNodeId: string) => {
      if (!workflow?.data) return;
      // console.log(workflow.data);
      try {
        const { splitPosition, pathAPosition, pathBPosition } =
          getPositionForSplitPath(sourceNodeId);

        changeStatusToDraft();

        await createDoubleSplitPath({
          branchPositions: [pathAPosition, pathBPosition],
          connectorPosition: splitPosition,
          prevNodeId: sourceNodeId,
          workflowId: workflow?.data?.workflow?._id,
        });

        await invalidateWorkflow();
      } catch (error) {
        console.error("Error adding split path:", error);
      }
    },
    [workflow, getPositionForSplitPath, invalidateWorkflow]
  );

  const handleAddSplitPathForPath = useCallback(
    async (
      sourceNodeId: string,
      branchId: string,
      nodeType: TaskType,
      splitAppName: string
    ) => {
      if (!workflow?.data) return;

      try {
        // Find the path node to get its position
        const pathNode = nodes.find((n) => n.data.branchData?._id === branchId);
        const connectorPosition = pathNode
          ? getPositionForPathNode(pathNode.id, { x: 300, y: -10 })
          : getPositionForNewNode(sourceNodeId, { x: 300, y: -10 });

        changeStatusToDraft();

        await addSplitPathAfterPath({
          sourceNodeId,
          branchId,
          nodeType,
          appType: splitAppName as AppTaskType,
          position: connectorPosition,
          workflowId: workflow.data.workflow._id,
        });

        await invalidateWorkflow();
      } catch (error) {
        console.error("Error adding split path for path:", error);
      }
    },
    [
      workflow,
      nodes,
      getPositionForPathNode,
      getPositionForNewNode,
      invalidateWorkflow,
    ]
  );

  const handleAddNodeFromHandle = useCallback(
    async (
      sourceNodeId: string,
      handleId: string,
      nodeType: TaskType,
      appType?: string,
      appPosition?: { x: number; y: number } | any
    ) => {
      if (!workflow?.data) return;

      try {
        // Count existing connections for this handle
        const existingConnections = nodes.filter(
          (node) =>
            node.data.branchData?.parentNodeId === sourceNodeId.split("-")[0] &&
            node.data.branchData?.branchDirection ===
              (handleId === "branch-0"
                ? "Top"
                : handleId === "branch-2"
                ? "Bottom"
                : "Right")
        ).length;

        const newPosition = getPositionForHandleNode(
          sourceNodeId,
          handleId,
          existingConnections,
          appPosition
        );

        let branchDirection: "Top" | "Bottom" | "Right";
        switch (handleId) {
          case "branch-0":
            branchDirection = "Top";
            break;
          case "branch-2":
            branchDirection = "Bottom";
            break;
          default:
            branchDirection = "Right";
        }

        changeStatusToDraft();

        await addNodeFromSplitPath({
          position: newPosition,
          sourceNodeId: sourceNodeId.split("-")[0], // Get the original node ID
          branchDirection,
          workflowId: workflow?.data?.workflow?._id,
        });

        await invalidateWorkflow();
      } catch (error) {
        console.error("Error adding node from handle:", error);
      }
    },
    [workflow, nodes, getPositionForHandleNode, invalidateWorkflow]
  );

  return {
    handleAddNode,
    handleAddNodeForPath,
    handleAddSplitPath,
    handleAddSplitPathForPath,
    handleAddNodeFromHandle,
  };
};
