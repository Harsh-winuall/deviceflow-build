import { GetAvatar } from "@/components/get-avatar";
import { formatNumber } from "@/lib/utils";
import { Team } from "@/server/teamActions";

const TeamHeader = ({
  image,
  title,
  cycle,
  description,
  active_manager,
  totalCost,
}: Team & { totalCost: number; cycle: string }) => {
  return (
    <div className="flex justify-between items-center pl-3 pr-4 w-full">
      <div className="flex gap-4 items-center">
        <GetAvatar name={title} size={64} />
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg flex gap-3 items-center font-gilroySemiBold text-black">
            {title ?? "_"}
          </h1>
          <p className="text-sm font-gilroyMedium text-[#ADADAC]">
            Reporting Manager:{" "}
            <span className="font-gilroySemiBold text-sm text-black">
              {`${active_manager ?? "No Manager"} `}
            </span>
          </p>
        </div>
      </div>

      {totalCost === 0 ? null : (
        <div className="w-fit ring-1 p-1.5 text-sm ring-green-800 rounded-md cursor-pointer font-gilroyMedium text-green-900">
          {totalCost &&
            `₹${formatNumber(totalCost)}/
        ${cycle ?? "monthly"}`}
        </div>
      )}
    </div>
  );
};

export default TeamHeader;
