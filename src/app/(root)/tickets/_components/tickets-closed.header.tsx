import { Badge } from "@/components/ui/badge";
import React from "react";

function TicketsClosedHeader({ data }: { data: any }) {
  return (
    <div className="flex gap-3 p">
      <h1 className="text-base pl-6 font-gilroyMedium">Closed Tickets</h1>
      <Badge className="bg-[#F9F5FF] text-[#6941C6]">
        {data?.tickets?.length} Tickets
      </Badge>
    </div>
  );
}

export default TicketsClosedHeader;
