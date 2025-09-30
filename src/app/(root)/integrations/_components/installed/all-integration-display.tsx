"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { formatNumber } from "@/lib/utils";
import { User } from "@/server/userActions";
import { ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React, { useState } from "react";
import { AltIntegration, IntRight } from "../icons";
import { Badge } from "@/components/ui/badge";

export default function AllIntegrationsDisplay({
  children,
  data,
  allIntegrations,
  isIntegrationFilter = false,
  isTeamBased,
  cycle,
}: {
  children: React.ReactNode;
  data?: User;
  isIntegrationFilter?: boolean;
  allIntegrations?: User["integrations"];
  isTeamBased?: boolean;
  cycle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // console.log(data)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="rounded-2xl bg-white p-6 shadow-lg max-w-[32rem]  w-full max-h-[30rem] overflow-y-auto">
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
                  Integrations
                </span>
              </div>
            </DialogTitle>
            <div className="">
              <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <PopoverTrigger
                  asChild
                  onMouseEnter={() => setDropdownOpen((prev) => !prev)}
                  className="w-full ring-1 p-1.5 text-sm ring-green-800 rounded-md cursor-pointer font-gilroyMedium text-green-900"
                >
                  <span>{`₹${formatNumber(
                    data?.totalCostPerUser ?? 0
                  )}/${"month"}`}</span>
                </PopoverTrigger>
                <PopoverContent
                  onMouseLeave={() => setDropdownOpen((prev) => !prev)}
                  align="end"
                  className="min-w-0 w-fit p-1"
                  side="bottom"
                >
                  {isIntegrationFilter ? (
                    <>
                      {data?.integrations?.map((p) => (
                        <React.Fragment key={p?.platform}>
                          <div
                            // value={p?.platform}
                            className=" focus:text-neutral-400 cursor-default select-auto focus:bg-transparent bg-transparent p-1.5 text-sm  font-gilroyMedium text-neutral-400 w-full flex justify-between items-center"
                          >
                            <div className=" flex justify-between items-center w-full gap-x-12">
                              <span>{p?.platform}</span>{" "}
                              <span>
                                {`₹${
                                  Array.isArray(p?.pricePerSeat)
                                    ? formatNumber(
                                        parseInt(
                                          p.pricePerSeat[0]?.pricePerSeat || "0"
                                        )
                                      )
                                    : formatNumber(p?.pricePerSeat ?? 0)
                                }/${"month"}`}
                              </span>
                            </div>
                          </div>
                          <div className="w-full flex justify-center items-center">
                            <div
                              className="w-[90%] h-px my-1"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(to right, #ccc 0 4px, transparent 2px 10px)",
                              }}
                            />
                          </div>
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    <>
                      {allIntegrations?.map((p) => (
                        <React.Fragment key={p?.platform}>
                          <div
                            // value={p?.platform}
                            className=" focus:text-neutral-400 cursor-default select-auto focus:bg-transparent bg-transparent p-1.5 text-sm  font-gilroyMedium text-neutral-400 w-full flex justify-between items-center"
                          >
                            <div className=" flex justify-between items-center w-full gap-x-12">
                              <span>{p?.platform}</span>{" "}
                              {/* <span>{`₹${p?.price}/month`}</span> */}
                              {(p?.orgBased === false &&
                                p?.perSeat === false) ||
                              p?.isOneTime ? (
                                <p>Central</p>
                              ) : (
                                <span>
                                  ₹
                                  {Array.isArray(p?.pricePerSeat)
                                    ? formatNumber(
                                        parseInt(
                                          p.pricePerSeat[0]?.pricePerSeat || "0"
                                        )
                                      )
                                    : formatNumber(p?.pricePerSeat ?? 0)}
                                  /month
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-full flex justify-center items-center">
                            <div
                              className="w-[90%] h-px my-1"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(to right, #ccc 0 4px, transparent 2px 10px)",
                              }}
                            />
                          </div>
                        </React.Fragment>
                      ))}
                    </>
                  )}

                  <div className=" focus:bg-transparent cursor-default select-auto w-full p-1.5 text-sm font-gilroyMedium">
                    <div className="w-full flex justify-between items-center  ">
                      <span>Total</span>{" "}
                      <span>{`₹${formatNumber(
                        data?.totalCostPerUser ?? 0
                      )}/${"month"}`}</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-4 h-full overflow-y-auto hide-scrollbar ">
            {isIntegrationFilter ? (
              <>
                {data?.integrations?.map((integration, index) => (
                  <>
                    <div
                      key={index}
                      className="flex rounded-lg border gap-4 border-b p-4 "
                    >
                      {integration?.image ? (
                        <img
                          src={integration.image}
                          alt={integration?.platform}
                          className="size-12 object-contain"
                        />
                      ) : (
                        <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-1">
                          <AltIntegration className={"size-12"} />
                        </div>
                      )}
                      <div className="text-left">
                        <h4 className="font-gilroySemiBold">
                          {integration?.platform}
                        </h4>
                        <p className="text-sm text-gray-500 font-gilroyMedium">
                          {integration?.description?.slice(0, 60)}...
                        </p>
                      </div>
                      {/* {!isTeamBased && (
                        <Link
                          href={`/integrations/installed/${integration?.platform}`}
                          onClick={() => setOpen(false)}
                        >
                          <IntRight className="size-16" />
                        </Link>
                      )} */}
                      {((integration?.orgBased === false &&
                        integration?.perSeat === false) ||
                        integration?.isOneTime) && (
                        <Badge className="w-fit ring-1 text-sm ring-green-800 rounded-md cursor-pointer font-gilroyMedium text-green-900 bg-white">
                          Central
                        </Badge>
                      )}
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
                {allIntegrations?.map((integration, index) => (
                  <>
                    <div
                      key={index}
                      className="flex justify-between items-center rounded-lg border gap-4 border-b p-4 "
                    >
                      <div
                        className="flex items-center gap-3
                      "
                      >
                        {" "}
                        {integration?.image ? (
                          <img
                            src={integration.image}
                            alt={integration?.platform}
                            className="size-12 object-contain"
                          />
                        ) : (
                          <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-1">
                            <AltIntegration className={"size-12"} />
                          </div>
                        )}
                        <div className="text-left">
                          <h4 className="font-gilroySemiBold">
                            {integration?.platform}
                          </h4>
                          <p className="text-sm text-gray-500 font-gilroyMedium">
                            {integration?.description?.slice(0, 60)}...
                          </p>
                        </div>
                      </div>
                      {/* {!isTeamBased && (
                        <Link
                          href={`/integrations/installed/${integration?.platform}`}
                          onClick={() => setOpen(false)}
                        >
                          <div className="bg-gray-100 p-1 justify-center items-center rounded-full flex">
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              className="size-6 stroke-[2]"
                            />
                          </div>
                        </Link>
                      )} */}
                      {((integration?.orgBased === false &&
                        integration?.perSeat === false) ||
                        integration?.isOneTime) && (
                        <Badge className="w-fit ring-1 text-sm ring-green-800 rounded-md cursor-pointer font-gilroyMedium text-green-900 bg-white">
                          Central
                        </Badge>
                      )}
                    </div>
                  </>
                ))}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
