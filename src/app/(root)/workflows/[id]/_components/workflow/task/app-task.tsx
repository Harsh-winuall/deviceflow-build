import { HugeiconsIcon } from "@hugeicons/react";
import { AppTaskType, TaskParamType, TaskType } from "../../types/task";
import { Alert02Icon } from "@hugeicons/core-free-icons";

export const AppTask = {
  type: TaskType.APP,
  icon: (props) => <HugeiconsIcon icon={Alert02Icon} {...props} />,
  label: "Integration apps",
  isEntryPoint: false,
  inputs: [
    {
      name: "Start",
      type: TaskParamType.INTEGRATION_APPS,
      required: true,
    },
  ],
  outputs: [
    {
      name: "html",
      type: TaskParamType.STRING,
    },
  ],
};
