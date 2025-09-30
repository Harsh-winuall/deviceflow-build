import { Button } from "@/components/buttons/Button";
import AddPopUp from "../../dropdowns/add-popup";
import { useFlowContext } from "../../hooks/use-flow-context";
import { TaskType } from "../../types/task";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { memo } from "react";

export const AddButton = memo(
  ({ className = "", nodeData }: { className?: string; nodeData: any }) => {
    const { handleAddNode, handleAddSplitPath } = useFlowContext();

    return (
      <AddPopUp
        onAddInstruction={(appName) => {
          handleAddNode(
            nodeData?.backendData?.parentNodeId,
            TaskType.INSTRUCTION,
            appName
          );
        }}
        onAddApp={(appType) =>
          handleAddNode(
            nodeData?.backendData?.parentNodeId,
            TaskType.APP,
            appType
          )
        }
        onSplitPath={() => {
          handleAddSplitPath(nodeData?.backendData?._id);
        }}
      >
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "absolute w-6 h-6 p-0 border-none hover:text-[#0062FF] text-[#0062FF] bg-[#EDF4FF] rounded-full hover:bg-blue-50",
            className
          )}
          type={"button"}
        >
          <PlusIcon size={12} />
        </Button>
      </AddPopUp>
    );
  }
);
