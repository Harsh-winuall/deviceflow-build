"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";

import { NewUserResponse, User } from "@/server/userActions";
import Link from "next/link";

export default function ManageAssets({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: NewUserResponse;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <div className="flex relative flex-col w-full h-full gap-2  justify-start items-center">
          <div className="flex justify-center items-center pb-2 gap-1 text-2xl font-gilroySemiBold">
            <h1 className="font-gilroySemiBold text-lg text-center">
              Assigned Assets
            </h1>
          </div>
          <div className="h-[1px] bg-[#E7E7E7] w-full mb-1"></div>
          <div className="h-[80vh] flex flex-col w-full gap-6 overflow-auto">
            {userData.devices?.map((deviceData) => (
              <Link
                key={deviceData._id}
                href={`/assets/${deviceData._id}`}
                className="w-[97%]  flex items-center "
              >
                <div className=" w-full bg-[#f5f5f5]  rounded-lg p-3 flex items-center gap-4 ">
                  <div className="rounded-full border object-contain py-4 px-2">
                    <img
                      src={
                        "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
                      }
                      alt="Asset-1"
                      className="w-16 h-10 "
                    />
                  </div>
                  <div className="w-full flex flex-col justify-center ">
                    <h1 className="text-black font-gilroySemiBold text-xl">
                      {deviceData?.custom_model ?? "Device"}
                    </h1>

                    <h1 className="text-[#7C7C7C] flex  items-center text-base  font-gilroyMedium">
                      {deviceData?.ram ?? "RAM"}
                      <span className="flex text-2xl mx-1 -mt-3">.</span>
                      {deviceData?.storage ?? "Storage"}
                      <span className="flex text-2xl mx-1 -mt-3">.</span>
                      {deviceData?.serial_no ?? "Serial number"}
                    </h1>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Button */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
