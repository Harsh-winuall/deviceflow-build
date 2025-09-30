import {
  deleteSingleLocations,
  getAllLocations,
} from "@/server/settingActions";
import { Button } from "../buttons/Button";
import {
  Delete03Icon,
  LaptopIcon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import AddNewLocation from "./add-new-location";

function SkeletonLocationCard() {
  return (
    <div className="border flex mb-4 flex-col gap-3 border-[#E5E5E5] rounded-md py-3 px-4 animate-pulse">
      <div className="h-3 w-1/3 bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
      <div className="h-[1px] bg-[#E5E5E5] -mx-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-10 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function AssetLocations() {
  const queryClient = useQueryClient();
  const { data: AllLocationData, isLoading } = useQuery({
    queryKey: ["all-locations"],
    queryFn: async () => await getAllLocations(),
  });

  const deleteSingleLocation = useMutation({
    mutationFn: deleteSingleLocations,
    onSuccess: () => {
      toast.success("Location deleted");
      queryClient.invalidateQueries({ queryKey: ["all-locations"] });
    },
    onError: () => {
      toast.error("Failed to delete location");
    },
  });

  const handleDelete = async (id?: string, address_type?: string) => {
    if (address_type === "default") {
      toast.error("Default address can't be deleted");
      return;
    }
    deleteSingleLocation.mutate({ locationId: id });
  };

  if (isLoading) {
    return (
      <div className="h-[50vh] w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLocationCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="h-[50vh] w-full ">
      {AllLocationData.length === 0 ? (
        <div className="flex flex-col gap-6 justify-center items-center py-8">
          <div className="flex  font-gilroySemiBold flex-col   justify-center items-center ">
            <img
              src="/media/no_data/no_asset_location.webp"
              alt="No-People Logo"
            />
          </div>

          <AddNewLocation isEdit={false}>
            <Button variant="primary" className="text-xs h-8">
              {" "}
              Add New Locations
            </Button>
          </AddNewLocation>
        </div>
      ) : (
        AllLocationData?.map((item) => (
          <div key={item._id} className="flex flex-col gap-4 h-fit ">
            <div className="border flex mb-4 flex-col gap-2 border-[#E5E5E5] rounded-md py-3 px-4">
              <h1 className="text-[15px] flex justify-between font-gilroySemiBold ">
                {item.label}
                {item.address_type === "default" && (
                  <span className="ml-3 bg-[#E7F5E5] text-xs h-fit py-0.5 text-[#027A48] rounded-full px-2">
                    Default
                  </span>
                )}
              </h1>
              <h1 className="text-sm font-gilroyMedium">{item.location}</h1>
              <div className="h-[1px] bg-[#E5E5E5] -mx-4"></div>
              <div className="flex justify-between items-center">
                <h1 className="text-xs pl-4 flex items-center font-gilroyMedium">
                  <HugeiconsIcon
                    icon={LaptopIcon}
                    className="size-[14px] mr-1 -mt-[2px]"
                  />
                  {item.deviceCount} Assets
                </h1>
                <span className="text-[#E5E5E5]">|</span>
                <AddNewLocation isEdit={true} locationData={item}>
                  <h1 className="text-xs flex items-center font-gilroyMedium text-[#004DFF]">
                    <HugeiconsIcon
                      icon={PencilEdit01Icon}
                      className="mr-1 size-3 -mt-[2px]"
                    />
                    Edit
                  </h1>
                </AddNewLocation>
                <span className="text-[#E5E5E5]">|</span>
                <h1
                  onClick={() => handleDelete(item._id, item.address_type)}
                  className="text-xs cursor-pointer pr-4 flex items-center font-gilroyMedium text-[#F00]"
                >
                  <HugeiconsIcon
                    icon={Delete03Icon}
                    className="mr-1 -mt-[2px] size-3"
                  />
                  Delete
                </h1>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AssetLocations;
