import { AxiosError } from "axios";
import { callAPIWithToken } from "../helper";
import { BASEURL } from "../main";
export type Workflow = {
  _id?: string;
  name?: string;
  orgId?: string;
  createdBy?: string;
  enabled?: boolean;
  isValidTestRun?: boolean;
  status?: string; // limit to known values
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
  startNode?: string;
  deletedAt?: string | null;
  creatorName?: string;
};

export const createWorkflow = async (name: string = "Onboarding Workflow") => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/`,
      "POST",
      { name }
    );
    return res.data;
  } catch (error) {
    throw new Error(error?.message || "Failed to create workflow");
  }
};

export const deleteWorkflow = async (workflowId: string) => {
  // console.log(`Deleting workflow with ID: ${workflowId}`);
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/${workflowId}?softDelete=true`,
      "PATCH",
      {}
    );
    return res.data;
  } catch (error) {
    throw new Error(error?.message || "Failed to delete Workflow");
  }
};

export const updateWorkflow = async (id: string, data: Partial<Workflow>) => {
  try {
    // console.log("change status", id, data);
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/${id}`,
      "PATCH",
      data
    );
    // console.log("change status res: ", res?.data);
    return res.data;
  } catch (error) {
    throw new Error(error?.message || "Failed to update workflow!");
  }
};

export const allWorkflows = async (status?: string) => {
  try {
    const url = status
      ? `${BASEURL}/edifybackend/v1/workflow/?status=${encodeURIComponent(
          status
        )}`
      : `${BASEURL}/edifybackend/v1/workflow/`;

    const res = await callAPIWithToken(url, "GET");
    // console.log(res.data);
    return res?.data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get all the Workflows");
  }
};

export interface Branch {
  branchId: string;
  label: string;
  condition: {
    field: string;
    operator: string;
    value: number;
  } | null;
  target: Node;
}

export interface Node {
  _id: string;
  orgId: string;
  workflowId: string;
  token?: string; // only present on root node
  templateKey: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
  connectorPosition?: {
    x: number;
    y: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  next: string | null | Node;
  branches: Branch[];
}

export interface StartWorkflowNode {
  _id: string;
  name: string;
  enabled?: boolean;
  isValidTestRun?: boolean;
  status: "draft" | "published";
  startNode: string;
  allNodesIntegrated?: boolean;
}

export interface WorkflowTreeResponse {
  success: boolean;
  data: {
    workflow: StartWorkflowNode;
    tree: Node;
    apps: Array<{
      name: string;
      image: string;
      description: string;
      createdAt: string;
      updatedAt: string | null;
    }>;
  };
}

export const getWorkflowById = async (id: string) => {
  try {
    const res = await callAPIWithToken<WorkflowTreeResponse>(
      `${BASEURL}/edifybackend/v1/workflow/${id}`,
      "GET"
    );

    return res?.data;
  } catch {
    throw new Error("Error fetching workflow");
  }
};

export const searchInWorkflow = async (
  searchQuery: string,
  id: string
): Promise<any[]> => {
  try {
    const res = await callAPIWithToken<any[]>(
      `${BASEURL}/edifybackend/v1/workflow/node/search/${id}`,
      "POST",
      { searchQuery }
    );

    // console.log("getActions response:", res);
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const testRunWorkflow = async (id: string) => {
  try {
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/workflow/workflow/test-run`,
      "POST",
      {
        workflowId: id,
      }
    );

    return res?.data;
  } catch {
    throw new Error("Error fetching workflow Test Run");
  }
};
