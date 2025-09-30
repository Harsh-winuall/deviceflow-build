import { updateWorkflow } from "@/server/workflowActions/workflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChangeWorkflowStatus = (id: string) => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      status?: string;
      enabled?: boolean;
      isValidTestRun?: boolean;
      allNodesIntegrated?: boolean;
    }) => updateWorkflow(id, data),
    onMutate: async (newData) => {
      // Optimistically update the status
      if (newData.status) {
        await queryClient.invalidateQueries({
          queryKey: ["workflow-by-id", id],
        });
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-by-id", id],
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

  return {
    updateMutation,
  };
};
