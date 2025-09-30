import { TaskParamType, TaskType } from "../../types/task";

export const StartTask = {
  type: TaskType.START,
  label: "Start",
  isEntryPoint: true,
  inputs: [
    {
      name: "Start",
      type: TaskParamType.START,
      required: true,
    },
  ],
  outputs: [{ name: "web page", type: TaskParamType.INTEGRATION_APPS }],
};
