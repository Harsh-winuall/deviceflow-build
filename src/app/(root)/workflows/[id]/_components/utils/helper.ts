import { TaskType } from "../types/task";
import { TaskRegistry } from "../workflow/task/registry";

const getTaskTypeFromTemplateKey = (templateKey: string): TaskType => {
  switch (templateKey) {
    case "start":
      return TaskType.START;
    case "split":
      return TaskType.SPLIT;
    case "path":
      return TaskType.PATH;
    default:
      return TaskType.APP;
  }
};

const getHandleIds = (taskType: TaskType) => {
  const task = TaskRegistry[taskType];
  return {
    input: task?.inputs?.[0]?.name || "input",
    output: task?.outputs?.[0]?.name || "output",
  };
};

export { getTaskTypeFromTemplateKey, getHandleIds };
