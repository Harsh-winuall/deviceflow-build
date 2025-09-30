import { WorkflowTreeResponse } from "@/server/workflowActions/workflow";
import { FlowEditor } from "./flow-editor";
interface EditorProps {
  workflow: WorkflowTreeResponse;
  searchResults: string[];
}

export const Editor = ({ workflow, searchResults }: EditorProps) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <section className="flex h-full overflow-auto">
        <FlowEditor workflow={workflow} searchResults={searchResults} />
      </section>
    </div>
  );
};
