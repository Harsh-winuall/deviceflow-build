"use client";
import { buttonVariants } from "@/components/buttons/Button";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components/timeline/timeline";
import { Attachment02Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import DeviceTimeLine from "./device-timeline";
import UserTimeLine from "./user-timline";
import TeamTimeLine from "./team-timeline";
import ReportPreview from "@/app/(root)/diagnostic/_components/report-preview";
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserTimelineTable({ data }: { data: any }) {
  const router = useRouter();

  return (
    <div className="ml-7 mt-6 h-[60vh] xl:h-[65vh] overflow-y-auto">
      <Timeline>
        {data?.logs?.map((log) => {
          const { action, actor, target, createdAt } = log;
          const time = formatDate(createdAt);
          const actorName = actor?.name || "Unknown";
          const deviceLink = `/assets/${target?.deviceId}`;
          const userLink = `/people/${target?.userId}`;
          const oldUserLink = `/people/${target?.oldAssignedID}`;
          const actorLink = `/people/${actor?.userId}`;
          const issueLink = `/tickets/${target?.ticketId}`;
          const teamLink = `/teams/${target?.teamId}`;
          const teamName = target?.teamName || "-";
          const userName = target?.userName;
          return (
            <>
              {/* Issue */}
              {action === "issue-raised" && (
                <>
                  <TimelineItem key={log._id}>
                    <TimelineHeading className="text-sm text-black font-gilroyMedium">
                      New issue{" "}
                      <span className="text-gray-600"> created by </span>
                      <span className="underline">
                        <Link href={actorLink}>{actorName || "-"} </Link>{" "}
                        <span className="text-gray-600">
                          <Link href={issueLink}>
                            (ID: {target.issueID || "-"})
                          </Link>
                        </span>
                      </span>
                    </TimelineHeading>
                    <TimelineDot status="new-issue" />
                    <TimelineLine done />
                    <TimelineContent className="space-y-3">
                      <Link href={issueLink}>
                        <div className="border hover:border-black border-gray-200 w-[22rem]  rounded-md p-2 space-y-1">
                          <h1 className="text-sm font-gilroyMedium text-black">
                            {target?.issueTitle || "-"}
                          </h1>
                          <p className="text-[13px] text-gray-600 font-gilroyMedium line-clamp-2">
                            {target?.issueDescription || "-"}
                          </p>
                          {target?.IssueImages && (
                            <p className="flex items-center text-xs text-gray-600">
                              <HugeiconsIcon
                                icon={Attachment02Icon}
                                className="text-[#808080] size-3"
                              />
                              <span className=" font-gilroyMedium">
                                {target?.Issueimages?.length} attachments
                              </span>
                            </p>
                          )}
                        </div>
                      </Link>
                      <p className="text-xs text-gray-400 font-gilroyMedium">
                        {time}
                      </p>
                    </TimelineContent>
                  </TimelineItem>
                </>
              )}
              {action === "ticket-raised" && (
                <>
                  <TimelineItem key={log._id}>
                    <TimelineHeading className="text-sm text-black font-gilroyMedium">
                      New ticket is{" "}
                      <span className="text-gray-600"> raised by </span>
                      <span className="underline">
                        <Link href={userLink}>{userName || "-"} </Link>{" "}
                        <span className="text-gray-600">
                          <Link href={issueLink}>
                            (ID: {target.ticketCode || "-"})
                          </Link>
                        </span>
                      </span>
                    </TimelineHeading>
                    <TimelineDot status="new-issue" />
                    <TimelineLine done />
                    <TimelineContent className="space-y-3">
                      <Link href={issueLink}>
                        <div className="border hover:border-black border-gray-200 w-[22rem] rounded-md p-2 space-y-3">
                          <h1 className="text-sm font-gilroyMedium text-black">
                            {target?.ticketCategory || "-"}
                          </h1>
                          <p className="text-xs text-gray-600 font-gilroyMedium line-clamp-2">
                            {target?.ticketDescription || "-"}
                          </p>
                        </div>
                      </Link>
                      <p className="text-xs text-gray-400 font-gilroyMedium">
                        {time}
                      </p>
                    </TimelineContent>
                  </TimelineItem>
                </>
              )}
              {action === "issue-closed" && (
                <TimelineItem key={log._id}>
                  <TimelineHeading>
                    <div className="text-sm font-gilroyMedium text-[#808080]">
                      <span className="text-black">Issue closed</span> by{" "}
                      <span className="text-black underline">
                        <Link href={actorLink}>{actorName || "-"} </Link>{" "}
                      </span>{" "}
                      <Link href={issueLink}>
                        (ID: {target.issueID || "-"})
                      </Link>
                    </div>
                  </TimelineHeading>

                  <TimelineDot status="issue-closed" />
                  <TimelineLine />

                  <TimelineContent className="w-full">
                    <div className="flex flex-col gap-2 mt-1 w-full">
                      <div className="rounded-[5px] hover:border-black border border-[#E5E5E5] px-4 py-2 flex justify-between items-center w-[22rem]">
                        <p className="font-gilroyMedium text-sm text-black">
                          Display is broken (ID: {target?.issueID || "-"})
                        </p>
                        <div
                          className={buttonVariants({ variant: "outlineTwo" })}
                          style={{ cursor: "pointer" }}
                          onClick={() => router.push(`/tickets/${log._id}`)}
                        >
                          View
                        </div>
                      </div>
                      <p className="text-[13px] font-gilroyMedium text-[#CCCCCC]">
                        {time || "-"}
                      </p>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              )}
              {action === "ticket-closed" && (
                <TimelineItem key={log._id}>
                  <TimelineHeading>
                    <div className="text-sm flex gap-1 font-gilroyMedium text-[#808080]">
                      Ticket
                      <span className="text-black">
                        <Link href={`/tickets/${target?.ticketId}`}>
                          (ID: {target?.ticketCode || "-"})
                        </Link>
                      </span>
                      closed by{" "}
                      <span className="text-black underline">
                        <Link href={actorLink}>{actorName || "-"} </Link>{" "}
                      </span>{" "}
                    </div>
                  </TimelineHeading>

                  <TimelineDot status="issue-closed" />
                  <TimelineLine />

                  <TimelineContent className="space-y-3">
                    <Link href={issueLink}>
                      <div className="border hover:border-black border-gray-200 w-[22rem] rounded-md p-2 space-y-1">
                        <h1 className="text-sm font-gilroyMedium text-black">
                          {target?.ticketCategory || "-"}
                        </h1>
                        <p className="text-[13px] text-gray-600 font-gilroyMedium line-clamp-2">
                          {target?.ticketDescription || "-"}
                        </p>
                      </div>
                    </Link>
                    <p className="text-xs text-gray-400 font-gilroyMedium">
                      {time}
                    </p>
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* QC */}
              {action === "quality-check" && (
                <TimelineItem key={log._id}>
                  <TimelineHeading className="text-sm  text-gray-400 flex gap-1 font-gilroyMedium text-wrap">
                    <div>
                      Diagonistic done on{" "}
                      <Link href={`/assets/${target?.deviceId}`}>
                        <span className="underline text-black">
                          {target?.deviceName || "-"}
                        </span>
                      </Link>
                      <span className="text-gray-400">done by</span>{" "}
                      <span className="underline text-black">
                        <Link href={`/people/${target?.userId}`}>
                          {target?.userName || "-"}
                        </Link>
                      </span>
                    </div>
                  </TimelineHeading>

                  <TimelineDot status="new-scan" />
                  <TimelineLine done />

                  <TimelineContent className="space-y-3 mt-2">
                    <div className="border border-gray-200 flex justify-between items-center w-[22rem] rounded-md p-2">
                      <h1 className="flex gap-2 justify-center items-center text-sm text-black font-gilroyMedium">
                        <HugeiconsIcon
                          icon={File01Icon}
                          className="size-10  bg-blue-50 rounded-full p-2 text-[#025CE5]"
                        />
                        New Scan report
                      </h1>

                      <ReportPreview id={target?.qcReportId}>
                        <div
                          className={buttonVariants({ variant: "outlineTwo" })}
                          style={{ cursor: "pointer" }}
                        >
                          {" "}
                          View
                          {/* )} */}
                        </div>
                      </ReportPreview>
                    </div>

                    <p className="text-xs text-gray-400 font-gilroyMedium">
                      {time || "-"}
                    </p>
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* Device */}
              <DeviceTimeLine
                userName={userName}
                userLink={userLink}
                time={time}
                target={target}
                oldUserLink={oldUserLink}
                log={log}
                action={action}
                actorLink={actorLink}
                actorName={actorName}
                deviceLink={deviceLink}
              />
              {/* User */}
              <UserTimeLine
                action={action}
                actorLink={actorLink}
                actorName={actorName}
                log={log}
                target={target}
                time={time}
                userLink={userLink}
                userName={userName}
              />
              {/* Team */}
              <TeamTimeLine
                action={action}
                actorLink={actorLink}
                actorName={actorName}
                log={log}
                target={target}
                teamLink={teamLink}
                teamName={teamName}
                time={time}
                userLink={userLink}
                userName={userName}
              />
            </>
          );
        })}
      </Timeline>
    </div>
  );
}

export default UserTimelineTable;
