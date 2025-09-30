"use client";

import { type NodeProps } from "@xyflow/react";
import { memo, useMemo, useState } from "react";
import type { AppNodeData } from "../types/app-node";
import { TaskRegistry } from "../workflow/task/registry";
import { StartNode } from "./start-node";
import { AppNode } from "./app-node";
import { SplitNode } from "./split-node";
import { PathNode } from "./path-node";

export const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];

  // console.log(nodeData, "@MAIN_NODE_COMPONENT");

  // Dialog states
  type DialogType = "APP" | "INSTRUCTION" | "PATH" | "NOT_CONNECTED_APP" | null;
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  // Get proper handle IDs from task registry
  const getInputHandleId = () => {
    return task?.inputs?.[0]?.name || "input";
  };

  const getOutputHandleId = () => {
    return task?.outputs?.[0]?.name || "output";
  };

  // Handle node click to open dialogs
  const handleNodeClick = (nodeData?: any) => {
    // console.log(nodeData);

    if (
      nodeData?.appType !== "Instructions" &&
      nodeData?.type === "APP" &&
      nodeData?.appType !== "Device Flow" &&
      nodeData?.backendData?.isIntegrated === false
    ) {
      setOpenDialog("NOT_CONNECTED_APP");
      return;
    }

    if (nodeData?.type === "PATH") {
      setOpenDialog("PATH");
    }

    if (nodeData?.appType === "Instructions") {
      setOpenDialog("INSTRUCTION");
    } else if (
      nodeData?.appType !== "Instructions" &&
      nodeData?.type === "APP"
    ) {
      setOpenDialog("APP");
    }
  };

  const closeDialog = () => setOpenDialog(null);

  const nodeProps = useMemo(
    () => ({
      props,
      nodeData,
      getOutputHandleId,
      getInputHandleId,
    }),
    [props, nodeData, getOutputHandleId, getInputHandleId]
  );

  switch (task) {
    case TaskRegistry.START:
      return <StartNode {...nodeProps} />;

    case TaskRegistry.APP:
      return (
        <AppNode
          {...nodeProps}
          openDialog={openDialog}
          closeDialog={closeDialog}
          handleNodeClick={handleNodeClick}
        />
      );

    case TaskRegistry.SPLIT:
      return <SplitNode {...nodeProps} />;

    case TaskRegistry.PATH:
      return (
        <PathNode
          {...nodeProps}
          openDialog={openDialog}
          closeDialog={closeDialog}
          handleNodeClick={handleNodeClick}
        />
      );

    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
});

NodeComponent.displayName = "NodeComponent";
