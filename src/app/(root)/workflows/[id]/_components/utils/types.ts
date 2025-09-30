export interface BackendNode {
  _id: string;
  orgId: string;
  workflowId: string;
  templateKey: string;
  position: { x: number; y: number };
  connectorPosition?: { x: number; y: number };
  next: string | null;
  branches: BackendBranch[];
  appName?: string;
  image?: string;
  description?: string;
  config?: Record<string, any>;
  serviceDescription?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface BackendBranch {
  branchId: string;
  label: string;
  branchPosition: { x: number; y: number };
  branchDescription?: string;
  condition: any;
  target: BackendNode | null;
  branchDirection?: "Top" | "Bottom" | "Right" | null;
}

export interface BackendWorkflowResponse {
  workflow: {
    _id: string;
    name: string;
    status: string;
    isValidTestRun: string;
    startNode: string;
  };
  tree: BackendNode;
  apps: Array<{
    name: string;
    image: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
  }>;
}
