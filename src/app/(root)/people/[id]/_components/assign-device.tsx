"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";

import { Button, LoadingButton } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  Device,
  fetchUnassignedDevices,
  updateDevice,
} from "@/server/deviceActions";
import { NewUserResponse } from "@/server/userActions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateDeviceDialog from "@/app/(root)/assets/_components/addDevices/_components/add-device-form";
import { Plus } from "lucide-react";

export default function AssignDevice({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: NewUserResponse;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [device, setDevice] = useState<Device>();
  const [error, setError] = useState("");

  // useEffect(() => {
  //   setError("");
  // }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!device?._id) {
      setError("Device required");
      return;
    }

    setLoading(true);
    try {
      await updateDevice(device?._id ?? "", { userId: userData?._id });
      queryClient.invalidateQueries({
        queryKey: ["fetch-user-by-id"],
        exact: false,
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-timeline"],
        exact: false,
        refetchType: "all",
      });
      setOpen(false);
      toast.success("Assigned asset to user !");
      setLoading(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to assign to user !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setError("");
        setDevice(undefined);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-4 rounded-[10px] max-w-sm  w-full ">
        <div className="flex justify-center  h-full items-start">
          <div className="flex flex-col w-full h-full ">
            <h1 className="font-gilroySemiBold text-xl text-start">
              Assign Asset
            </h1>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4 pt-3 relative h-full"
            >
              <div className="flex flex-col gap-2 ">
                <AsyncSelect<Device>
                  fetcher={fetchUnassignedDevices}
                  queryKey="fetch-unassigned-devices"
                  preload
                  // fixInputClear={false}
                  renderOption={(device) => (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="font-gilroyMedium">
                          {device?.custom_model}
                        </div>
                        <div className="text-xs font-gilroyRegular text-muted-foreground">
                          {device?.device_name}
                        </div>
                      </div>
                    </div>
                  )}
                  filterFn={(device, query) =>
                    device?.custom_model
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase()) ||
                    device?.device_name
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase())
                  }
                  getOptionValue={(device) => device?.custom_model}
                  getDisplayValue={() => (
                    <div className="flex items-center gap-2 text-left w-full">
                      <div className="flex flex-col leading-tight">
                        <div className="font-gilroyMedium">
                          {device?.custom_model ?? ""}
                        </div>
                      </div>
                    </div>
                  )}
                  notFound={
                    <CreateDeviceDialog>
                      <div className="w-full flex justify-center items-center p-2">
                        <div className="py-2 px-6 hover:bg-gray-50 cursor-pointer border border-gray-200 rounded-[5px] text-black flex justify-center items-center text-center font-gilroyMedium text-sm">
                          <Plus className="size-4" />
                          Create Asset
                        </div>
                      </div>
                    </CreateDeviceDialog>
                  }
                  label="Device"
                  placeholder="Assign Device"
                  value={device?.custom_model || "null"}
                  onChange={(selected) =>
                    setDevice({
                      _id: selected?._id,
                      device_name: selected?.device_name,
                      custom_model: selected?.custom_model,
                      ram: selected?.ram,
                      storage: selected?.storage,
                      image: selected?.image,
                      serial_no: selected?.serial_no,
                    })
                  }
                  width="100%"
                />
                {error.length > 0 && (
                  <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-2  w-full ">
                <Button
                  variant="outlineTwo"
                  className="w-full"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <LoadingButton
                  variant="primary"
                  className="w-full"
                  type="submit"
                  disabled={loading}
                  loading={loading}
                >
                  Assign
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
