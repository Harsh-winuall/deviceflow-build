"use client";

import { memo } from "react";
import { NormalEdge } from "../edges/normal-edge";
import { SplitEdge } from "../edges/split-edge";
import { EdgeType } from "../types/edge";

// Memoized edge components
const MemoizedNormalEdge = memo(NormalEdge);
const MemoizedSplitEdge = memo(SplitEdge);

export const edgeTypes = {
  [EdgeType.NORMAL]: MemoizedNormalEdge,
  [EdgeType.SPLIT]: MemoizedSplitEdge,
};
