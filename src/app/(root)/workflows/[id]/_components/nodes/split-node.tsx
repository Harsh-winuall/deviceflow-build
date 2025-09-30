"use client";

import { cn } from "@/lib/utils";
import { Delete01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Handle, Position } from "@xyflow/react";
import React, { memo, useState } from "react";
import { NodeCard } from "./node-card";
import { ConfirmationModal } from "@/app/(root)/workflows/[id]/_components/dropdowns/confirmation-popup";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { WorkFlowIcons } from "../../../_components/icons";
import { useFlowContext } from "../hooks/use-flow-context";
import { useSplitDeletion } from "../hooks/use-split-deletion";
import { TaskType } from "../types/task";

export const SplitNode = memo(({ props, nodeData, getInputHandleId }: any) => {
  const [splitDelete, setSplitDelete] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowDelete(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDelete(false);
    }, 200); // Adjust time here (200ms is good for moving cursor)
    setHoverTimeout(timeout);
  };

  const { handleAddNodeFromHandle, hasConnectionFromHandle } = useFlowContext();
  const { handleSplitDeletion } = useSplitDeletion(
    nodeData.backendData?.workflowId || ""
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NodeCard
        className={cn(
          !!props.selected && "border-[#0062FF] ring ring-[#D4E4FF]",
          "rounded-[10px] rotate-45 size-12 cursor-pointer bg-green-100 border-green-500 flex items-center justify-center"
        )}
        nodeId={props.id}
        isSelected={!!props.selected}
      >
        <div className="-rotate-45">
          <WorkFlowIcons.splitPathIcon />
        </div>

        {/* Target Handle */}
        <Handle
          id={getInputHandleId()}
          type="target"
          position={Position.Left}
          className={cn("!top-12 !bg-transparent !rounded-none !border-none")}
        >
          <img
            src="/media/workflows/handle.svg"
            className="absolute -top-1.5 -rotate-45 text-xl -left-[1px]"
          />
        </Handle>

        {/* Source Handles */}
        <Handle
          id="branch-0"
          type="source"
          position={Position.Top}
          className={cn(
            "!bg-transparent !rounded-none !border-none !-left-0",
            !hasConnectionFromHandle(props.id, "branch-0") && "invisible"
          )}
        >
          <img
            src="/media/workflows/handle.svg"
            className="absolute -top-2 rotate-45 text-xl -left-[2px]"
          />
        </Handle>
        <Handle
          id="branch-1"
          type="source"
          position={Position.Right}
          className={cn(
            "!bg-transparent !rounded-none !border-none !-top-0 !-right-1",
            !hasConnectionFromHandle(props.id, "branch-1") && "invisible"
          )}
        >
          <img
            src="/media/workflows/handle.svg"
            className="absolute -top-2.5 rotate-[130deg] text-xl -left-[3px]"
          />
        </Handle>
        <Handle
          id="branch-2"
          type="source"
          position={Position.Bottom}
          className={cn(
            "!bg-transparent !rounded-none !border-none !left-12 !w-2.5 !h-2.5",
            !hasConnectionFromHandle(props.id, "branch-2") && "invisible"
          )}
        >
          <img
            src="/media/workflows/handle.svg"
            className="absolute -top-1 rotate-[-135deg] text-xl !left-0.5"
          />
        </Handle>
      </NodeCard>

      {/* Plus Buttons */}
      {!hasConnectionFromHandle(props.id, "branch-0") && (
        <Button
          size="sm"
          variant="outline"
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 p-0 border-none hover:text-[#0062FF] text-[#0062FF] bg-[#EDF4FF] rounded-full hover:bg-blue-50"
          onClick={() =>
            handleAddNodeFromHandle(
              nodeData?.backendData?.parentNodeId,
              "branch-0",
              TaskType.PATH,
              "",
              nodeData?.backendData?.appPosition
            )
          }
          type="button"
        >
          <PlusIcon size={12} />
        </Button>
      )}
      {!hasConnectionFromHandle(props.id, "branch-1") && (
        <Button
          size="sm"
          variant="outline"
          className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 p-0 border-none hover:text-[#0062FF] text-[#0062FF] bg-[#EDF4FF] rounded-full hover:bg-blue-50"
          onClick={() =>
            handleAddNodeFromHandle(
              nodeData?.backendData?.parentNodeId,
              "branch-1",
              TaskType.PATH,
              "",
              nodeData?.backendData?.appPosition
            )
          }
          type="button"
        >
          <PlusIcon size={12} />
        </Button>
      )}
      {!hasConnectionFromHandle(props.id, "branch-2") && (
        <Button
          size="sm"
          variant="outline"
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-7 h-6 p-0 border-none hover:text-[#0062FF] text-[#0062FF] bg-[#EDF4FF] rounded-full hover:bg-blue-50"
          onClick={() =>
            handleAddNodeFromHandle(
              nodeData?.backendData?.parentNodeId,
              "branch-2",
              TaskType.PATH,
              "",
              nodeData?.backendData?.appPosition
            )
          }
          type="button"
        >
          <PlusIcon size={12} />
        </Button>
      )}

      {/* Delete Button with Modal */}
      {showDelete && (
        <ConfirmationModal
          open={splitDelete}
          setOpen={setSplitDelete}
          functionToBeExecuted={() => {
            handleSplitDeletion(props.id, nodeData);
            setSplitDelete(false);
          }}
          title="Are you sure?"
          description="Are you sure you want to delete the node?"
          type="failure"
          successBtnText="Delete"
        >
          <Button
            variant="outline"
            onClick={() => setSplitDelete(true)}
            className="absolute z-10 hover:bg-white rounded-full px-12 py-1 -bottom-16 left-1/2 -translate-x-1/2 text-[#DC2626] hover:text-[#DC2626] border"
          >
            <HugeiconsIcon icon={Delete01FreeIcons} size={16} /> Delete
          </Button>
        </ConfirmationModal>
      )}
    </div>
  );
});
