"use client";

import { Button } from "@/components/buttons/Button";
import Spinner from "@/components/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WarningIcon from "@/icons/WarningIcon";
import { updateTeam } from "@/server/teamActions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const RestoreTeam = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for restore action
  const [initText, setInitText] = useState("Restore Team");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-50  text-yellow-400">
            <WarningIcon />
            {/* Lucide-react icon */}
          </div>
        </div>

        {/* Title */}
        <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
          Are you sure?
        </DialogTitle>

        {/* Description */}
        <DialogDescription className="p-1 text-sm text-gray-600 -mt-2">
          Do you want to restore the deleted item?
        </DialogDescription>

        {/* Footer Buttons */}
        <DialogFooter className="flex w-full items-center justify-between">
          <Button
            // variant="secondary"
            className="w-1/2 rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-sm text-[#344054]"
            onClick={() => setOpen(false)}
            disabled={loading} // Disable button while loading
          >
            {loading ? <Spinner className="w-4 h-4" size="sm" /> : "Discard"}
          </Button>
          <Button
            className="w-1/2 rounded-md border border-[#039855] bg-[#039855] shadow-sm text-white"
            onClick={async () => {
              if (id) {
                setLoading(true); // Start loading
                try {
                  await updateTeam(id!, { deleted_at: null });
                  queryClient.invalidateQueries({
                    queryKey: ["teams"],
                    exact: false,
                    type: "all",
                    refetchType: "all",
                  });
                  setOpen(false);
                  toast.success("Team Restored Successfully!");
                  // router.push("/teams");
                  router.refresh();
                } catch (e: any) {
                  const errorMessage =
                    e.response?.data?.message ||
                    e.message ||
                    "Failed to restore the device.";
                  setInitText(errorMessage);
                  toast.error(errorMessage);
                } finally {
                  setLoading(false); // End loading
                }
              }
            }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <Spinner size="sm" /> : "Restore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
