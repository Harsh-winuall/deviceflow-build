"use server";

import { Edge } from "@xyflow/react";
import { AppNode } from "./types/app-node";
import { Workflow } from "./types/types";
import { CreateFlowNode } from "./workflow/create-node";
import { TaskType } from "./types/task";

const mockData = [
  {
    _id: "1",
    name: "Test 1",
    createdAt: "",
    updatedAt: "",
    description: "description",
    definition:
      '{"nodes":[{"id":"297ae58d-fce2-4297-8a3d-e11efdcc0b0f","type":"Node","data":{"type":"START","inputs":{"Start":"heyy"}},"position":{"x":250,"y":150},"measured":{"width":232,"height":151},"selected":true,"dragging":false}],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}}',
    status: "DRAFT",
    userId: "testing",
  },
  {
    _id: "2",
    name: "Test 2",
    createdAt: "",
    updatedAt: "",
    description: "description",
    definition:
      '{"nodes":[{"id":"297ae58d-fce2-4297-8a3d-e11efdcc0b0f","type":"Node","data":{"type":"START","inputs":{"Start":"heyy"}},"position":{"x":250,"y":150},"measured":{"width":75,"height":30},"selected":false,"dragging":false},{"id":"3366093d-1078-4f98-856d-7980431cf936","type":"Node","data":{"type":"APP","appType":"GOOGLE","inputs":{}},"position":{"x":440,"y":100},"measured":{"width":240,"height":133},"selected":false,"dragging":false},{"id":"b0d5b804-f3b8-4922-a9d5-aa68b0732f1f","type":"Node","data":{"type":"SPLIT","inputs":{}},"position":{"x":820,"y":120},"measured":{"width":48,"height":48},"selected":false,"dragging":false},{"id":"281cffd5-585a-4769-ad64-886b12a14135","type":"Node","data":{"type":"PATH","inputs":{}},"position":{"x":940,"y":-10},"measured":{"width":80,"height":34},"selected":false},{"id":"33015a7d-8fb3-404b-b65c-4f9959e7c37e","type":"Node","data":{"type":"PATH","inputs":{}},"position":{"x":940,"y":290},"measured":{"width":80,"height":34},"selected":false},{"id":"be13e8b6-02bb-4d6c-a2bf-812285247ee2","type":"Node","data":{"type":"SPLIT","inputs":{}},"position":{"x":1220,"y":-40},"measured":{"width":48,"height":48},"selected":true,"dragging":false},{"id":"ce58c717-a1f2-4d86-819a-2f768fe2091f","type":"Node","data":{"type":"PATH","inputs":{}},"position":{"x":1440,"y":-120},"measured":{"width":80,"height":34},"selected":false},{"id":"db335a8e-94b1-4133-a22f-20f3cefce563","type":"Node","data":{"type":"PATH","inputs":{}},"position":{"x":1440,"y":180},"measured":{"width":80,"height":34},"selected":false},{"id":"bc44ed4d-be09-448d-83ad-da25980c514e","type":"Node","data":{"type":"INSTRUCTION","appType":"GOOGLE","inputs":{}},"position":{"x":1640,"y":-180},"measured":{"width":240,"height":135},"selected":false,"dragging":false},{"id":"a232cf98-60c3-42c5-9e97-8f2919c13870","type":"Node","data":{"type":"APP","appType":"ZOOM","inputs":{}},"position":{"x":1140,"y":290},"measured":{"width":240,"height":90},"selected":false},{"id":"39914c6a-03b9-44db-a34b-3fad086e402c","type":"Node","data":{"type":"APP","appType":"GOOGLE","inputs":{}},"position":{"x":1520,"y":240},"measured":{"width":240,"height":133},"selected":false,"dragging":false},{"id":"d99f1bb2-473a-4053-a360-5ebf7fa837ad","type":"Node","data":{"type":"APP","appType":"GOOGLE","inputs":{}},"position":{"x":1700,"y":20},"measured":{"width":240,"height":133},"selected":false,"dragging":false}],"edges":[{"id":"297ae58d-fce2-4297-8a3d-e11efdcc0b0f-to-3366093d-1078-4f98-856d-7980431cf936","source":"297ae58d-fce2-4297-8a3d-e11efdcc0b0f","target":"3366093d-1078-4f98-856d-7980431cf936","sourceHandle":"web page","targetHandle":"Start"},{"id":"3366093d-1078-4f98-856d-7980431cf936-to-b0d5b804-f3b8-4922-a9d5-aa68b0732f1f","source":"3366093d-1078-4f98-856d-7980431cf936","target":"b0d5b804-f3b8-4922-a9d5-aa68b0732f1f","sourceHandle":"html","targetHandle":"split"},{"id":"b0d5b804-f3b8-4922-a9d5-aa68b0732f1f-to-281cffd5-585a-4769-ad64-886b12a14135","source":"b0d5b804-f3b8-4922-a9d5-aa68b0732f1f","target":"281cffd5-585a-4769-ad64-886b12a14135","sourceHandle":"branch-0","targetHandle":"paths"},{"id":"b0d5b804-f3b8-4922-a9d5-aa68b0732f1f-to-33015a7d-8fb3-404b-b65c-4f9959e7c37e","source":"b0d5b804-f3b8-4922-a9d5-aa68b0732f1f","target":"33015a7d-8fb3-404b-b65c-4f9959e7c37e","sourceHandle":"branch-2","targetHandle":"paths"},{"id":"281cffd5-585a-4769-ad64-886b12a14135-to-be13e8b6-02bb-4d6c-a2bf-812285247ee2","source":"281cffd5-585a-4769-ad64-886b12a14135","target":"be13e8b6-02bb-4d6c-a2bf-812285247ee2","sourceHandle":"output","targetHandle":"split"},{"id":"be13e8b6-02bb-4d6c-a2bf-812285247ee2-to-ce58c717-a1f2-4d86-819a-2f768fe2091f","source":"be13e8b6-02bb-4d6c-a2bf-812285247ee2","target":"ce58c717-a1f2-4d86-819a-2f768fe2091f","sourceHandle":"branch-0","targetHandle":"paths"},{"id":"be13e8b6-02bb-4d6c-a2bf-812285247ee2-to-db335a8e-94b1-4133-a22f-20f3cefce563","source":"be13e8b6-02bb-4d6c-a2bf-812285247ee2","target":"db335a8e-94b1-4133-a22f-20f3cefce563","sourceHandle":"branch-2","targetHandle":"paths"},{"id":"ce58c717-a1f2-4d86-819a-2f768fe2091f-to-bc44ed4d-be09-448d-83ad-da25980c514e","source":"ce58c717-a1f2-4d86-819a-2f768fe2091f","target":"bc44ed4d-be09-448d-83ad-da25980c514e","sourceHandle":"output","targetHandle":"Instruction"},{"id":"33015a7d-8fb3-404b-b65c-4f9959e7c37e-to-a232cf98-60c3-42c5-9e97-8f2919c13870","source":"33015a7d-8fb3-404b-b65c-4f9959e7c37e","target":"a232cf98-60c3-42c5-9e97-8f2919c13870","sourceHandle":"output","targetHandle":"Start"},{"id":"a232cf98-60c3-42c5-9e97-8f2919c13870-to-39914c6a-03b9-44db-a34b-3fad086e402c","source":"a232cf98-60c3-42c5-9e97-8f2919c13870","target":"39914c6a-03b9-44db-a34b-3fad086e402c","sourceHandle":"html","targetHandle":"Start"},{"id":"db335a8e-94b1-4133-a22f-20f3cefce563-to-d99f1bb2-473a-4053-a360-5ebf7fa837ad","source":"db335a8e-94b1-4133-a22f-20f3cefce563","target":"d99f1bb2-473a-4053-a360-5ebf7fa837ad","sourceHandle":"output","targetHandle":"Start"}],"viewport":{"x":-123.24643603724292,"y":183.60723898831546,"zoom":0.6733808971939306}}',
    status: "DRAFT",
    userId: "testing",
  },
];

