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
  getAllAppsAndServices,
  WorkflowAppType,
} from "@/server/workflowActions/workflowById/workflowNodes";
import { File01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const appsToIgnore = ["Split", "Instructions"];

interface AddPopUpProps {
  children: React.ReactNode;
  onAddInstruction: (appName: string) => void;
  onAddApp: (appType: string) => void;
  onSplitPath: (key: string) => void;
}

const AddPopUp = ({
  children,
  onAddInstruction,
  onAddApp,
  onSplitPath,
}: AddPopUpProps) => {
  const { data: apps } = useQuery({
    queryKey: ["all-apps-workflow"],
    queryFn: () => getAllAppsAndServices({}),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const availableApps = useMemo(() => {
    return apps?.filter((app) => !appsToIgnore.includes(app.name));
  }, [apps]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 rounded-[10px] font-gilroyMedium"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            onClick={() => {
              onAddInstruction(
                apps.filter((data) =>
                  data.name.toLowerCase().includes("instructions")
                )[0].name
              );
            }}
          >
            <HugeiconsIcon icon={File01Icon} />
            Add Instructions
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-3">
              <img
                src="/media/workflows/change-app.svg"
                alt="app"
                className="-ml-0.5"
                width={18}
                height={18}
              />
              Add App
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-40 flex flex-col gap-2 rounded-[10px]">
                {availableApps?.map((data: WorkflowAppType) => (
                  <DropdownMenuItem
                    key={data.name}
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      onAddApp(data?.name);
                    }}
                  >
                    <img
                      src={data?.image ?? "/logo.png"}
                      alt={data?.name ?? "app"}
                      className="w-4 h-4"
                    />
                    <p className="font-gilroyMedium">{data?.name}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            onClick={() => {
              onSplitPath(
                apps?.filter((data) =>
                  data?.name?.toLowerCase()?.includes("split")
                )?.[0]?.name
              );
            }}
          >
            <HugeiconsIcon icon={Share08Icon} className="rotate-90" />
            Split Path
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddPopUp;
