export enum TaskType {
  START = "START",
  APP = "APP",
  INSTRUCTION = "INSTRUCTION",
  PATH = "PATH",
  SPLIT = "SPLIT",
}

export enum AppTaskType {
  GOOGLE = "GOOGLE",
  NOTION = "NOTION",
  ZOOM = "ZOOM",
  HUBSPOT = "HUBSPOT",
  GITHUB = "GITHUB",
}

export enum TaskParamType {
  START = "START",
  STRING = "STRING",
  INTEGRATION_APPS = "INTEGRATION_APPS",
  INSTRUCTION = "INSTRUCTION",
}

export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  value?: string;
  [key: string]: any;
}