export const fetchAllWorkflows = async (): Promise<Workflow[]> => {
  await waitFor();
  return mockData;
};

export const createWorkFlow = async (): Promise<Workflow> => {
  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  initialFlow.nodes.push(CreateFlowNode({ nodeType: TaskType.START }));

  const data = {
    _id: `${mockData.length + 1}`,
    status: "DRAFT",
    userId: "mockuser",
    description: "",
    createdAt: "",
    updatedAt: "",
    name: `Workflow ${mockData.length + 1}`,
    definition: JSON.stringify(initialFlow),
  };
  mockData.push(data);
  // console.log("@All Workflows", mockData);

  return data;
};

export const fetchWorkflowById = async (id: string): Promise<Workflow> => {
  await waitFor();
  const workflow = mockData.find((data) => data._id === id);
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  // console.log(workflow);
  return workflow;
};

export const updateWorkFlowById = async ({
  id,
  definition,
}: {
  id: string;
  definition: string;
}): Promise<Workflow> => {
  const index = mockData.findIndex((val) => val._id === id);
  if (index === -1) {
    throw new Error("Workflow not found");
  }
  mockData[index] = { ...mockData[index], definition };
  // console.log(mockData[index], "updated");
  return mockData[index];
};

export const waitFor = (ms: number = 2000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
