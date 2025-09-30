import { HugeiconsIcon } from "@hugeicons/react";
import { TaskParamType, TaskType } from "../../types/task";
import { Alert02Icon } from "@hugeicons/core-free-icons";

export const SplitTask = {
  type: TaskType.SPLIT,
  icon: (props) => <HugeiconsIcon icon={Alert02Icon} {...props} />,
  label: "split",
  isEntryPoint: false,
  inputs: [
    {
      name: "split",
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
