"use client";

import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TaskType } from "../types/task";
import { useFlowContext } from "../hooks/use-flow-context";

interface SplitEdgeProps extends EdgeProps {
  data: {
    type: string;
    sourceHandle: string;
    canAddPath: boolean;
    isTopOrBottom: boolean;
    sourcePosition: any;
  };
}

const SplitEdgeComponent = (props: SplitEdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { handleAddNodeFromHandle } = useFlowContext();
  const { getEdges } = useReactFlow();

  // console.log(props, "@SPLIT_EDGE");

  const handleAddPathNode = useCallback(() => {
    if (!props.source || !props.data?.sourceHandle) return;

    handleAddNodeFromHandle(
      props.source.split("-")[0],
      props.sourceHandleId,
      TaskType.PATH,
      "",
      props?.data?.sourcePosition
    );
  }, [
    props.source,
    props.data?.sourceHandle,
    props.sourceHandleId,
    handleAddNodeFromHandle,
    props?.data?.sourcePosition,
  ]);

  // Memoize the edge check to prevent recalculation on every render
  const showPlusButton = useMemo(() => {
    if (!props.source || !props.data?.sourceHandle) return false;

    const allEdges = getEdges();
    const edgesFromSameHandle = allEdges
      .filter(
        (edge) =>
          edge.source === props.source &&
          edge.sourceHandle === props.data?.sourceHandle
      )
      .sort((a, b) => a.id.localeCompare(b.id));

    return edgesFromSameHandle[0]?.id === props.id;
  }, [props.source, props.data?.sourceHandle, props.id, getEdges]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      {showPlusButton && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="flex gap-1"
          >
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "w-6 h-6 p-0 border-none hover:text-[#0062FF] text-[#0062FF] bg-[#EDF4FF] rounded-full hover:bg-blue-50"
              )}
              onClick={handleAddPathNode}
              type="button"
            >
              <PlusIcon size={12} />
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// Custom comparison function for better performance
export const SplitEdge = memo(SplitEdgeComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.source === nextProps.source &&
    prevProps.target === nextProps.target &&
    prevProps.sourceX === nextProps.sourceX &&
    prevProps.sourceY === nextProps.sourceY &&
    prevProps.targetX === nextProps.targetX &&
    prevProps.targetY === nextProps.targetY &&
    prevProps.selected === nextProps.selected &&
    prevProps.data?.sourceHandle === nextProps.data?.sourceHandle &&
    prevProps.data?.canAddPath === nextProps.data?.canAddPath
  );
});
