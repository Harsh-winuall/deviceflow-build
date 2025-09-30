import { Edge } from "@xyflow/react";

export enum EdgeType {
  NORMAL = "NORMAL",
  SPLIT = "SPLIT",
}

export interface EdgeData extends Edge {
  type: EdgeType;
  sourceHandle?: string;
  canAddPath?: boolean;
  isTopOrBottom?: boolean;
}
