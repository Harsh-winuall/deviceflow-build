"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { buttonVariants } from "@/components/buttons/Button";
import { Pagination, PaginationSkeleton } from "@/components/pagination";

import { ActionBar } from "@/components/action-bar/action-bar";
import {
  fetchQcReportsAdmin,
  fetchQcReportsEmployee,
} from "@/server/checkMateActions";
import { getAdminSummaryServer } from "@/server/orgActions";
import AdminAISummaryModal from "./AdminAiSummaryModal";
import QcTable from "./qc.table";

export const Main = ({ isAdmin }: { isAdmin: boolean }) => {
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, status, isError } = useQuery({
    queryKey: [
      "fetch-diagnostics",
      {
        page,
        pageLimit,
        isAdmin,
      },
    ],
    queryFn: () =>
      isAdmin
        ? fetchQcReportsAdmin({ page: page, limit: pageLimit })
        : fetchQcReportsEmployee({ page: page, limit: pageLimit }),
  });

  const getAdminSummaryMutation = useMutation({
    mutationFn: getAdminSummaryServer,
  });

  return (
    <section className="w-full h-fit space-y-4 relative overflow-hidden">
      {data && data?.data?.length !== 0 && isAdmin ? (
        <ActionBar key={`diagnostics-action-bar`}>
          <div className="flex w-full justify-end">
            <AdminAISummaryModal
              isPending={getAdminSummaryMutation?.isPending}
              data={getAdminSummaryMutation?.data}
            >
              <div
                className={buttonVariants({ variant: "primary" })}
                onClick={() => {
                  getAdminSummaryMutation.mutate();
                }}
              >
                Generate AI Summary
              </div>
            </AdminAISummaryModal>
          </div>
        </ActionBar>
      ) : null}
      {/* <div className="mt-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"> */}
      <QcTable
        key={`${isAdmin}-76898`}
        isAdmin={isAdmin}
        data={data}
        isError={isError}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        status={status}
      />
      {/* </div> */}

      {status === "pending" ? (
        <>
          <PaginationSkeleton className="mt-3" />
        </>
      ) : (
        <>
          <Pagination
            page={page}
            pageLimit={pageLimit}
            key={`disgnostics-pagination`}
            total={data?.totalRecords || 0}
            items={data?.data || []}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
            onPageLimitChange={(l) => {
              setPageLimit(l);
              setPage(1);
            }}
            className="mt-4"
          />
        </>
      )}
    </section>
  );
};
