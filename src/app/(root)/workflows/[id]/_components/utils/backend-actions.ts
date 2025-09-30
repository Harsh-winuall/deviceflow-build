import {
  createApp,
  CreateWorkflowAppPayload,
  WorkflowNode,
} from "@/server/workflowActions/workflowById/workflowNodes";
import {
  createDoubleSplitPath,
  createSingleSplitPath,
  updatePathNameOrNextNode,
} from "@/server/workflowActions/workflowById/workflowPaths";
import { AppTaskType, TaskType } from "../types/task";

// Create a new app node through backend API
export const createAppNode = async ({
  workflowId,
  appType,
  position,
  description = "New app node",
}: {
  workflowId: string;
  appType: AppTaskType;
  position: { x: number; y: number };
  description?: string;
}): Promise<WorkflowNode> => {
  const payload: CreateWorkflowAppPayload = {
    appName: appType,
    position,
    workflowId,
    description: "",
  };

  return await createApp({ payload });
};

// Create instruction node (similar to app but different template)
export const createInstructionNode = async ({
  workflowId,
  position,
  appName,
  description = "New instruction node",
}: {
  workflowId: string;
  appName: string;
  position: { x: number; y: number };
  description?: string;
}) => {
  const payload: CreateWorkflowAppPayload = {
    appName, // Backend should handle this
    position,
    workflowId,
    description: "",
  };

  return await createApp({ payload });
};

// Connect two nodes by creating a single split path
export const connectNodes = async ({
  sourceNodeId,
  targetNodeId,
  branchPosition,
  workflowId,
}: {
  sourceNodeId: string;
  targetNodeId: string;
  branchPosition: { x: number; y: number };
  workflowId: string;
}) => {
  // console.log("add node 2 params: ", {
  //   sourceNodeId,
  //   targetNodeId,
  //   branchPosition,
  // });
  // Create single split path
  const splitPathResult = await createSingleSplitPath({
    prevNodeId: sourceNodeId,
    branchPositions: [branchPosition],
    workflowId: workflowId,
    isDirectConnection: true,
  });

  // console.log("add node 2 res: ", splitPathResult);

  // Update the path to connect to target node
  await updatePathNameOrNextNode({
    nodeId: sourceNodeId,
    nextNodeId: targetNodeId,
    branchId: splitPathResult.newBranches[0].branchId, // here we need branchId
  });

  return splitPathResult;
};

// Create split path with multiple branches
export const createSplitPath = async ({
  sourceNodeId,
  connectorPosition,
  branchPositions,
  workflowId,
}: {
  sourceNodeId: string;
  workflowId: string;
  connectorPosition: { x: number; y: number };
  branchPositions: Array<{ x: number; y: number }>;
}) => {
  return await createDoubleSplitPath({
    prevNodeId: sourceNodeId,
    branchPositions,
    workflowId,
    connectorPosition,
  });
};

// Add node after another node
export const addNodeAfterNode = async ({
  sourceNodeId,
  nodeType,
  appType,
  position,
  workflowId,
}: {
  sourceNodeId: string;
  nodeType: TaskType;
  appType?: AppTaskType;
  position: { x: number; y: number };
  workflowId: string;
}) => {
  let newNode: WorkflowNode;
  // console.log("add node 1 params: ", {
  //   sourceNodeId,
  //   nodeType,
  //   appType,
  //   position,
  //   workflowId,
  // });

  // Create the appropriate node type
  if (nodeType === TaskType.APP && appType) {
    newNode = await createAppNode({
      workflowId,
      appType,
      position,
      description: `New ${appType} node`,
    });
  } else if (nodeType === TaskType.INSTRUCTION && appType) {
    newNode = await createInstructionNode({
      workflowId,
      appName: appType,
      position,
      description: "New instruction node",
    });
  } else {
    throw new Error("Unsupported node type");
  }

  // console.log("add node 1 res: ", newNode);

  // Connect the nodes
  await connectNodes({
    sourceNodeId,
    workflowId: workflowId,
    targetNodeId: newNode._id,
    branchPosition: position,
  });

  return newNode;
};

export const addNodeAfterPath = async ({
  sourceNodeId,
  branchId,
  nodeType,
  appType,
  position,
  workflowId,
}: {
  sourceNodeId: string;
  branchId: string;
  nodeType: TaskType;
  appType?: AppTaskType;
  position: { x: number; y: number };
  workflowId: string;
}) => {
  let newNode: WorkflowNode;
  // console.log("add node 1 params: ", {
  //   sourceNodeId,
  //   branchId,
  //   nodeType,
  //   appType,
  //   position,
  //   workflowId,
  // });

  // Create the appropriate node type
  if (nodeType === TaskType.APP && appType) {
    newNode = await createAppNode({
      workflowId,
      appType,
      position,
      description: `New ${appType} node`,
    });
  } else if (nodeType === TaskType.INSTRUCTION && appType) {
    newNode = await createInstructionNode({
      workflowId,
      appName: appType,
      position,
      description: "New instruction node",
    });
  } else {
    throw new Error("Unsupported node type");
  }

  // console.log("add node 1 res: ", newNode);

  await updatePathNameOrNextNode({
    nodeId: sourceNodeId,
    nextNodeId: newNode._id,
    branchId: branchId,
  });

  return newNode;
};

export const addNodeFromSplitPath = async ({
  sourceNodeId,
  branchDirection,
  position,
  workflowId,
}: {
  sourceNodeId: string;
  branchDirection: "Top" | "Bottom" | "Right";
  position: { x: number; y: number };
  workflowId: string;
}) => {
  // let newNode: WorkflowNode;
  // console.log("add node 1 params: ", {
  //   sourceNodeId,
  //   position,
  //   branchDirection,
  // });

  const splitPathResult = await createSingleSplitPath({
    prevNodeId: sourceNodeId,
    branchPositions: [position],
    branchDirection,
    workflowId,
  });

  return splitPathResult;
};

// Add split path after a node
export const addSplitPathAfterPath = async ({
  sourceNodeId,
  branchId,
  nodeType,
  appType,
  position: connectorPosition,
  workflowId,
}: {
  sourceNodeId: string;
  branchId: string;
  nodeType: TaskType;
  appType?: AppTaskType;
  position: { x: number; y: number };
  workflowId: string;
}) => {
  // console.log("add node 1 params: ", {
  //   sourceNodeId,
  //   branchId,
  //   nodeType,
  //   appType,
  //   position: connectorPosition,
  //   workflowId,
  // });

  const newNode = await createAppNode({
    workflowId,
    appType,
    position: connectorPosition,
    description: `New ${appType} node`,
  });

  // console.log("add node 1 res: ", newNode);

  await updatePathNameOrNextNode({
    nodeId: sourceNodeId,
    nextNodeId: newNode._id,
    branchId: branchId,
  });

  const branchPositions = [
    {
      x: connectorPosition.x + 100,
      y: connectorPosition.y - 150,
    },
    {
      x: connectorPosition.x + 100,
      y: connectorPosition.y + 150,
    },
  ];

  return await createSplitPath({
    sourceNodeId: newNode._id,
    connectorPosition,
    branchPositions,
    workflowId,
  });
};
