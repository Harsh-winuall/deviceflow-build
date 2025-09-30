import { HugeiconsIcon } from "@hugeicons/react";
import { TaskParamType, TaskType } from "../../types/task";
import { Alert02Icon } from "@hugeicons/core-free-icons";

export const InstructionTask = {
  type: TaskType.INSTRUCTION,
  icon: (props) => <HugeiconsIcon icon={Alert02Icon} {...props} />,
  label: "Instruction",
  isEntryPoint: false,
  inputs: [
    {
      name: "Instruction",
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
