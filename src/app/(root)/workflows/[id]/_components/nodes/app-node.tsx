"use client";

import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import { memo, useState } from "react";
import { NodeCard } from "./node-card";
import { NodeHeader } from "./node-header";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import DeviceFlowDialog from "../dialogs/device-flow-dialog";
import { InstructionDialog } from "../dialogs/instructions/instruction.dialog";
import { NotIntegratedDialog } from "../dialogs/not-integrated-dialog";
import AppConditionDialog from "../dialogs/set-app-condition.dialog";
import { useDeleteNode } from "../hooks/use-delete-node";
import { useFlowContext } from "../hooks/use-flow-context";
import { useInvalidateWorkflow } from "../hooks/use-invalidate-workflow";
import { AppTaskType, TaskType } from "../types/task";
import { addNodeAfterNode } from "../utils/backend-actions";
import { AddButton } from "./buttons/add-button";
import ConnectIntegrationFlow from "./connect-integration-workflow";
import GSuiteParentDialog from "../dialogs/gsuite-parent-dialog";

export const AppNode = memo(
  ({
    props,
    nodeData,
    getOutputHandleId,
    getInputHandleId,
    openDialog,
    closeDialog,
    handleNodeClick,
  }: any) => {
    const { hasOutgoingConnection, hasConnectionFromHandle } = useFlowContext();
    const { deleteNodeMutation } = useDeleteNode();
    const { invalidateWorkflow } = useInvalidateWorkflow(
      nodeData.backendData?.workflowId || ""
    );

    // console.log(nodeData, "@APP_NODE");

    const [showConnectModal, setShowConnectModal] = useState(false);

    const handleDuplicateMutation = useMutation({
      mutationFn: async ({
        sourceNodeId,
        nodeType,
        appType,
        position,
        workflowId,
      }: {
        sourceNodeId: string;
        nodeType: TaskType;
        appType?: AppTaskType;
        position: { x: number; y: number };
        workflowId: string;
      }) =>
        await addNodeAfterNode({
          nodeType,
          position,
          sourceNodeId,
          workflowId,
          appType,
        }),
      onSuccess: () => {
        invalidateWorkflow?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to duplicate");
      },
    });

    const handleDuplicateNode = async () => {
      handleDuplicateMutation.mutate({
        nodeType: nodeData?.type,
        position: {
          x: nodeData?.backendData?.appPosition?.x + 350,
          y: nodeData?.backendData?.appPosition?.y,
        },
        sourceNodeId: nodeData?.backendData?._id,
        workflowId: nodeData?.backendData?.workflowId,
        appType: nodeData?.appType as AppTaskType,
      });
    };

    return (
      <div className="relative">
        {nodeData?.appType === "Device Flow" &&
        nodeData?.backendData?.isGSuiteWithStartParent ? (
          <DeviceFlowDialog data={nodeData}>
            <NodeCard
              className={cn(
                !!props?.selected && "border-[#0062FF]  ring ring-[#D4E4FF]",
                "rounded-xl w-[260px] cursor-pointer"
              )}
              nodeId={props?.id}
              isSelected={!!props?.selected}
            >
              <div className="flex justify-between items-center w-full gap-2 p-2">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-2">
                    <img
                      src={
                        nodeData?.backendData?.template?.image ?? "/logo.png"
                      }
                      alt={nodeData?.appType}
                      width={45}
                      height={45}
                      className="rounded-md "
                    />
                    <div className="flex flex-col gap-1.5">
                      <p className="font-gilroySemiBold capitalize text-sm">
                        {nodeData?.appType}
                      </p>
                      <Badge className="text-xs p-0.5 px-2 w-fit rounded-md bg-transparent border border-[#0000000D] text-primary">
                        Action
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Input
                  value={"Onboard user on deviceflow"}
                  disabled
                  className="text-sm bg-[#00000003] disabled:cursor-auto select-none"
                />
              </div>
              <Handle
                id={getInputHandleId()}
                type="target"
                position={Position.Left}
                className={cn(
                  "!bg-[#0062FF] !ring-2 !ring-[#D4E4FF] !-left-0 !w-2.5 !h-2.5"
                )}
              />
              <Handle
                id={getOutputHandleId()}
                type="source"
                position={Position.Right}
                className={cn(
                  "!bg-[#0062FF] !ring-2 !ring-[#D4E4FF] !-right-0 !w-2.5 !h-2.5",
                  !hasOutgoingConnection(props?.id, nodeData?.type) &&
                    "invisible"
                )}
              />
            </NodeCard>
          </DeviceFlowDialog>
        ) : nodeData?.backendData?.isDeviceFlowWithStartParent &&
          nodeData.appType === "G Suite" ? (
          <GSuiteParentDialog data={nodeData}>
            <NodeCard
              className={cn(
                !!props?.selected && "border-[#0062FF]  ring ring-[#D4E4FF]",
                "rounded-xl w-[260px] cursor-pointer",
                nodeData?.backendData?.isIntegrated === false &&
                  "border-red-500 shadow-sm shadow-red-400"
              )}
              nodeId={props?.id}
              isSelected={!!props?.selected}
            >
              <div className="flex justify-between items-center w-full gap-2 p-2">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-2">
                    <img
                      src={
                        nodeData?.backendData?.template?.image ?? "/logo.png"
                      }
                      alt={nodeData?.appType}
                      width={45}
                      height={45}
                      className="rounded-md "
                    />
                    <div className="flex flex-col gap-1.5">
                      <p className="font-gilroySemiBold capitalize text-sm">
                        {nodeData?.appType}
                      </p>
                      <Badge className="text-xs p-0.5 px-2 w-fit rounded-md bg-transparent border border-[#0000000D] text-primary">
                        Action
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                {nodeData?.backendData?.isIntegrated === false ? (
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setShowConnectModal(true);
                      }}
                      className="w-full cursor-pointer"
                      variant="outline"
                    >
                      Connect
                    </Button>

                    <ConnectIntegrationFlow
                      data={nodeData?.backendData}
                      setShowConnectModal={setShowConnectModal}
                      showConnectModal={showConnectModal}
                    />
                  </>
                ) : (
                  <Input
                    value={"Onboard user on Google Work Space"}
                    disabled
                    className="text-sm bg-[#00000003] disabled:cursor-auto select-none"
                  />
                )}
              </div>
              <Handle
                id={getInputHandleId()}
                type="target"
                position={Position.Left}
                className={cn(
                  "!bg-[#0062FF] !ring-2 !ring-[#D4E4FF] !-left-0 !w-2.5 !h-2.5"
                )}
              />
              <Handle
                id={getOutputHandleId()}
                type="source"
                position={Position.Right}
                className={cn(
                  "!bg-[#0062FF] !ring-2 !ring-[#D4E4FF] !-right-0 !w-2.5 !h-2.5",
                  !hasOutgoingConnection(props?.id, nodeData?.type) &&
                    "invisible"
                )}
              />
            </NodeCard>
          </GSuiteParentDialog>
        ) : (
          <>
            <AppConditionDialog
              onDelete={() =>
                deleteNodeMutation.mutate({
                  nodeId: props?.id,
                  workflowId: nodeData?.backendData?.workflowId,
                })
              }
              data={nodeData}
              open={openDialog === "APP"}
              setOpen={closeDialog}
            />

            <InstructionDialog
              data={nodeData}
              onDelete={() =>
                deleteNodeMutation.mutate({
                  nodeId: props?.id,
                  workflowId: nodeData?.backendData?.workflowId,
                })
              }
              open={openDialog === "INSTRUCTION"}
              setOpen={closeDialog}
            />
            <NodeCard
              className={cn(
                !!props.selected && "border-[#0062FF] ring ring-[#D4E4FF]",
                nodeData?.backendData?.isIntegrated === false &&
                  nodeData?.appType !== "Device Flow" &&
                  nodeData?.appType !== "Instructions" &&
                  "border-red-500 shadow-sm shadow-red-400",
                "rounded-xl w-[260px] cursor-pointer",
                "rounded-xl w-[260px] cursor-pointer"
              )}
              nodeId={props?.id}
              isSelected={!!props?.selected}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(nodeData);
              }}
            >
              <NodeHeader
                isGSuiteWithStartParent={
                  nodeData?.backendData?.isGSuiteWithStartParent
                }
                canDuplicate={!hasOutgoingConnection(props?.id, nodeData?.type)}
                taskType={nodeData?.type}
                nodeData={nodeData}
                nodeId={props?.id}
                onDuplicate={handleDuplicateNode}
              />
              <div className="p-2">
                {nodeData?.backendData?.isIntegrated === false &&
                nodeData?.appType !== "Device Flow" &&
                nodeData?.appType !== "Instructions" ? (
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setShowConnectModal(true);
                      }}
                      className="w-full cursor-pointer"
                      variant="outline"
                    >
                      Connect
                    </Button>

                    <ConnectIntegrationFlow
                      data={nodeData?.backendData}
                      setShowConnectModal={setShowConnectModal}
                      showConnectModal={showConnectModal}
                    />
                  </>
                ) : (
                  <Input
                    value={
                      nodeData?.backendData?.serviceDescription?.length > 28
                        ? `${nodeData?.backendData?.serviceDescription?.slice(
                            0,
                            28
                          )}...`
                        : nodeData?.backendData?.serviceDescription ||
                          "No action selected"
                    }
                    disabled
                    className="text-sm bg-[#00000003] disabled:cursor-auto select-none line-clamp-1 overflow-hidden"
                  />
                )}
              </div>

              <Handle
                id={getInputHandleId()}
                type="target"
                position={Position.Left}
                className={cn(
                  "!bg-[#0062FF] !ring-2 !ring-[#D4E4FF] !-left-0 !w-2.5 !h-2.5"
                )}
              />

              <Handle
                id={getOutputHandleId()}
                type="source"
                position={Position.Right}
                className={cn(
                  "!bg-[#0062FF] !ring-2 !ring-[#D4E4FF] !-right-0 !w-2.5 !h-2.5",
                  !hasOutgoingConnection(props?.id, nodeData?.type) &&
                    "invisible"
                )}
              />
            </NodeCard>
          </>
        )}

        {/* AddButton if no outgoing connection */}
        {!hasOutgoingConnection(props?.id, nodeData?.type) && (
          <AddButton
            className="-right-12 top-1/2 -translate-y-1/2"
            nodeData={nodeData}
          />
        )}
      </div>
    );
  }
);
