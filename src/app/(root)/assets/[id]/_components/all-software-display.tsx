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
import LicenseVerificationKey from "./license-key-verification";
import { GetAvatar } from "@/components/get-avatar";

interface Software {
  _id: string;
  licenseName: string;
  licenseKey: string;
  payable?: number;
  billingCycle?: string;
}

interface AllSoftwareDisplayProps {
  children: React.ReactNode;
  data: {
    _id: string;
    software: Software[];
  };
}

export default function AllSoftwareDisplay({
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
                All Softwares
              </span>
            </div>
          </DialogTitle>
        </div>

        <div className="space-y-4 h-full overflow-y-auto hide-scrollbar">
          {(data?.software || []).map((software, index) => (
            <Link key={index} href={`/assets/${data._id}/${software._id}`}>
              <div className="space-y-3 mt-3 mb-1 border hover:border-black border-[#E5E5E5] rounded-[5px] px-3 py-2">
                <div className="flex font-gilroyMedium justify-between items-center">
                  <div className="flex gap-1.5">
                    <GetAvatar
                      className="size-10 rounded-md"
                      name={software?.licenseName || "-"}
                    />

                    <div className="flex flex-col">
                      <h2 className="text-[15px]">
                        {software.licenseName || "-"}
                      </h2>
                      <div className="flex items-center">
                        <h3 className="text-[13px] text-[#808080]">
                          Key:
                          <span
                            className={`ml-0.5 px-1 rounded-sm font-gilroyMedium ${
                              verified
                                ? "text-[#808080]"
                                : "blur-sm bg-gray-100 select-none"
                            }`}
                          >
                            {verified ? software.licenseKey : null}
                          </span>
                        </h3>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="text-[#025CE5] text-[10px] pl-2 cursor-pointer"
                        >
                          <LicenseVerificationKey setVerified={setVerified}>
                            Show
                          </LicenseVerificationKey>
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="border px-2 text-xs py-1 border-[#2E8016] text-[#2E8016] font-gilroySemiBold rounded-[3px]">
                    ₹{software.payable / 100}/{software.billingCycle}
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
