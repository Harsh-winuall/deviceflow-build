import React from "react";
import Link from "next/link";
import {
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components/timeline/timeline";

const ActionText = ({
  action,

  userLink,
  userName,
  actorLink,
  actorName,

  target,
}) => {
  switch (action) {
    case "added-reporting-manager":
      return (
        <>
          <span className="text-black">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>{" "}
          made{" "}
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={`/people/${target?.reporting_managerId}`}>
              {target?.managerName}
            </Link>
          </span>{" "}
          reporting manager of
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={userLink}>{userName || "-"} </Link>
          </span>{" "}
        </>
      );
    case "removed-reporting-manager":
      return (
        <>
          <span className="text-black">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>{" "}
          removed{" "}
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={`/people/${target?.reporting_managerId}`}>
              {target?.managerName}
            </Link>
          </span>{" "}
          as reporting manager of
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={userLink}>{userName || "-"} </Link>
          </span>{" "}
        </>
      );
    case "user-deleted":
      return (
        <>
          <span className="text-black">
            <Link href={userLink}>{userName || "-"} </Link>
          </span>{" "}
          is deleted from organisation by{" "}
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>{" "}
        </>
      );
    case "user-inactive":
      return (
        <>
          <span className="text-black">
            <Link href={userLink}>{userName || "-"} </Link>
          </span>{" "}
          is set as inactive by{" "}
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>{" "}
        </>
      );
    case "user-active":
      return (
        <>
          <span className="text-black">
            <Link href={userLink}>{userName || "-"} </Link>
          </span>{" "}
          is set as active by{" "}
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>{" "}
        </>
      );
    case "user-added":
      return (
        <>
          <span className="text-black">
            <Link href={userLink}>{userName || "-"} </Link>
          </span>{" "}
          is added to the organisation by{" "}
          <span className="text-black pl-[1px]">
            {" "}
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>{" "}
          <span className="text-black pl-[1px]">
            {" "}
            {target?.userCreationType || "-"}
          </span>
        </>
      );

    default:
      return null;
  }
};

const statusMap = {
  "added-reporting-manager": "user-added",
  "removed-reporting-manager": "user-deleted",
  "user-deleted": "user-deleted",
  "user-inactive": "user-inactive",
  "user-active": "user-active",
  "user-added": "user-added",
};

export default function UserTimeLine({
  action,
  log,

  target,
  userLink,
  userName,
  actorLink,
  actorName,
  time,
}) {
  if (!statusMap[action]) return null;

  return (
    <TimelineItem key={log?._id}>
      <TimelineHeading>
        <div className="text-sm font-gilroyMedium text-[#808080]">
          <ActionText
            action={action}
            userLink={userLink}
            userName={userName}
            actorLink={actorLink}
            actorName={actorName}
            target={target}
          />
        </div>
      </TimelineHeading>

      <TimelineDot status={statusMap[action]} />
      <TimelineLine />

      <TimelineContent className="w-full flex flex-col gap-2 mt-1">
        <p className="text-xs font-gilroyMedium text-[#CCCCCC]">{time}</p>
      </TimelineContent>
    </TimelineItem>
  );
}
