import { Metadata } from "next";
import { Suspense } from "react";

import { WorkflowSkeleton } from "./_components/workflow-skeleton";
import { WorkflowByIdMain } from "./main";

export const metadata: Metadata = {
  title: "Workflows",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <Suspense fallback={<WorkflowSkeleton />}>
      <WorkflowByIdMain workflowId={id} />
    </Suspense>
  );
}
