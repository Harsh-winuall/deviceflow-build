"use client";

import type React from "react";

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
import {
  changeApp,
  getAllAppsAndServices,
  WorkflowAppType,
} from "@/server/workflowActions/workflowById/workflowNodes";
import { File01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppTaskType } from "../types/task";
import { useMemo } from "react";
import { toast } from "sonner";

export const appsToIgnore = ["Split", "Instructions", "Device Flow"];

interface ChangeAppDropdownProps {
  children: React.ReactNode;
  data: any;
}

const ChangeAppDropdown = ({ children, data }: ChangeAppDropdownProps) => {
  const { data: apps } = useQuery({
    queryKey: ["all-apps-workflow"],
    queryFn: () => getAllAppsAndServices({}),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

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
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[400px] mt-8 rounded-[10px] font-gilroyMedium"
        align="end"
      >
        {availableApps?.map((app: WorkflowAppType, index) => (
          <DropdownMenuItem
            key={index}
            className="flex items-center cursor-pointer py-2"
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
              className="w-5 h-5"
              width={20}
              height={20}
            />
            <p className="font-gilroyMedium">{app?.name}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeAppDropdown;
