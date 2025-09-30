import { callAPIWithToken } from "@/server/helper";
import { BASEURL } from "@/server/main";

export type SingleSplitPathResponse = {
  workflowNodeId: string;
  newBranches: {
    branchId: string;
    label: string;
    branchPosition: {
      x: number;
      y: number;
    };
    branchDirection: any;
    condition: any;
    next: any;
  }[];
};

export const createSingleSplitPath = async ({
  prevNodeId,
  branchPositions,
  branchDirection,
  workflowId,
  isDirectConnection,
}: {
  prevNodeId: string;
  branchPositions: Array<{ x: number; y: number }>;
  branchDirection?: "Top" | "Bottom" | "Right";
  workflowId: string;
  isDirectConnection?: boolean;
}) => {
  // console.log("Creating single split path with params:", {
  //   prevNodeId,
  //   branchDirection,
  //   branchPositions,
  // });

  try {
    const res = await callAPIWithToken<SingleSplitPathResponse>(
      `${BASEURL}/edifybackend/v1/workflow/node/create-nodes?linear=true`,
      "POST",
      {
        prevNodeId: prevNodeId,
        branchPositions: branchPositions,
        branchDirection,
        workflowId,
        ...(isDirectConnection !== undefined && { isDirectConnection }),
      }
    );
    // console.log("Single split path created:", res.data);
    // gimme only branchId and branch details

    return res?.data;
  } catch (e) {
    console.error("Error creating single split path:", e);
    throw new Error("Error creating single split path");
  }
};

export const createDoubleSplitPath = async ({
  prevNodeId,
  branchPositions,
  connectorPosition,
  workflowId,
}: {
  prevNodeId: string;
  branchPositions: Array<{ x: number; y: number }>;
  connectorPosition: { x: number; y: number };
  workflowId?: string;
}) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/node/create-nodes?splitpath=true`,
      "POST",
      {
        prevNodeId,
        branchPositions,
        connectorPosition,
        workflowId,
      }
    );
    // console.log(res.data, "SPLIT NODE");
    return res?.data;
  } catch (e) {
    console.error("Error creating double split path:", e);
    throw new Error("Error creating double split path");
  }
};

import { AxiosError } from "axios";

export const updatePathNameOrNextNode = async ({
  nodeId,
  label,
  nextNodeId,
  branchId,
}: {
  nodeId?: string;
  label?: string;
  nextNodeId?: string;
  branchId?: string;
}) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/update-branch`,
      "PATCH",
      {
        nodeId,
        label,
        nextNodeId,
        branchId,
      }
    );
    return res?.data;
  } catch (e: any) {
    const err = e as AxiosError;
    const backendMessage = err?.response?.data?.message;
    const message = backendMessage || err.message || "Error updating path name";
    console.error("API error:", message);
    throw new Error(message);
  }
};

export const deleteBranch = async ({
  nodeId,
  branchId,
  workflowId,
}: {
  nodeId: string;
  branchId: string;
  workflowId: string;
}) => {
  // console.log("Deleting branch with params:", {
  //   nodeId,
  //   branchId,
  // });
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/delete-branch`,
      "DELETE",
      {
        nodeId,
        branchId,
        workflowId,
      }
    );
    // console.log("Branch deleted:", res.data);

    return res?.data;
  } catch (e) {
    console.error("Error deleting branch:", e);
    throw new Error("Error deleting branch");
  }
};

export const deleteSplit = async (id: string, workflowId: string) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/delete-connector/${id}`,
      "DELETE",
      { workflowId }
    );

    return res?.data;
  } catch (e) {
    console.error("Error deleting split", e);
    throw new Error("Error deleting Split");
  }
};

type UpdatePathConditionParams = {
  nodeId: string;
  branchId: string;
  branchDescription?: string;
  conditionId?: string; // Only required for updates
  condition: {
    field: string;
    operator: string;
    value: string;
  };
  isNew: boolean;
};

export const addPathCondition = async (params: UpdatePathConditionParams) => {
  const { nodeId, branchId, branchDescription, conditionId, condition, isNew } =
    params;

  const url = isNew
    ? `${BASEURL}/edifybackend/v1/workflow/workflowNode/update-branch?moreCondition=true`
    : `${BASEURL}/edifybackend/v1/workflow/workflowNode/update-branch`;

  try {
    const res = await callAPIWithToken(url, "PATCH", {
      nodeId,
      branchDescription,
      branchId,
      conditionId,
      condition,
    });

    return res?.data;
  } catch (e) {
    console.error("Error updating path condition:", e);
    throw new Error("Error updating path condition");
  }
};
