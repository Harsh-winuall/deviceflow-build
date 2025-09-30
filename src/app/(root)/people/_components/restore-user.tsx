"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/buttons/Button";
import Spinner from "@/components/Spinner";
import { updateUser } from "@/server/userActions";
import { toast } from "sonner";
import WarningIcon from "@/icons/WarningIcon";
import { useQueryClient } from "@tanstack/react-query";
import ExtraSeatConfirmationDialog from "@/components/settings/extra-seat-dialog";

export const RestoreUser = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extraSeatData, setExtraSeatData] = useState<any>(null);
  const [extraSeatDialogOpen, setExtraSeatDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  async function restoreUser(id: string) {
    setLoading(true); // Start loading
    try {
      const res = await updateUser(id!, { deleted_at: null });
      if (res.message) {
        setExtraSeatData(res);
        setExtraSeatDialogOpen(true);
        return;
      }

      console.log(res);
      setOpen(false);
      toast.success("User restored Successfully! ");
      queryClient.invalidateQueries({
        queryKey: ["fetch-people"],
        exact: false,
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-user-by-id"],
        exact: false,
        refetchType: "all",
      });
    } catch (e: any) {
      toast.error("Some Error Occured! Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <WarningIcon />
        </div>

        {/* Title */}
        <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
          Are you sure?
        </DialogTitle>

        {/* Description */}
        <DialogDescription className="-mt-4 mb-3 font-gilroyMedium text-sm text-gray-600">
          Do you want to restore the deleted item?
        </DialogDescription>

        {/* Footer Buttons */}
        <DialogFooter className="flex w-full items-center justify-between">
          <Button
            type="button"
            className="rounded-lg text-sm  w-full font-gilroySemiBold border border-black"
            onClick={() => setOpen(false)}
          >
            {"Discard"}
          </Button>
          <Button
            type="submit"
            className="rounded-lg bg-black text-white text-sm  w-full font-gilroySemiBold border border-black"
            onClick={() => restoreUser(id)}
            disabled={loading} // Disable button while loading
          >
            {loading ? <Spinner /> : "Restore"}
          </Button>
        </DialogFooter>

        <ExtraSeatConfirmationDialog
          open={extraSeatDialogOpen}
          setOpen={setExtraSeatDialogOpen}
          data={extraSeatData}
          followingFn={() => {
            restoreUser(id);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
