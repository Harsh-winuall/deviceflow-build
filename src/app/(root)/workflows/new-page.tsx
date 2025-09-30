"use client";

import { ActionBar } from "@/components/action-bar/action-bar";
import { Button } from "@/components/buttons/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  allWorkflows,
  createWorkflow,
} from "@/server/workflowActions/workflow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import Main from "./_components/main";
export const NewPageWorkflows = () => {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "all-workflows",
  });
  const queryClient = useQueryClient();
  const { data, status } = useQuery({
    queryKey: ["fetch-all-workflows", activeTab],
    queryFn: () => allWorkflows(),
  });

  const mutation = useMutation({
    mutationFn: () => createWorkflow(),
    onSuccess: (newWorkflow) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-all-workflows", activeTab],
      });
      toast.success("Created new workflow ");
      router.push(`/workflows/${newWorkflow._id}`);
    },
    onError: () => {
      toast.error("Failed to create new workflow !");
    },
  });

  const router = useRouter();
  const handleNewWorkflow = () => {
    mutation.mutate();
  };

  return (
    <>
      <section className="w-full min-h-[85vh]  flex flex-col">
        {data?.data?.length === 0 && (
          <ActionBar>
            <div className="w-full flex justify-end">
              <Button
                disabled={mutation?.isPending}
                variant="primary"
                className="rounded-[5px] w-fit flex "
                type="button"
                onClick={handleNewWorkflow}
              >
                Create Workflow
              </Button>
            </div>
          </ActionBar>
        )}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              setActiveTab(tab);
            }}
            defaultValue="all-workflows"
            className="w-full"
          >
            <TabsContent value="all-workflows">
              <Main
                handleNewWorkflow={handleNewWorkflow}
                data={data?.data ?? []}
                status={status === "pending"}
              />
            </TabsContent>
            <TabsContent value="draft-workflows">
              <Main
                handleNewWorkflow={handleNewWorkflow}
                data={data?.data?.filter((wf) => wf.status === "draft")}
                status={status === "pending"}
              />
            </TabsContent>
            <TabsContent value="active-workflows">
              <Main
                handleNewWorkflow={handleNewWorkflow}
                data={data?.data?.filter(
                  (wf) => wf.status === "published" && wf.enabled
                )}
                status={status === "pending"}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};
