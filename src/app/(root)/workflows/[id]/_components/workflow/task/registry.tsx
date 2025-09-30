import { AppTask } from "./app-task";
import { InstructionTask } from "./instruction-task";
import { PathTask } from "./path-task";
import { SplitTask } from "./split-task";
import { StartTask } from "./start";

// export const TaskRegistry = {
//   START: StartTask,
//   APP: AppTask,
//   INSTRUCTION: InstructionTask,
//   PATH: PathTask,
//   SPLIT: SplitTask,
// };

import { TaskType } from "../../types/task";

export interface TaskInput {
  name: string;
  type: string;
  required: boolean;
}

export interface TaskOutput {
  name: string;
  type: string;
}

export interface Task {
  type: TaskType;
  label: string;
  icon?: any;
  isEntryPoint?: boolean;
  inputs: TaskInput[];
  outputs: TaskOutput[];
}

export const TaskRegistry: Record<TaskType, Task> = {
  [TaskType.START]: {
    type: TaskType.START,
    label: "Start",
    isEntryPoint: true,
    inputs: [],
    outputs: [{ name: "web page", type: "string" }],
  },
  [TaskType.APP]: {
    type: TaskType.APP,
    label: "App",
    inputs: [{ name: "Start", type: "string", required: true }],
    outputs: [{ name: "html", type: "string" }],
  },
  [TaskType.INSTRUCTION]: {
    type: TaskType.INSTRUCTION,
    label: "Instruction",
    inputs: [{ name: "Instruction", type: "string", required: true }],
    outputs: [{ name: "output", type: "string" }],
  },
  [TaskType.SPLIT]: {
    type: TaskType.SPLIT,
    label: "Split",
    inputs: [{ name: "split", type: "string", required: true }],
    outputs: [
      { name: "branch-0", type: "string" },
      { name: "branch-1", type: "string" },
      { name: "branch-2", type: "string" },
    ],
  },
  [TaskType.PATH]: {
    type: TaskType.PATH,
    label: "Path",
    inputs: [{ name: "paths", type: "string", required: true }],
    outputs: [{ name: "output", type: "string" }],
  },
};
