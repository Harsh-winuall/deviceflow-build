"use client";

import { cn } from "@/lib/utils";
import { PlayCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import { NodeCard } from "./node-card";

import { useFlowContext } from "../hooks/use-flow-context";
import { AddButton } from "./buttons/add-button";

export const StartNode = memo(({ props, nodeData, getOutputHandleId }: any) => {
  const { hasOutgoingConnection } = useFlowContext();
  // console.log(nodeData, "@START_NODE");

  return (
    <div className="relative">
      <NodeCard
        className="bg-[#DEF4E0] w-fit py-1.5 px-3 border border-[#0C941C]"
        nodeId={props.id}
        isSelected={!!props.selected}
      >
        <div className="flex items-center gap-1.5 text-[#0C941C]">
          <HugeiconsIcon icon={PlayCircleIcon} size={16} />
          Start
        </div>

        <Handle
          id={getOutputHandleId()}
          type="source"
          position={Position.Right}
          className={cn(
            "!bg-[#0062FF] !ring-2 !ring-[#D4E4FF] !-right-0 !w-2.5 !h-2.5",
            !hasOutgoingConnection(props.id, nodeData.type) && "invisible"
          )}
        />
      </NodeCard>

      {/* Always show add button for start node */}
      {!hasOutgoingConnection(props.id, nodeData.type) && (
        <AddButton
          className="-right-8 top-1/2 -translate-y-1/2"
          nodeData={nodeData}
        />
      )}
    </div>
  );
});
