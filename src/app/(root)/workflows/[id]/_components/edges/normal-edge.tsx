"use client";

import { BaseEdge, type EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { memo } from "react";

const NormalEdgeComponent = (props: EdgeProps) => {
  const [edgePath] = getSmoothStepPath(props);

  // console.log(props, "@EDGE");

  return (
    <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style} />
  );
};

// Only re-render if props actually change
export const NormalEdge = memo(NormalEdgeComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.source === nextProps.source &&
    prevProps.target === nextProps.target &&
    prevProps.sourceX === nextProps.sourceX &&
    prevProps.sourceY === nextProps.sourceY &&
    prevProps.targetX === nextProps.targetX &&
    prevProps.targetY === nextProps.targetY &&
    prevProps.selected === nextProps.selected
  );
});
