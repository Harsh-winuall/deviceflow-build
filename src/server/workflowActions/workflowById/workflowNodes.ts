import { callAPIWithToken } from "@/server/helper";
import { BASEURL } from "@/server/main";
import { AxiosError } from "axios";

export interface AllAppsResponse {
  key: string;
  name: string;
  description: string;
  service: string;
  method: string | null;
  endpoint: string | null;
  requiredFields: string[] | null;
  outputFields: string[] | null;
  isInternal: boolean | null;
  authRequired: boolean;
  metaData: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface AppServices {
  isInternal: boolean;
  _id: string;
  key: string;
  name: string;
  custom: boolean;
  description: string;
  service: string;
  requiredFields: string[];
  bodyTemplate: {
    channel: string;
    text: string;
  };
  outputFields: string[];
  authRequired: boolean;
  auth: {
    type: string;
    field: string;
  };
  metaData: string;
  createdAt: string;
  validationConfig: {
    validationEndpoint: string;
    method: string;
    successPath: string;
    successValue: boolean;
    requiredScopes: string[];
  };
}

export interface WorkflowNode {
  orgId: string;
  workflowId: string;
  templateKey: string;
  configFields: string[];
  requiredFields: string[];
  next: string | null;
  position: {
    x: number;
    y: number;
  };
  deletedAt: string | null;
  _id: string;
  branches: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateWorkflowAppPayload {
  appName: string;
  position: {
    x: number;
    y: number;
  };
  workflowId: string;
  description: string;
}

export type WorkflowAppType = {
  name: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: null;
};

// GET ALL APPS or SERVICES

export const getAllAppsAndServices = async ({
  appName,
}: {
  appName?: string;
}): Promise<AllAppsResponse[] | AppServices[] | WorkflowAppType[]> => {
  try {
    const payload = appName ? { appName } : { allApps: "true" };
    const res = await callAPIWithToken<
      AllAppsResponse[] | AppServices[] | WorkflowAppType[]
    >(`${BASEURL}/edifybackend/v1/workflow/node/apps`, "POST", payload);

    // console.log("API response:", res);

    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

// Create an APP

export const createApp = async ({
  payload,
}: {
  payload: CreateWorkflowAppPayload;
}): Promise<WorkflowNode> => {
  try {
    // console.log("Creating app with payload:", payload);
    const res = await callAPIWithToken<WorkflowNode>(
      `${BASEURL}/edifybackend/v1/workflow/node/create-nodes?apponly=true`,
      "POST",
      { ...payload }
    );

    // console.log("API response:", res);
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const updateAppAction = async ({
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
  try {
    const body = {
      templateKey,
      nodeId,
      workflowId,
      ...(description ? { description } : {}),
      ...(customTempleteKey ? { serviceDescription: customTempleteKey } : {}),
      ...(config ? { config } : {}),
    };

    // console.log(body, "body for updateAppAction");

    const res = await callAPIWithToken<WorkflowNode>(
      `${BASEURL}/edifybackend/v1/workflow/node/create-nodes?service=true`,
      "POST",
      body
    );

    // console.log("updateAppAction response:", res);
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const changeApp = async ({
  nodeId,
  appName,
}: {
  nodeId: string;
  appName: string;
}) => {
  try {
    const res = await callAPIWithToken<WorkflowNode>(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/updateToNewTemplate?apponly=true`,
      "PATCH",
      { nodeId, appName }
    );

    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const updateNodeDescription = async ({
  description,
  nodeId,
}: {
  nodeId: string;
  description: string;
}) => {
  try {
    // console.log("Updating node description");
    const res = await callAPIWithToken<WorkflowNode>(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/updateToNewTemplate?edit=true`,
      "PATCH",
      { description, nodeId }
    );

    // console.log("updateNodeDescription response:", res);
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const deleteNode = async (
  nodeId: string,
  workflowId: string
): Promise<WorkflowNode> => {
  try {
    // console.log("Deleting node with ID:", nodeId);
    const res = await callAPIWithToken<WorkflowNode>(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/${nodeId}`,
      "DELETE",
      { workflowId }
    );

    // console.log("deleteNode response:", res);
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const getServices = async (appName: string) => {
  try {
    const res = await callAPIWithToken<
      | AppServices[]
      | {
          _id: string;
          key: string;
          service: string;
          custom: boolean;
          config: {
            cc: any[];
            subject: string;
            html: string;
          };
        }[]
    >(`${BASEURL}/edifybackend/v1/workflow/node/apps`, "POST", { appName });

    // console.log("getActions response:", res);
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const getChannelsFromKey = async (nodeKey: string): Promise<any[]> => {
  try {
    const res = await callAPIWithToken<AppServices[]>(
      `${BASEURL}/edifybackend/v1/workflow/prefetch`,
      "POST",
      { nodeKey }
    );

    // console.log("getActions response:", res);
    return res?.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const setConfigInstruction = async ({
  currentNodeId,
  name,
  html,
  cc,
  subject,
}: {
  currentNodeId: string;
  name?: string;
  html?: string;
  cc?: string[];
  subject?: string;
}) => {
  try {
    // console.log("Setting config instruction with params:", {
    //   currentNodeId,
    //   name,
    //   config: {
    //     cc: cc || [],
    //     html,
    //     subject,
    //   },
    // });
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/setConfig/${currentNodeId}`,
      "PATCH",
      {
        name,
        config: {
          cc: cc || [],
          html,
          subject,
        },
      }
    );
    // console.log("setConfigInstruction response:", res.data);

    return res.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const getAllCustomEmailTemplates = async (): Promise<any> => {
  try {
    const res = await callAPIWithToken<any>(
      `${BASEURL}/edifybackend/v1/workflow/customtemplate/`,
      "GET",
      {}
    );

    // console.log("getAllCustomTemplates response:", res);
    return res?.data?.results;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export type CustomEmailTemplate = {
  results: {
    orgId: string;
    workflowId: any;
    isIntegrated: boolean;
    appName: string;
    serviceDescription: string;
    templateKey: string;
    config: {
      cc: any[];
      html: string;
      subject: string;
    };
    configFields: any[];
    ifCondition: any[];
    requiredFields: any[];
    conditionalFields: any[];
    next: string | null;
    deletedAt: string | null;
    _id: string;
    branches: any[];
    createdAt: string;
    updatedAt: string;
  };
};

export const createCustomEmailTemplate = async ({
  name,
  config,
}: {
  name: string;
  config: {
    cc?: string[];
    subject?: string;
    html?: string;
  };
}) => {
  try {
    // console.log("Creating custom email template with params:", {
    //   name,
    //   config,
    // });

    const res = await callAPIWithToken<CustomEmailTemplate>(
      `${BASEURL}/edifybackend/v1/workflow/customtemplate/create`,
      "POST",
      { name, config }
    );

    const customTemplate = {
      _id: res?.data.results._id,
      key: "send_email",
      service: res?.data?.results?.config?.subject,
      custom: true,
      config: res?.data.results.config,
    };

    // console.log("createCustomEmailTemplate response:", customTemplate);

    return {
      _id: res?.data.results._id,
      key: "send_email",
      service: res?.data?.results?.config?.subject,
      custom: true,
      config: res?.data.results.config,
    };
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const setConfigApp = async ({
  teamId,
  channelId,
  currentNodeId,
  messageInput,
  workspace_gid,
  project_gid,
  org,
  repoName,
  repoId,
  groupId,
  team_gid,
  inviteLink,
}: {
  teamId?: string;
  channelId?: string;
  groupId?: string;
  workspace_gid?: string;
  project_gid?: string;
  currentNodeId?: string;
  messageInput?: string;
  org?: string;
  repoName?: string;
  repoId?: string;
  team_gid?: string;
  inviteLink?: string;
}) => {
  try {
    const config: Record<string, any> = {};
    // console.log(config, "config");

    if (teamId) config.teamId = teamId;
    if (channelId) config.channelId = channelId;
    if (messageInput) config.message = messageInput;
    if (org) config.org = org;
    if (project_gid) config.project_gid = project_gid;
    if (workspace_gid) config.workspace_gid = workspace_gid;
    if (repoId) config.name = repoName;
    if (repoName) config.id = repoId;
    if (team_gid) config.team_gid = team_gid;
    if (inviteLink) config.inviteLink = inviteLink;
    if (groupId) config.groupId = groupId;

    // console.log({ ...config, currentNodeId });

    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/workflowNode/setConfig/${currentNodeId}`,
      "PATCH",
      { config }
    );

    // console.log(res?.data, "set-config");

    return res.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const getAsanaChannels = async ({
  platform,
  template_key,
  workspace_gid,
}: {
  platform: string;
  workspace_gid: string;
  template_key: string;
}) => {
  try {
    // console.log({ platform, template_key, workspace_gid });
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/fetch/children`,
      "POST",
      {
        platform: platform,
        data: {
          workspace_gid: workspace_gid,
          template_key: template_key,
        },
      }
    );

    // console.log(res, "fetch asana channels");
    return res.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};

export const getSlackChannelMessage = async ({
  channelId,
}: {
  channelId?: string;
}) => {
  try {
    const res = await callAPIWithToken(
      `${BASEURL}/edifybackend/v1/workflow/slack/channel`,
      "POST",
      {
        channelId,
      }
    );
    return res.data;
  } catch (e) {
    throw new Error((e as AxiosError)?.message);
  }
};
