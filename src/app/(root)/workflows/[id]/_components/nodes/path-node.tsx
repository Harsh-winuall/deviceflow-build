"use client";

import { cn } from "@/lib/utils";
import { AlertCircleIcon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Handle, Position } from "@xyflow/react";
import React, { memo, useRef, useState } from "react";
import { NodeCard } from "./node-card";

import {
  deleteBranch,
  updatePathNameOrNextNode,
} from "@/server/workflowActions/workflowById/workflowPaths";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PathConditionDialog from "../dialogs/set-path-condition.dialog";
import EditPath from "../dropdowns/edit-path";
import { useFlowContext } from "../hooks/use-flow-context";
import { useInvalidateWorkflow } from "../hooks/use-invalidate-workflow";
import { AddButtonForPath } from "./buttons/add-button-for-path";

export const PathNode = memo(
  ({
    props,
    nodeData,
    getInputHandleId,
    getOutputHandleId,
    openDialog,
    closeDialog,
    handleNodeClick,
  }: any) => {
    const [rename, setRename] = useState(false);
    const [label, setLabel] = useState(nodeData.pathName ?? "");

    const inputRef = useRef<HTMLInputElement>(null);

    const { hasOutgoingConnection } = useFlowContext();
    const { invalidateWorkflow } = useInvalidateWorkflow(
      nodeData.backendData?.workflowId || ""
    );

    const renamePathMutation = useMutation({
      mutationFn: updatePathNameOrNextNode,
      onSuccess: () => {
        invalidateWorkflow?.();
        toast.success("Path name updated");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update path name");
      },
    });

    const deletePathMutation = useMutation({
      mutationFn: ({
        branchId,
        nodeId,
        workflowId,
      }: {
        branchId: string;
        nodeId: string;
        workflowId: string;
      }) => deleteBranch({ branchId, nodeId, workflowId }),
      onSuccess: () => {
        invalidateWorkflow?.();
      },
      onError: () => {
        toast.error("Error deleting path");
      },
    });

    const handleRenamePath = () => {
      setRename(true);
      requestAnimationFrame(() => {
        const input = inputRef?.current;
        if (input) {
          input.focus();
          input.select();
        }
      });
    };

    const handleSubmitRename = () => {
      const trimmedLabel = label.trim();

      if (!trimmedLabel) {
        toast.error("Path name should not be empty");
        return;
      }

      renamePathMutation.mutate({
        branchId: nodeData?.branchData?._id,
        label: trimmedLabel,
        nodeId: nodeData.branchData.parentNodeId,
      });
    };

    const handleBlur = () => {
      setRename(false);
      handleSubmitRename(); // only call this once
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur(); // triggers handleBlur
      }
    };

    const handleDeletePath = () => {
      deletePathMutation.mutate({
        nodeId: nodeData?.branchData?.parentNodeId,
        branchId: nodeData.branchData?._id,
        workflowId: nodeData.branchData?.workflowId,
      });
    };

    return (
      <div className="relative">
        <PathConditionDialog
          onDelete={() => handleDeletePath()}
          parentData={nodeData}
          open={openDialog === "PATH"}
          setOpen={closeDialog}
        />
        <div
          onMouseEnter={(e) => {
            (
              e.currentTarget.firstElementChild as HTMLElement
            ).style.boxShadow = `0 0 10px 2px ${nodeData?.branchData?.bgColour}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.firstElementChild as HTMLElement).style.boxShadow =
              "none";
          }}
        >
          <NodeCard
            className={cn(
              !!props.selected && "ring ring-[#D4E4FF]",
              "rounded-[5px] flex items-center gap-3 justify-between min-w-20 w-full max-w-fit p-2"
            )}
            style={{
              backgroundColor: nodeData?.branchData?.bgColour,
              color: nodeData?.branchData?.textColour,
              borderColor: nodeData?.branchData?.textColour,
            }}
            nodeId={props.id}
            onClick={() => {
              handleNodeClick(nodeData);
            }}
            isSelected={!!props.selected}
          >
            <div className="text-center cursor-pointer flex items-center">
              {!nodeData?.branchData?.condition && (
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="text-[#F59E0B] size-3.5 mr-1"
                />
              )}
              {rename ? (
                <input
                  ref={inputRef}
                  value={label}
                  autoFocus={rename}
                  disabled={!rename}
                  onChange={(e) => setLabel(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "text-xs focus:outline-none font-gilroyMedium w-14",
                    "disabled:bg-transparent bg-transparent",
                    !rename && "pointer-events-none cursor-move select-none"
                  )}
                />
              ) : (
                <p className="text-xs font-gilroySemiBold ">
                  {nodeData.branchData?.label}
                </p>
              )}
            </div>
            <EditPath
              parentData={nodeData}
              type={"set"}
              onRename={handleRenamePath}
              onDelete={handleDeletePath}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer"
              >
                <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
              </div>
            </EditPath>

            <Handle
              id={getInputHandleId()}
              type="target"
              position={Position.Left}
              className={cn("!bg-transparent !border-none !left-1 !w-0 !h-0")}
            />
            <Handle
              id={getOutputHandleId()}
              type="source"
              position={Position.Right}
              className={cn("!bg-transparent !border-none !right-1 !w-0 !h-0")}
            />
          </NodeCard>
        </div>
        {!hasOutgoingConnection(props.id, nodeData.type) && (
          <AddButtonForPath
            className="-right-8 top-1/2 -translate-y-1/2"
            nodeData={nodeData}
          />
        )}
      </div>
    );
  }
);
