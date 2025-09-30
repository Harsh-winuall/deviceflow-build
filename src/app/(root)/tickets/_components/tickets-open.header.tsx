import { Badge } from "@/components/ui/badge";
import { FilterTicketsResponse } from "@/server/types/newFilterTypes";

function TicketsOpenHeader({
  countIssues: data,
}: {
  countIssues: FilterTicketsResponse;
}) {
  const criticalCount =
    data?.tickets?.filter(
      (item) => item.severity === "Critical" && !item?.closedAt
    ).length || 0;

  const mediumCount =
    data?.tickets?.filter(
      (item) => item.severity === "Medium" && !item?.closedAt
    ).length || 0;

  const lowCount =
    data?.tickets?.filter((item) => item.severity === "Low" && !item?.closedAt)
      .length || 0;

  return (
    <div className="flex gap-3">
      <h1 className="text-base pl-6 font-gilroyMedium">Open Tickets</h1>
      {criticalCount ? (
        <Badge className="bg-alert-foreground text-failure">
          {criticalCount} Critical
        </Badge>
      ) : null}
      {mediumCount ? (
        <Badge className="bg-[#FFFACB] text-[#FF8000]">
          {mediumCount} Medium
        </Badge>
      ) : null}
      {lowCount ? (
        <Badge className="bg-success-foreground text-success-second">
          {lowCount} Low
        </Badge>
      ) : null}
    </div>
  );
}

export default TicketsOpenHeader;
