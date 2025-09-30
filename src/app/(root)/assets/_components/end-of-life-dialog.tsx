"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
import React, { useState } from "react";
import { AsyncSelect } from "@/components/ui/async-select";

import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { fetchUsers, User } from "@/server/userActions";

import { getAllLocation } from "@/server/deviceActions";
import { useSession } from "next-auth/react";
import { Address } from "@/server/addressActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import WarningIcon from "@/icons/WarningIcon";
import { updateDevice } from "@/server/deviceActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export const MarkAsEndOfLife = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [remarks, setRemarks] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<{
    _id: string;
    location: string;
  } | null>(null);

  const markAsEOL = useMutation({
    mutationFn: (payload: {
      id: string;
      remarks: string;
      asset_owner?: string;
      physicalId?: string;
    }) =>
      updateDevice(payload.id, {
        end_life: true,
        remarks: payload.remarks,
        asset_owner: payload.asset_owner,
        physicalId: payload.physicalId,
      }),
    onSuccess: () => {
      setOpen(false);
      toast.success("Asset marked as end of life");
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
        queryKey: ["device-timeline"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to mark as end of life");
    },
  });

  const handleSubmit = () => {
    markAsEOL.mutate({
      id,
      remarks,
      asset_owner: user?._id,
      physicalId: location?._id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-fit">
        {children}
      </DialogTrigger>

      <DialogContent className="rounded-lg max-w-md p-4 min-h-fit flex flex-col gap-4">
        <DialogTitle>Mark Asset as End of Life?</DialogTitle>
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
                    <div className="font-gilroyMedium">{location?.location}</div>
                    <div className="text-xs font-gilroyRegular text-muted-foreground">
                      {location?.address_type}
                    </div>
                  </div>
                </div>
              )}
              filterFn={(location, query) =>
                location?.location
                  ?.toLowerCase()
                  ?.includes(query?.toLowerCase()) ||
                location.address_type
                  ?.toLowerCase()
                  ?.includes(query?.toLowerCase())
              }
              getOptionValue={(location) => location?.location}
              getDisplayValue={() => (
                <div className="flex items-center gap-2 text-left w-full">
                  <div className="flex flex-col leading-tight">
                    <div className="font-gilroyMedium">
                      {location?.location ?? ""}
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
        <div className="flex flex-col gap-1">
          <Textarea
            placeholder="Leave your remarks..."
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
            }}
            className="placeholder:text-[#CCCCCC] placeholder:text-xs placeholder:font-gilroyMedium font-gilroyMedium min-h-24"
          ></Textarea>
        </div>

        <DialogFooter>
          <LoadingButton
            variant="primary"
            className="w-full"
            type="button"
            onClick={handleSubmit}
            loading={markAsEOL.isPending}
          >
            Mark as End of Life
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
