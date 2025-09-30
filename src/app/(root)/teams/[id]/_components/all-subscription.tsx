"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React, { useState } from "react";
import { GetAvatar } from "@/components/get-avatar";

interface AllSoftwareDisplayProps {
  children: React.ReactNode;
  data: {
    _id: string;
    subscriptionSummary: any;
  };
}

export default function AllTeamSubscriptions({
  children,
  data,
}: AllSoftwareDisplayProps) {
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl bg-white p-6 shadow-lg max-w-[32rem] w-full max-h-[30rem] overflow-y-auto">
        <div className="flex justify-between items-center pb-5">
          <DialogTitle className="text-lg font-gilroySemiBold">
            <div className="flex gap-2 items-center">
              <div className="bg-neutral-100 size-7 mr-2 rounded-full cursor-pointer flex items-center justify-center">
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  onClick={() => setOpen(false)}
                  className="size-4"
                  strokeWidth={1.8}
                />
              </div>
              <span className="text-base font-gilroySemiBold">
                All Subscriptions
              </span>
            </div>
          </DialogTitle>
        </div>

        <div className="space-y-4 h-full overflow-y-auto hide-scrollbar">
          {(data?.subscriptionSummary || []).map((software, index) => (
            <Link
              key={index}
              href={`/integrations/installed/${software?.platform}`}
            >
              <div className="space-y-3 mt-3 mb-1 border hover:border-black border-[#E5E5E5] rounded-[5px] px-3 py-2">
                <div className="flex font-gilroyMedium justify-between items-center">
                  <div className="flex gap-1.5">
                    <img
                      src={software?.image || "-"}
                      className="size-10 rounded-md"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-[15px] line-clamp-1">
                        {software?.platform || "-"}
                      </h2>
                      <h2 className="text-[13px] text-[#808080] line-clamp-1">
                        {software?.userCount}
                        {software?.userCount > 0 ? "Seats" : "Seat"}
                      </h2>
                      {/* {JSON.stringify(software)} */}
                    </div>
                  </div>
                  <span className="border w-32 text-center text-xs py-1 border-[#2E8016] text-[#2E8016] font-gilroySemiBold rounded-[3px]">
                    ₹{software?.price.toFixed(2)}/monthly
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
