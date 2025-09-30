import { AppNode } from "../types/app-node";
import { AppTaskType, TaskType } from "../types/task";

export function CreateFlowNode({
  appType,
  pathName = "",
  nodeType,
  position,
}: {
  nodeType: TaskType;
  pathName?: string;
  appType?: AppTaskType;
  position?: { x: number; y: number };
}): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "Node",
    data: {
      type: nodeType,
      pathName: pathName,
      appType: appType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
}
