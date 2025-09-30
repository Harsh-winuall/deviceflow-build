"use client";
import { Timeline } from "@/components/timeline/timeline";
import { useRouter } from "next/navigation";

import TeamTimeLine from "@/app/(root)/people/[id]/_components/team-timeline";
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

function TeamTimelineTable({ data }: { data: any }) {
  return (
    <div className="ml-7 mt-6 h-[60vh] xl:h-[65vh] overflow-y-auto">
      <Timeline>
        {data?.logs?.map((log) => {
          const { action, actor, target, createdAt } = log;
          const time = formatDate(createdAt);
          const actorName = actor?.name || "Unknown";
          const userLink = `/people/${target?.userId}`;
          const actorLink = `/people/${actor?.userId}`;
          const teamLink = `/teams/${target?.teamId}`;
          const teamName = target?.teamName || "-";
          const userName = target?.userName;
          return (
            <>
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

export default TeamTimelineTable;
