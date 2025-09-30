import { Device } from "@/server/deviceActions";
import { NewUserResponse, User } from "@/server/userActions";
import { useRouter } from "next/navigation";
import React from "react";

const AssetsSection = ({ user }: { user: NewUserResponse }) => {
  const totalAssets = user?.devices?.length;
  const router = useRouter();
  return (
    <>
      <div className=" w-full">
        <div className="flex justify-between">
          <div className="text-black -mt-2 font-gilroySemiBold text-lg">
            Assets Issued
          </div>
          <div>
            <h1 className="text-xs bg-[#ECFDF3] py-1 rounded-2xl -mt-2 px-2 font-gilroyMedium  text-[#027A48]">
              {totalAssets} Assigned
            </h1>
          </div>
        </div>

        {/* Assets */}

        <div className="flex flex-col  gap-1">
          {user?.devices?.slice(0, 2).map((device) => (
            <div className="flex justify-start items-center gap-4 py-4 border-b">
              <div className="">
                <img
                  src={`${
                    device?.image
                  } || ${"https://d22e6o9mp4t2lx.cloudfront.net/cms/pfp3_d7855f9562.webp"}`}
                  alt="Asset-1"
                  className="size-16 rounded-full"
                />
              </div>
              <div className="flex flex-col ">
                <div className="font-gilroySemiBold text-lg">
                  {device?.device_name}
                </div>
                <div className="text-[#7C7C7C] font-gilroyMedium text-sm">
                  {device?.ram} . {device?.storage}
                </div>
                <div className="bg-[#ECFDF3] flex justify-center items-center rounded-2xl px-2 py-0.5 text-xs font-gilroyMedium text-[#027A48] mt-1 max-w-16">
                  <div>{device?.device_type}</div>
                </div>
              </div>
            </div>
          ))}

          {totalAssets! > 2 && (
            <div className="text-[#9B9B9B] font-gilroySemiBold text-lg mt-1 text-center">
              +{totalAssets! - 2} more
            </div>
          )}

          <div className="text-center mt-2 cursor-pointer">
            <div
              className="text-white cursor-pointer bg-black font-gilroySemiBold text-base w-full mt-2 py-2 rounded-md"
              onClick={() => {
                router.push("/devices");
              }}
            >
              View Assets
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetsSection;
