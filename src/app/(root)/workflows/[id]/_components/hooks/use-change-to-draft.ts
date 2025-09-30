import { updateWorkflow } from "@/server/workflowActions/workflow";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export const useChangeStatusToDraft = (workflow: {
  data?: { workflow?: { _id?: string; status?: string } } | any;
}) => {
  const updateStatusMutation = useMutation({
    mutationFn: (data: {
      status?: string;
      isValidTestRun: boolean;
      enabled: boolean;
    }) => updateWorkflow(workflow?.data?.workflow?._id, data),
    onError: (error) => {
      console.error("Failed to update workflow status:", error);
    },
  });

  const changeStatusToDraft = useCallback(() => {
    updateStatusMutation.mutate({
      enabled: false,
      isValidTestRun: false,
      status: "draft",
    });
  }, [updateStatusMutation]);

  return {
    changeStatusToDraft,
  };
};
