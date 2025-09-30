"use client";

import {
  Button,
  buttonVariants,
  LoadingButton,
} from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAlert } from "@/hooks/useAlert";
import { toast } from "sonner";
import WarningDelete from "@/icons/WarningDelete";
import { deleteDevice } from "@/server/deviceActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const DeleteAsset = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      setOpen(false);
      toast.success("Asset deleted Successfully!");

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

      router.push("/assets");
    },
    onError: () => {
      showAlert({
        title: "Failed to delete asset.",
        description: "Device is assigned to a user. Can't delete asset",
        isFailure: true,
        key: "delete-asset-1",
      });
      setOpen(false);
    },
  });

  // const handleDelete = async () => {
  //   if (id) {
  //     try {
  //       await deleteDevice(id);
  //       setOpen(false);
  //       toast.success("Asset deleted Successfully!");
  //       router.push("/assets");
  //       // router.refresh();
  //     } catch (e: any) {
  //       showAlert({
  //         title: "Failed to delete asset.",
  //         description: "Device is assigned to a user. Can't delete asset",
  //         isFailure: true,
  //         key: "delete-asset-1",
  //       });
  //       setOpen(false);
  //     }
  //   }
  // };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="w-fit">
          {children}
        </DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          <div className="flex justify-center">
            <WarningDelete />
          </div>

          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Are you sure?
          </DialogTitle>

          <DialogDescription className="p-1 -mt-4 text-sm text-gray-600">
            Are you sure you want to delete this device?
          </DialogDescription>

          <DialogFooter className="flex w-full items-center justify-between">
            <button
              className={buttonVariants({
                variant: "outlineTwo",
                className: "w-full",
              })}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <LoadingButton
              className="w-full rounded-md h-9 bg-[#D92D20] text-white"
              onClick={() => mutation.mutate(id)}
              loading={mutation.isPending}
            >
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
