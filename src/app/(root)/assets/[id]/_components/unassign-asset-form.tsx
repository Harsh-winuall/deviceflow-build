import React, { useState } from "react";
import { AsyncSelect } from "@/components/ui/async-select";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { fetchUsers, User } from "@/server/userActions";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDeviceLocation,
  getAllLocation,
  updateDevice,
} from "@/server/deviceActions";
import { useSession } from "next-auth/react";
import { Address } from "@/server/addressActions";

const UnassignAssetForm = ({
  setOpen,
  id,
}: {
  setOpen: (boo: boolean) => void;
  id?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User>();
  const [location, setLocation] = useState("");
  //   const session = useSession();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (physicalId: string) =>
      updateDevice(id, { userId: null, asset_owner: user?._id, physicalId }),
    onSuccess: () => {
      toast.success("Unassigned asset from user !");
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-user-by-id"],
        exact: false,
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-timeline"],
        refetchType: "all",
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["device-timeline", id],
        refetchType: "all",
        exact: false,
      });
    },
    onError: () => {
      toast.error("Failed to unassign");
    },
  });

  const handleSubmit = async () => {
    if (!location?._id) {
      toast.error("Please select a location");
      return;
    }

    setLoading(true);
    try {
      mutation.mutate(location._id); // send only the _id
    } catch (error) {
      toast.error("Some Error Occurred!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full  w-full justify-between items-start px-3 space-y-4 gap-1 pb-2">
      <div className="w-full h-full space-y-4">
        <h1 className="font-gilroySemiBold text-xl w-full">Unassign Asset</h1>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-gilroyMedium">
            Custodian<span className="text-red-500">*</span>
          </label>
          <AsyncSelect<User>
            fetcher={fetchUsers}
            queryKey="fetch-users"
            preload
            className="placeholder:text-[#CCCCCC]"
            fixInputClear={false}
            renderOption={(user) => (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="font-gilroyMedium">{user?.first_name}</div>
                  <div className="text-xs font-gilroyRegular text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
              </div>
            )}
            filterFn={(user, query) =>
              user?.first_name?.toLowerCase()?.includes(query?.toLowerCase()) ||
              user?.email?.toLowerCase()?.includes(query?.toLowerCase())
            }
            getOptionValue={(user) => user?.email}
            getDisplayValue={() => (
              <div className="flex items-center gap-2 text-left w-full">
                <div className="flex flex-col leading-tight">
                  <div className="font-gilroyMedium">{user?.email ?? ""}</div>
                </div>
              </div>
            )}
            notFound={
              <div className="py-6 text-center font-gilroyMedium text-sm">
                No users found
              </div>
            }
            label="Select User"
            placeholder="Choose"
            value={user?.email || "null"}
            onChange={(selected: User | null) =>
              setUser({
                _id: selected?._id,
                first_name: selected?.first_name,
                email: selected?.email,
                employment_type: selected?.employment_type,
                designation: selected?.designation,
              })
            }
            width="100%"
          />
          {error?.length > 0 && (
            <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-[13px] font-gilroyMedium">
              Asset Physical Location<span className="text-red-500">*</span>
            </label>
            <AsyncSelect<Address>
              fetcher={getAllLocation}
              queryKey="fetch-addresses"
              preload
              className="placeholder:text-[#CCCCCC]"
              fixInputClear={false}
              renderOption={(location) => (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <div className="font-gilroyMedium">{location.location}</div>
                    <div className="text-xs font-gilroyRegular text-muted-foreground">
                      {location.address_type}
                    </div>
                  </div>
                </div>
              )}
              filterFn={(location, query) =>
                location.location
                  ?.toLowerCase()
                  ?.includes(query?.toLowerCase()) ||
                location.address_type
                  ?.toLowerCase()
                  ?.includes(query?.toLowerCase())
              }
              getOptionValue={(location) => location.location}
              getDisplayValue={() => (
                <div className="flex items-center gap-2 text-left w-full">
                  <div className="flex flex-col leading-tight">
                    <div className="font-gilroyMedium">
                      {location.location ?? ""}
                    </div>
                  </div>
                </div>
              )}
              notFound={
                <div className="py-6 text-center font-gilroyMedium text-sm">
                  No users found
                </div>
              }
              label="Select Location"
              placeholder="Choose"
              value={location?._id || "null"}
              onChange={(selected) =>
                setLocation({
                  _id: selected?._id,
                  location: selected?.location,
                })
              }
              width="100%"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 w-full  ">
        <Button
          variant="outlineTwo"
          className="w-full"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>

        <LoadingButton
          variant="primary"
          className="w-full"
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          loading={loading}
        >
          Unassign
        </LoadingButton>
      </div>
    </div>
  );
};

export default UnassignAssetForm;
