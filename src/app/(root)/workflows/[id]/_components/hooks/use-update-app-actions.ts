"use client";

import { updateAppAction } from "@/server/workflowActions/workflowById/workflowNodes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useChangeStatusToDraft } from "./use-change-to-draft";
import { useFlowContext } from "./use-flow-context";
import { useInvalidateWorkflow } from "./use-invalidate-workflow";

export const useUpdateAppActions = (workflowId: string) => {
  const { workflowData } = useFlowContext();
  const { invalidateWorkflow } = useInvalidateWorkflow(
    workflowData?.workflowId
  );
  const { changeStatusToDraft } = useChangeStatusToDraft({
    data: {
      workflow: { _id: workflowData?.workflowId, status: workflowData?.status },
    },
  });

  const updateAppActionsMutation = useMutation({
    mutationFn: ({
      templateKey,
      nodeId,
      workflowId,
      description,
      customTempleteKey,
      config,
    }: {
      templateKey: string;
      nodeId: string;
      workflowId: string;
      description?: string;
      customTempleteKey?: string;
      config?: {
        cc?: string[];
        subject?: string;
        html?: string;
      };
    }) => {
      changeStatusToDraft?.();

      return updateAppAction({
        templateKey,
        nodeId,
        workflowId,
        description,
        customTempleteKey,
        config,
      });
    },
    onSuccess: () => {
      invalidateWorkflow?.();
      toast.success("Instruction Condition set Successfully");
    },
    onError: () => {
      toast.error("Failed to set App Condition");
    },
  });

  return {
    updateAppActionsMutation,
  };
};
