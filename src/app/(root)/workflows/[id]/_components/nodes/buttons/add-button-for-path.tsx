import { Button } from "@/components/buttons/Button";
import AddPopUp from "../../dropdowns/add-popup";
import { useFlowContext } from "../../hooks/use-flow-context";
import { TaskType } from "../../types/task";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { memo } from "react";

export const AddButtonForPath = memo(
  ({ className = "", nodeData }: { className?: string; nodeData: any }) => {
    const { handleAddNodeForPath, handleAddSplitPathForPath } =
      useFlowContext();

    return (
      <AddPopUp
        onAddInstruction={(appName) => {
          handleAddNodeForPath(
            nodeData?.backendData?.parentNodeId,
            nodeData?.branchData?.branchId,
            TaskType.INSTRUCTION,
            appName
          );
        }}
        onAddApp={(appType) =>
          handleAddNodeForPath(
            nodeData?.backendData?.parentNodeId,
            nodeData?.branchData?.branchId,
            TaskType.APP,
            appType
          )
        }
        onSplitPath={(key) => {
          // console.log(key);
          handleAddSplitPathForPath(
            nodeData?.backendData?.parentNodeId,
            nodeData?.branchData?.branchId,
            TaskType.SPLIT,
            key
          );
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
