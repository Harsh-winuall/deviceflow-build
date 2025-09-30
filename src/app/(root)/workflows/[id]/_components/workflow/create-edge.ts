import { type EdgeData, EdgeType } from "../types/edge";

export interface CreateEdgeParams {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  edgeType?: EdgeType;
}

export function CreateFlowEdge({
  source,
  target,
  sourceHandle,
  targetHandle,
  edgeType = EdgeType.NORMAL,
}: CreateEdgeParams): EdgeData {
  const isTopOrBottom =
    sourceHandle === "branch-0" || sourceHandle === "branch-2";

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substr(2, 9);
  return {
    // id: `${source}-to-${target}`,
    id: `${source}-${
      sourceHandle || "default"
    }-${target}-${timestamp}-${randomSuffix}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: isTopOrBottom ? EdgeType.SPLIT : EdgeType.NORMAL,
    animated: false,
    data: {
      type: isTopOrBottom ? EdgeType.SPLIT : EdgeType.NORMAL,
      sourceHandle,
      canAddPath: isTopOrBottom,
      isTopOrBottom,
    },
  };
}
