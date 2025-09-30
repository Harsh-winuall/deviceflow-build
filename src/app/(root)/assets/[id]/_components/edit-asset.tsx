"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Device, updateDevice } from "@/server/deviceActions";
import Form from "../../_components/addDevices/Form";
import { useQueryClient } from "@tanstack/react-query";

export default function EditAsset({
  children,
  deviceData,
}: {
  children: React.ReactNode;
  deviceData: Device;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [device, setDevice] = useState<Device>(deviceData);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await updateDevice(deviceData?._id ?? "", device);
      setOpen(false);
      toast.success("Assigned asset to user !");

      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
      setLoading(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to assign to user !");
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <Form
          closeBtn={handleClose}
          isEditForm={true}
          deviceData={deviceData}
        />
      </SheetContent>
    </Sheet>
  );
}
