"use client";

import { deleteNode } from "@/server/workflowActions/workflowById/workflowNodes";
import { deleteSplit } from "@/server/workflowActions/workflowById/workflowPaths";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { useChangeStatusToDraft } from "./use-change-to-draft";
import { useFlowContext } from "./use-flow-context";
import { useInvalidateWorkflow } from "./use-invalidate-workflow";

export const useSplitDeletion = (workflowId: string) => {
  const { workflowData } = useFlowContext();
  const { invalidateWorkflow } = useInvalidateWorkflow(
    workflowData?.workflowId
  );
  const { changeStatusToDraft } = useChangeStatusToDraft({
    data: {
      workflow: { _id: workflowData?.workflowId, status: workflowData?.status },
    },
  });

  const deleteSplitMutation = useMutation({
    mutationFn: async ({
      nodeId,
      nodeData,
    }: {
      nodeId: string;
      nodeData: any;
    }) => {
      const isFakeApp = nodeData?.backendData?.isFakeSplitApp === true;
      const fakeAppId =
        nodeData?.backendData?.fakeAppId || nodeData?.splitData?._id;

      // console.log("Delete operation:", {
      //   nodeId,
      //   isFakeApp,
      //   fakeAppId,
      //   nodeType: nodeData?.type,
      // });
      changeStatusToDraft?.();

      if (isFakeApp && fakeAppId) {
        // This split connector represents a fake Split app - delete the fake app
        // console.log("Deleting fake Split app:", fakeAppId);
        await deleteNode(fakeAppId, nodeData?.backendData?.workflowId);
      } else {
        // This is a regular split - delete normally
        // console.log("Deleting regular split:", nodeId);
        const splitId = nodeId.replace("-split", "").replace("-connector", "");
        await deleteSplit(splitId, nodeData?.backendData?.workflowId);
      }
    },
    onSuccess: () => {
      invalidateWorkflow?.();
      // toast.success("Split path deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete the Split Path");
    },
  });

  const handleSplitDeletion = useCallback(
    (splitNodeId: string, nodeData: any) => {
      // console.log("Handling split deletion:", {
      //   splitNodeId,
      //   nodeData: {
      //     type: nodeData?.type,
      //     isFakeSplitApp: nodeData?.backendData?.isFakeSplitApp,
      //     fakeAppId: nodeData?.backendData?.fakeAppId,
      //   },
      // });

      deleteSplitMutation.mutate({
        nodeId: splitNodeId,
        nodeData,
      });
    },
    [deleteSplitMutation]
  );

  return {
    handleSplitDeletion,
    isDeleting: deleteSplitMutation.isPending,
  };
};
