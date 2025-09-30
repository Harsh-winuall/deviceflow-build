"use client";

import React, { useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { AppTaskType } from "../types/task";
import { ConfirmationModal } from "@/app/(root)/workflows/[id]/_components/dropdowns/confirmation-popup";
import AppConditionDialog from "@/app/(root)/workflows/[id]/_components/dialogs/set-app-condition.dialog";
import { InstructionDialog } from "@/app/(root)/workflows/[id]/_components/dialogs/instructions/instruction.dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeApp,
  getAllAppsAndServices,
  WorkflowAppType,
} from "@/server/workflowActions/workflowById/workflowNodes";
import { appsToIgnore } from "./add-popup";
import { toast } from "sonner";

interface EditNodeProps {
  children: React.ReactNode;
  state?: "connected" | "disconnected";
  type: "app" | "instruction";
  onDuplicate: () => void;
  onDelete: () => void;
  canDuplicate: boolean;
  data?: any;
}

const EditNode = ({
  children,
  state,
  type,
  data,
  onDuplicate,
  canDuplicate,
  onDelete,
}: EditNodeProps) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const queryClient = useQueryClient();
  // console.log(data)

  const { data: apps } = useQuery({
    queryKey: ["all-apps-workflow"],
    queryFn: () => getAllAppsAndServices({}),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const changeAppMutation = useMutation({
    mutationFn: ({ nodeId, appName }: { nodeId: string; appName: string }) => {
      return changeApp({ nodeId, appName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-by-id"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change app");
    },
  });

  const availableApps = useMemo(() => {
    return apps?.filter((app) => !appsToIgnore.includes(app.name));
  }, [apps]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={state === "disconnected"}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 rounded-[10px] font-gilroyMedium"
        align="start"
      >
        <DropdownMenuGroup>
          {data.appType === "Instructions" ? (
            <InstructionDialog
              data={data}
              onDelete={onDelete}
              open={openEdit}
              setOpen={setOpenEdit}
            >
              <DropdownMenuItem
                className="flex items-center cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenEdit(true);
                }}
              >
                <img
                  src="/media/edit-condition.svg"
                  alt="edit action"
                  width={16}
                  height={16}
                />
                Edit Action
              </DropdownMenuItem>
            </InstructionDialog>
          ) : data?.appType !== "Device Flow" &&
            data?.type === "APP" &&
            data?.backendData?.isIntegrated === false ? null : (
            <>
              <AppConditionDialog
                onDelete={onDelete}
                data={data}
                open={openEdit}
                setOpen={setOpenEdit}
              >
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenEdit(true);
                  }}
                >
                  <img
                    src="/media/edit-condition.svg"
                    alt="edit action"
                    width={16}
                    height={16}
                  />
                  Edit Action
                </DropdownMenuItem>
              </AppConditionDialog>
            </>
          )}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className="flex items-center gap-3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <img
                src="/media/workflows/change-app.svg"
                alt="change app"
                className="-ml-0.5"
                width={18}
                height={18}
              />
              Change app
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className="w-40 flex flex-col gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {availableApps?.map((app: WorkflowAppType, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      changeAppMutation.mutate({
                        appName: app?.name,
                        nodeId: data?.backendData?._id,
                      });
                    }}
                  >
                    <img
                      src={app?.image ?? "/logo.png"}
                      alt={app?.name ?? "app"}
                      className="w-4 h-4"
                      width={16}
                      height={16}
                    />
                    <p className="font-gilroyMedium">{app?.name}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {canDuplicate ? (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                onDuplicate?.();
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <img
                src="/media/duplicate.svg"
                alt="duplicate"
                width={16}
                height={16}
              />
              Duplicate
            </DropdownMenuItem>
          ) : null}

          <ConfirmationModal
            open={open}
            setOpen={setOpen}
            functionToBeExecuted={() => {
              onDelete();
              setOpen(false);
            }}
            title="Are you sure?"
            description="Are you sure you want to delete the node?"
            type="failure"
            successBtnText="Delete"
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-red-500 focus:text-red-500 font-gilroyMedium w-full cursor-pointer"
            >
              <HugeiconsIcon icon={Delete01Icon} size={16} />
              Delete Node
            </DropdownMenuItem>
          </ConfirmationModal>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditNode;
