"use client";

import { memo } from "react";
import { NodeComponent } from "../nodes/node-component";

// Memoized node types to prevent recreation on every render
export const MemoizedNodeComponent = memo(NodeComponent);

export const nodeTypes = {
  Node: MemoizedNodeComponent,
};
