import { Button } from "@/components/buttons/Button";
import { Device } from "@/server/deviceActions";
import { NewUserResponse, User } from "@/server/userActions";
import ManageAssets from "./manage-assets";

const AssetsSection = ({ user }: { user: NewUserResponse }) => {
  const totalAssets = user?.devices?.length;
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

        <div className="flex flex-col gap-1">
          {user?.devices?.slice(0, 2).map((device) => (
            <div className="flex justify-start items-center gap-4 py-4 border-b">
              <div className="rounded-full border object-contain py-5 px-2">
                <img
                  src={
                    "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
                  }
                  alt="Asset-1"
                  className="w-16 h-10 "
                />
              </div>
              <div className="flex flex-col ">
                <div className="font-gilroySemiBold text-lg">
                  {device?.custom_model ?? ""}
                </div>
                <div className="text-[#7C7C7C] font-gilroyMedium text-sm">
                  {device?.ram ?? ""} . {device?.storage ?? ""}
                </div>
                {device?.device_type && (
                  <div className="bg-[#ECFDF3] flex justify-center items-center rounded-2xl px-2 py-0.5 text-xs font-gilroyMedium text-[#027A48] mt-1 max-w-16">
                    <div>{device?.device_type ?? ""}</div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {totalAssets! > 2 && (
            <div className="text-[#9B9B9B] font-gilroySemiBold text-lg mt-1 text-center">
              +{totalAssets! - 2} more
            </div>
          )}
          {totalAssets !== 0 && (
            <ManageAssets userData={user}>
              <Button variant="primary" className="w-full mt-2 -mb-2">
                View Assets
              </Button>
            </ManageAssets>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetsSection;
