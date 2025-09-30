"use client";
import EmpIssueTable from "./empIssueTable";
import { getAllResponse } from "@/server/issueActions";

export const Issue = ({ issues }: { issues: any }) => {
  return (
    <div className="w-full overflow-y-auto">
      <EmpIssueTable data={issues} />
    </div>
  );
};

export default Issue;
