import React from "react";
import Link from "next/link";
import { GetAvatar } from "@/components/get-avatar";
import {
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components/timeline/timeline";

const TeamCard = ({ target, teamLink, teamName }) => (
  <Link href={teamLink || "#"} className="w-fit">
    <div className="border-[#E5E5E5] hover:border-black border p-2 flex justify-between items-center rounded-md w-[22rem]">
      <div className="flex gap-2">
        <GetAvatar name={teamName || "Team"} size={40} />
        <div>
          <h1 className="text-sm text-black font-gilroyMedium">
            {teamName || "-"}
          </h1>
          <h3 className="text-gray-600 text-xs font-gilroyMedium">
            {target?.teamCode || "-"}
          </h3>
        </div>
      </div>
    </div>
  </Link>
);

const ActionText = ({
  action,
  teamLink,
  userLink,
  userName,
  actorLink,
  actorName,
  teamName,
  target,
}) => {
  switch (action) {
    case "created-team":
      return (
        <>
          <span className="text-black ">
            <Link href={teamLink}>{teamName || "-"}</Link>
          </span>
          team is created by{" "}
          <span className="text-black ">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>
        </>
      );
    case "delete-team":
      return (
        <>
          <span className="text-black">
            <Link href={teamLink}>{teamName || "-"}</Link>
          </span>
          team is deleted by
          <span className="text-black">
            {" "}
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>
        </>
      );
    case "removed-team-manager":
      return (
        <>
          <span className="text-black">
            <Link href={userLink}>{userName || "-"}</Link>
          </span>
          removed as the team manager of{" "}
          <span className="text-black">
            <Link href={teamLink}>{teamName || "-"}</Link>
          </span>
          by{" "}
          <span className="text-black">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>
        </>
      );
    case "add-to-team":
      return (
        <div className="flex gap-1">
          <span className="text-black">
            <Link href={userLink}>{userName || "-"}</Link>
          </span>
          is added to{" "}
          <span className="text-black">
            <Link href={teamLink}>{teamName || "-"}</Link>
          </span>
          by{" "}
          <span className="text-black">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>
        </div>
      );
    case "moved-from-team":
      return (
        <div className="flex gap-1 flex-wrap">
          <span className="text-black">
            <Link href={userLink}>{userName || "-"}</Link>
          </span>
          is moved to{" "}
          <span className="text-black">
            <Link href={teamLink}>{teamName || "-"}</Link>
          </span>{" "}
          team from{" "}
          <span className="text-black">
            <Link href={`/teams/${target?.oldTeamId}`}>
              {target?.oldTeamName || "-"}
            </Link>
          </span>{" "}
          team by{" "}
          <span className="text-black">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>
        </div>
      );
    case "remove-from-team":
      return (
        <>
          <span className="text-black">
            <Link href={userLink}>{userName || "-"}</Link>
          </span>{" "}
          is removed from{" "}
          <span className="text-black">
            <Link href={teamLink}>{teamName || "-"}</Link>
          </span>{" "}
          by{" "}
          <span className="text-black">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>
        </>
      );
    case "added-team-manager":
      return (
        <>
          <span className="text-black">
            <Link href={userLink}>{userName || "-"}</Link>
          </span>{" "}
          assigned as the team manager for{" "}
          <span className="text-black">
            <Link href={teamLink}>{teamName || "-"}</Link>
          </span>{" "}
          by{" "}
          <span className="text-black">
            <Link href={actorLink}>{actorName || "-"} </Link>
          </span>
        </>
      );
    default:
      return null;
  }
};

const statusMap = {
  "created-team": "add-to-team",
  "delete-team": "delete-team",
  "removed-team-manager": "user-deleted",
  "add-to-team": "add-to-team",
  "device-deleted": "device-deleted",
  "moved-from-team": "moved-from-team",
  "remove-from-team": "remove-from-team",
  "added-team-manager": "user-added",
};

export default function TeamTimeLine({
  action,
  log,
  teamLink,
  target,
  userLink,
  userName,
  actorLink,
  actorName,
  time,
  teamName,
}) {
  if (!statusMap[action]) return null;

  return (
    <TimelineItem key={log?._id}>
      <TimelineHeading>
        <div className="text-sm font-gilroyMedium text-[#808080]">
          <ActionText
            action={action}
            teamLink={teamLink}
            userLink={userLink}
            userName={userName}
            actorLink={actorLink}
            actorName={actorName}
            teamName={teamName}
            target={target}
          />
        </div>
      </TimelineHeading>

      <TimelineDot status={statusMap[action]} />
      <TimelineLine />

      <TimelineContent className="w-full flex flex-col gap-2 mt-1">
        <TeamCard
          target={target}
          teamLink={`/teams/${target?.teamId}`}
          teamName={teamName}
        />
        <div className="text-xs font-gilroyMedium text-[#CCCCCC]">{time}</div>
      </TimelineContent>
    </TimelineItem>
  );
}
