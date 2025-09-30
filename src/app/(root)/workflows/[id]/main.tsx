"use client";

import { CombinedContainer } from "@/components/container/container";
import { ReactFlowProvider } from "@xyflow/react";
import { Editor } from "./_components/editor";

import { getWorkflowById } from "@/server/workflowActions/workflow";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import WorkflowHeader from "./_components/workflow-header";

export const WorkflowByIdMain = ({ workflowId }: { workflowId: string }) => {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const { data: workflow } = useSuspenseQuery({
    queryKey: ["workflow-by-id", workflowId],
    queryFn: () => getWorkflowById(workflowId),
  });

  // console.log(workflow, "@WORKFLOW");

  const handleSearchResults = useCallback((results: string[]) => {
    setSearchResults(results);
  }, []);

  return (
    <ReactFlowProvider>
      <CombinedContainer className="w-full">
        <section className="w-full h-full  ">
          <WorkflowHeader
            workflow={workflow}
            onSearchResults={handleSearchResults}
          />
          <div className="border-b border-l border-r rounded-[10px] rounded-t-none h-[75vh]">
            <Editor workflow={workflow} searchResults={searchResults} />
          </div>
        </section>
      </CombinedContainer>
    </ReactFlowProvider>
  );
};
