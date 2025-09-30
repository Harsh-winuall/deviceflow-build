"use client";
import { ActionBar } from "@/components/action-bar/action-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTicketById } from "@/server/ticketActions";
import { useQuery } from "@tanstack/react-query";
import { RemarksDialog } from "./remarks.dialog";
import TicketSection from "./ticket-section.main";
import EditTicketDialog from "../edit-ticket-dialog";

interface IssuePageProps {
  params: { id: string };
  isAdmin?: boolean;
}

function SingleIssue({ params, isAdmin = false }: IssuePageProps) {
  const { data, isError, status } = useQuery({
    queryKey: ["fetch-ticket-by-id", params.id],
    queryFn: () => getTicketById(params.id),
    refetchInterval: (query) => (query.state.error ? false : 5000),
    retry: false,
  });

  // console.log(data);

  if (isError) {
    return (
      <div className="flex justify-center font-gilroyMedium items-center h-[80vh] w-full">
        Ticket not found
      </div>
    );
  }

  return (
    <>
      <ActionBar showBackBtn>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <div className="flex  items-center rounded-md border py-[7px] px-4 gap-1 ">
              <div className="text-[#7F7F7F] text-nowrap text-sm font-gilroySemiBold">
                Ticket ID:{" "}
                <span className="text-black">{data?.[0]?.code ?? ""}</span>
              </div>
            </div>
          </div>

          {isAdmin ? (
            <div className="flex gap-2">
              <EditTicketDialog ticketId={data?.[0]?._id}>
                <div className={buttonVariants({ variant: "outline" })}>
                  Edit
                </div>
              </EditTicketDialog>
              {data?.[0] && data?.[0]?.closedAt ? (
                <RemarksDialog isReopen={true} ticketId={data?.[0]?._id}>
                  <div className={buttonVariants({ variant: "primary" })}>
                    Reopen
                  </div>
                </RemarksDialog>
              ) : (
                <RemarksDialog isReopen={false} ticketId={data?.[0]?._id}>
                  <div className={buttonVariants({ variant: "primary" })}>
                    Resolve
                  </div>
                </RemarksDialog>
              )}
            </div>
          ) : null}
        </div>
      </ActionBar>
      {status === "pending" ? (
        <IssueDetailSkeleton />
      ) : (
        <>
          {/* {JSON.stringify(data)} */}
          <TicketSection data={data?.[0]} isAdmin />
        </>
      )}
    </>
  );
}

export default SingleIssue;

function IssueDetailSkeleton() {
  return (
    <div className="flex h-[70vh] pt-4 w-full gap-4 mt-3">
      <div className="flex flex-col gap-4 w-[45%]">
        <Skeleton className="px-6 py-4 h-16" />

        <div className="flex gap-4 flex-1">
          <Skeleton className="flex-1 px-6 py-4 h-full" />

          <Skeleton className="flex-1 px-6 py-4 h-full" />
        </div>
      </div>

      <div className="flex flex-col w-[55%]">
        <Skeleton className="px-6 py-4 h-16" />

        <div className="flex flex-col gap-2 pt-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}
