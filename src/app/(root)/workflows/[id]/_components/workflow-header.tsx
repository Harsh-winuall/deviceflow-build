"use client";

import { ActionBar } from "@/components/action-bar/action-bar";
import { Button } from "@/components/buttons/Button";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@/hooks/use-debounce";
import {
  deleteWorkflow,
  searchInWorkflow,
  updateWorkflow,
  type WorkflowTreeResponse,
} from "@/server/workflowActions/workflow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TestRun } from "../../_components/test-run";
import { SearchToolbar } from "./search-toolbar";

function WorkflowHeader({
  workflow,
  onSearchResults,
}: {
  workflow: WorkflowTreeResponse;
  onSearchResults?: (results: string[]) => void;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isRenaming, setIsRenaming] = useState(false);
  const [flowName, setFlowName] = useState(workflow?.data?.workflow?.name);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading: isSearching } = useQuery<any>({
    queryKey: [
      "workflow-search",
      workflow?.data?.workflow?._id,
      debouncedQuery,
    ],
    queryFn: () =>
      searchInWorkflow(debouncedQuery, workflow?.data?.workflow?._id),
    enabled: !!debouncedQuery && debouncedQuery.length > 0,
  });

  useEffect(() => {
    if (!onSearchResults) return;
    if (searchResults?.results?.length) {
      const matchingIds = searchResults.results.map((result) => result._id);

      onSearchResults(matchingIds);
    } else if (debouncedQuery === "") {
      onSearchResults([]);
    }
  }, [searchResults, debouncedQuery]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      status?: string;
      enabled?: boolean;
      isValidTestRun?: boolean;
    }) => updateWorkflow(workflow?.data?.workflow?._id, data),
    onMutate: async (newData) => {
      // Optimistically update the status
      if (newData.status) {
        await queryClient.invalidateQueries({
          queryKey: ["workflow-by-id", workflow?.data?.workflow?._id],
        });
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-by-id", workflow?.data?.workflow?._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-all-workflows"],
      });

      toast.success("Workflow updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workflow");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteWorkflow(workflow?.data?.workflow?._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-by-id"] });
      queryClient.invalidateQueries({
        queryKey: ["fetch-all-workflows"],
      });
      router.replace("/workflows");
      toast.success("Workflow deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete workflow");
    },
  });

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  const handleRename = () => setIsRenaming(true);

  const handleBlur = () => {
    setIsRenaming(false);
    if (flowName !== workflow?.data?.workflow?.name) {
      updateMutation.mutate({ name: flowName });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const handleStatusChange = () => {
    const isPublished = workflow?.data?.workflow?.status === "published";
    const isValid = workflow?.data?.workflow?.isValidTestRun;

    if (!isPublished) {
      toast.warning("Workflow must be published before enabling.");
      return;
    }

    if (!isValid) {
      toast.warning("Test run must be valid before enabling.");
      return;
    }

    updateMutation.mutate({
      enabled: !workflow?.data?.workflow?.enabled,
    });
  };

  const handlePublish = () => {
    if (!workflow?.data?.workflow?.isValidTestRun) {
      toast.warning("You must pass a valid test run to publish.");
      return;
    }

    updateMutation.mutate({
      status: "published",
      enabled: true,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <ActionBar
      showBackBtn
      outerClassName="rounded-b-none border-t-[#CECECE] border-l-[#CECECE] border-r-[#CECECE]"
    >
      <div className="h-[1px] bg-[#CECECE] rotate-90 w-6 -ml-2"></div>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-3">
          <Button
            variant="outlineTwo"
            className="flex items-center h-9 rounded-[5px] gap-2 w-28 hover:border-[#0000001A]"
            disabled={updateMutation.isPending}
          >
            <Switch
              className="cursor-pointer "
              onChange={handleStatusChange}
              checked={workflow.data.workflow.enabled}
              isLoading={updateMutation.isPending}
            />
            {workflow.data.workflow.enabled ? <>Enabled</> : <>Disabled</>}
          </Button>

          <SearchToolbar
            onSearch={handleSearch}
            value={searchQuery}
            isLoading={isSearching}
            searchIcon={
              <Button
                variant="outlineTwo"
                className="size-9 rounded-[5px] hover:bg-white transition-opacity duration-300"
              >
                <Search
                  className={`size-5 rounded-[5px] ${
                    isSearching ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 justify-center items-center">
            <h1 className="text-[15px]  font-gilroySemiBold">{flowName}</h1>
          </div>
          {/* <div className="flex gap-1 justify-center items-center">
            {isRenaming ? (
              <input
                ref={inputRef}
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="text-[15px] font-gilroySemiBold px-1 py-0.5 focus:outline-none w-auto min-w-[40px] bg-transparent"
                style={{ width: `${flowName.length + 1}ch` }} // dynamic width
              />
            ) : (
              <h1
                onDoubleClick={handleRename}
                className="text-[15px] cursor-pointer font-gilroySemiBold"
              >
                {flowName}
              </h1>
            )}
            {!isRenaming && (
              <WorkFlowOptions
                open={open}
                setOpen={setOpen}
                onRename={handleRename}
                onDelete={handleDelete}
              >
                <span
                  className="cursor-pointer"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {open ? (
                    <ChevronUp className="text-[#CCCCCC] size-5" />
                  ) : (
                    <ChevronDown className="text-[#CCCCCC] size-5" />
                  )}
                </span>
              </WorkFlowOptions>
            )}
          </div> */}
          <button
            type="button"
            className={`${
              workflow.data.workflow.enabled
                ? "border border-[#0C941C] text-[#0C941C] bg-[#F9FFFA]"
                : "border border-[#E5E5E5] text-black bg-[#F9F9F9]"
            } rounded-[5px] text-xs font-gilroyMedium text-center w-fit px-4 h-7`}
          >
            {workflow.data.workflow.enabled ? "Active" : "Draft"}
          </button>
        </div>
        {/* <p>Undo</p>
        <p>Redo</p> */}
        <div className="flex ">
          {/* <div className="flex ">
            <div className="flex gap-2">
              <Button variant="outlineTwo" className="w-9 h-9 rounded-[5px]">
                <HugeiconsIcon icon={Undo03Icon} />
              </Button>
              <Button variant="outlineTwo" className="w-9 h-9 rounded-[5px]">
                <RedoIcon />
              </Button>
            </div>
            <div className="h-[1px] bg-[#CECECE] rotate-90 w-6 mt-4 "></div>
          </div> */}

          <div className="flex gap-2">
            <Button
              variant="outlineTwo"
              className="h-9 rounded-[5px]"
              disabled={
                workflow?.data?.workflow.status === "draft" ||
                !workflow?.data?.workflow?.allNodesIntegrated
              }
              onClick={() => router.push("/ai-agents")}
            >
              Use it Now
            </Button>
            <TestRun
              allNodesIntegrated={workflow?.data?.workflow?.allNodesIntegrated}
              enableTestRun={workflow?.data?.workflow.status === "published"}
              workflowId={workflow?.data?.workflow?._id ?? ""}
            />
          </div>
        </div>
      </div>
    </ActionBar>
  );
}

export default WorkflowHeader;
