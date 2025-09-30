"use client";

import { deleteNode } from "@/server/workflowActions/workflowById/workflowNodes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useChangeStatusToDraft } from "./use-change-to-draft";
import { useFlowContext } from "./use-flow-context";
import { useInvalidateWorkflow } from "./use-invalidate-workflow";

export const useDeleteNode = () => {
  const { workflowData } = useFlowContext();
  const { changeStatusToDraft } = useChangeStatusToDraft({
    data: {
      workflow: { _id: workflowData?.workflowId, status: workflowData?.status },
    },
  });
  const { invalidateWorkflow } = useInvalidateWorkflow(
    workflowData?.workflowId
  );

  const deleteNodeMutation = useMutation({
    mutationFn: ({
      nodeId,
      workflowId,
    }: {
      nodeId: string;
      workflowId: string;
    }) => {
      changeStatusToDraft?.();
      return deleteNode(nodeId, workflowId);
    },
    onSuccess: () => {
      invalidateWorkflow?.();
    },
    onError: () => {
      toast.error("Error deleting node");
    },
  });

  return {
    deleteNodeMutation,
  };
};
