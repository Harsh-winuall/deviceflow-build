"use client";

import type React from "react";

import { type WorkflowTreeResponse } from "@/server/workflowActions/workflow";
import {
  updateConnectorPosition,
  updateNodePosition,
  updatePathPosition,
} from "@/server/workflowActions/workflowById/workflowPositions";
import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo } from "react";
import { edgeTypes } from "./edges";
import { useFlowActions } from "./hooks/use-flow-actions";
import { FlowContextProvider } from "./hooks/use-flow-context";
import { useStableCallbacks } from "./hooks/use-stable-callbacks";
import { nodeTypes } from "./nodes";
import type { AppNode } from "./types/app-node";
import { TaskType } from "./types/task";
import { transformBackendToReactFlow } from "./utils/data-transformer";
import type { BackendWorkflowResponse } from "./utils/types";

const snapGrid: [number, number] = [20, 20];
const proOptions = { hideAttribution: true };
const fitViewOptions = { padding: 1 };
const defaultEdgeOptions = { animated: false, deletable: false };
const panOnDrag = [1, 2];

interface FlowEditorProps {
  workflow: WorkflowTreeResponse;
  searchResults: string[];
}

export const FlowEditor = ({ workflow, searchResults }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  const workflowData = useMemo(() => {
    return {
      workflowId: workflow?.data?.workflow?._id,
      status: workflow?.data?.workflow?.status,
    };
  }, [workflow]);

  // Use stable callbacks
  const stableCallbacks = useStableCallbacks(edges);

  // Flow actions with memoization
  const flowActions = useFlowActions(workflow, nodes);

  const { transformedNodes, transformedEdges } = useMemo(() => {
    if (!workflow?.data) return { transformedNodes: [], transformedEdges: [] };
    try {
      const backendData = workflow.data;
      const { nodes: transformedNodes, edges: transformedEdges } =
        transformBackendToReactFlow(
          backendData as unknown as BackendWorkflowResponse
        );
      return { transformedNodes, transformedEdges };
    } catch (error) {
      console.error("Error transforming workflow data:", error);
      return { transformedNodes: [], transformedEdges: [] };
    }
  }, [workflow?.data]);

  const highlightedNodes = useMemo(() => {
    return transformedNodes.map((node) => {
      const isHighlighted = searchResults.includes(node.id);
      return {
        ...node,
        data: {
          ...node.data,
          isHighlighted,
        },
        style: {
          ...node.style,
          ...(isHighlighted && {
            border: "2px solid #22C55E", // green-500
            background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
            borderRadius: "12px",
          }),
        },
      };
    });
  }, [transformedNodes, searchResults]);

  // Handle node drag end - update positions via API and change status to draft
  const onNodeDragStop = useCallback(
    async (event: React.MouseEvent, node: AppNode): Promise<void> => {
      // Change status to draft when node is moved

      const nodeData = node.data;
      try {
        switch (nodeData.type) {
          case TaskType.APP:
          case TaskType.START:
          case TaskType.INSTRUCTION:
            // Regular node position update
            await updateNodePosition({
              nodeId: node.id,
              position: node.position,
            });
            break;
          case TaskType.SPLIT:
            // Split node - update connector position
            // Get the parent node ID from splitData
            const parentNodeId =
              nodeData.splitData?._id || nodeData.backendData?.parentNodeId;
            if (parentNodeId) {
              await updateConnectorPosition({
                nodeId: parentNodeId,
                connectorPosition: node.position,
              });
            }
            break;
          case TaskType.PATH:
            // Path node - update branch position
            const branchData = nodeData.branchData;
            const pathParentNodeId =
              branchData?.parentNodeId || nodeData.backendData?.parentNodeId;
            const branchId = branchData?._id;
            if (pathParentNodeId && branchId) {
              await updatePathPosition({
                nodeId: pathParentNodeId,
                branchId: branchId,
                branchPosition: node?.position,
              });
            }
            break;
          default:
            console.warn(
              "Unknown node type for position update:",
              nodeData.type
            );
        }
      } catch (error) {
        console.error("Error updating node position:", error);
        // Optionally show a toast notification here
      }
    },
    []
  );

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      ...flowActions,
      ...stableCallbacks,
      searchResults,
      workflowData,
    }),
    [flowActions, stableCallbacks, searchResults, workflowData]
  );

  // Update the useEffect to use highlightedNodes
  useEffect(() => {
    if (!transformedNodes?.length) return;
    // If there's an active search, zoom to matched nodes
    if (searchResults?.length > 0) {
      const matchedNodes = transformedNodes.filter((node) =>
        searchResults.includes(node.id)
      );
      if (matchedNodes.length > 0) {
        fitView({ nodes: matchedNodes, padding: 0.7, duration: 500 });
      }
    } else {
      fitView({ nodes: transformedNodes, padding: 0.7, duration: 500 });
    }

    setNodes(highlightedNodes);
    setEdges(transformedEdges as unknown as Edge[]);
  }, [
    highlightedNodes,
    transformedEdges,
    setNodes,
    setEdges,
    fitView,
    searchResults,
  ]);

  return (
    <main className="h-full w-full">
      <FlowContextProvider value={contextValue}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          panOnScroll
          panOnDrag={true}
          proOptions={proOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid
          snapGrid={snapGrid}
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          preventScrolling={true}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls fitViewOptions={fitViewOptions} />
        </ReactFlow>
      </FlowContextProvider>
    </main>
  );
};
