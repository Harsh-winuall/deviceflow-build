"use client";
import RaiseTicket from "@/app/(root)/tickets/_components/raise-ticket.dialog";
import { UserData } from "@/app/store/authSlice";
import { buttonVariants } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import NoAssetAssignedIcon from "@/icons/NoAssetAssignedIcon";
import { Device, getAllDevicesProp } from "@/server/deviceActions";
import { useRouter } from "next/navigation";

export type LoggedInUser = UserData;

type DevicesProps = {
  devices: getAllDevicesProp;
};

const Devices = ({ devices }: DevicesProps) => {
  const router = useRouter();

  const handleDeviceClick = (id: string | undefined) => {
    router.push(`devices/${id}`);
  };

  // Helper function to calculate warranty days
  const calculateWarrantyDays = (expiryDate: string): number => {
    const currentDate = new Date();
    const expirationDate = new Date(expiryDate);
    const timeDifference = expirationDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days
  };

  return (
    <div className="flex py-2 gap-5 flex-wrap">
      {devices?.length > 0 ? (
        devices?.map((device: Device) => {
          const warrantyDays = calculateWarrantyDays(
            device?.warranty_expiary_date!
          );
          const inWarranty = warrantyDays > 0;

          return (
            <div
              key={device?._id}
              className="flex rounded-lg border border-[rgba(195,195,195,0.31)] bg-[rgba(255,255,255,0.8)] backdrop-blur-[22.8px] px-6 py-4 max-xl:w-[calc(50%-20px)] max-2xl:w-[calc(33.33%-20px)]"
            >
              {/* Device Information */}
              <div className="flex flex-col w-80 h-[70vh] gap-4 cursor-pointer">
                <div
                  className="flex justify-start items-center  gap-4"
                  onClick={() => handleDeviceClick(device?._id)}
                >
                  <GetAvatar name={device?.custom_model} size={50} />

                  <div>
                    <div className="text-xl font-gilroySemiBold text-black">
                      {device?.custom_model ?? ""}
                    </div>
                    <div className="font-gilroyMedium text-base text-[#7C7C7C]">
                      {device?.serial_no ?? ""}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="h-[1px] bg-[#D6D6D6] w-full"></div>
                </div>

                <div className="flex flex-col gap-2 ">
                  <div>
                    <h1 className="text-[#737373] text-[14px] font-gilroyMedium">
                      Brand
                    </h1>
                    <h1 className=" text-base font-gilroySemiBold">
                      {device?.brand}
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-[#737373] text-[14px] font-gilroyMedium">
                      Model
                    </h1>
                    <h1 className=" text-base font-gilroySemiBold">
                      {device?.custom_model}
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-[#737373] text-[14px] font-gilroyMedium">
                      RAM
                    </h1>
                    <h1 className=" text-base font-gilroySemiBold">
                      {device?.ram}
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-[#737373] text-[14px] font-gilroyMedium">
                      Storage
                    </h1>
                    <h1 className=" text-base font-gilroySemiBold">
                      {device?.storage}
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-[#737373] text-[14px] font-gilroyMedium">
                      Assigned On
                    </h1>
                    <h1 className=" text-base font-gilroySemiBold">
                      24th November
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-[#737373] text-[14px] font-gilroyMedium">
                      Condition
                    </h1>
                    <h1 className=" text-base text-[#008910] font-gilroySemiBold">
                      Excellent
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-[#737373] text-[14px] font-gilroyMedium">
                      Warranty Status
                    </h1>
                    <h1
                      className={`text-base font-gilroySemiBold ${
                        inWarranty ? "text-[#008910]" : "text-[#FF0000]"
                      }`}
                    >
                      {inWarranty
                        ? `In Warranty: ${warrantyDays} days`
                        : "Out of Warranty"}
                    </h1>
                  </div>
                </div>

                <RaiseTicket>
                  <div className={buttonVariants({ variant: "primary" })}>
                    Raise a Ticket
                  </div>
                </RaiseTicket>
              </div>

              {/* Report Issue Button */}
            </div>
          );
        })
      ) : (
        <div className="flex w-full justify-center items-center">
          {" "}
          <NoAssetAssignedIcon />
        </div>
      )}
    </div>
  );
};

export default Devices;
