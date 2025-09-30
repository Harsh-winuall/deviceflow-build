import { HugeiconsIcon } from "@hugeicons/react";
import { TaskParamType, TaskType } from "../../types/task";
import { Alert02Icon } from "@hugeicons/core-free-icons";

export const PathTask = {
  type: TaskType.PATH,
  icon: (props) => <HugeiconsIcon icon={Alert02Icon} {...props} />,
  label: "paths",
  isEntryPoint: false,
  inputs: [
    {
      name: "paths",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "",
      type: TaskParamType.STRING,
    },
  ],
};
