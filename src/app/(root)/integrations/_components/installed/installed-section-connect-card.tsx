import { Badge } from "@/components/ui/badge";
import { UserIcon, Wallet01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AltIntegration } from "@/app/(root)/integrations/_components/icons";
import React from "react";

export type CardInterface = {
  src?: string;
  name?: string;
  description?: string;
  amount?: string | number;
  seats?: string | number;
  orgBased?: boolean;
  oneTime?: boolean;
  perSeat?: boolean;
  isCustom?: boolean;
};

function ConnectionCard({
  src,
  name,
  description,
  amount,
  seats,
  orgBased,
  oneTime,
  perSeat,
  isCustom,
}: CardInterface) {
  return (
    <div className="border border-[#B4B4B4] h-56 hover:border-black max-w-md w-full rounded-lg p-4 flex flex-col gap-3 relative">
      <div className="flex justify-between items-center">
        {src ? (
          <img
            src={src ?? ""}
            alt={name ?? "logo"}
            className="size-14 object-cover rounded-xl"
          />
        ) : (
          <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-1">
            <AltIntegration className={"size-14"} />
          </div>
        )}

        <Badge className="text-[#2E8016] font-gilroySemiBold bg-[#E2FBE6] absolute top-4 right-4">
          Connected
        </Badge>
      </div>
      <h1 className="text-xl/5 -mb-1 font-gilroySemiBold">{name ?? "Slack"}</h1>
      <p className="text-[#7F7F7F] text-sm font-gilroyMedium line-clamp-2 h-10">
        {description ?? "-"}
      </p>
      <div className="h-[1px] bg-[#f3f3f3]"></div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <HugeiconsIcon
            icon={Wallet01FreeIcons}
            className="text-neutral-400 size-4"
          />
          <h1 className="text-sm font-gilroyMedium">₹{amount}</h1>
        </div>
        {isCustom && (orgBased || (orgBased===false && perSeat===false) || oneTime) ? (
          <p className="text-sm font-gilroyMedium">Central Level</p>
        ) : oneTime ? (
          <p className="text-sm font-gilroyMedium">One Time</p>
        ) : (
          <div className="flex gap-2 items-center">
            <HugeiconsIcon
              icon={UserIcon}
              className="text-neutral-400 size-4"
            />
            <h1 className="text-sm font-gilroyMedium">{seats} Seats</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectionCard;
