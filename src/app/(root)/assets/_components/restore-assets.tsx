"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
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
import { useState } from "react";
import { toast } from "sonner";

export const RestoreDevice = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [remarks, setRemarks] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => updateDevice(id, { deleted_at: null, remarks }),
    onSuccess: () => {
      setOpen(false);
      toast.success("Asset restored successfully");
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
    },
    onError: () => {
      toast.error("Failed to restore asset");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="rounded-lg max-w-md p-4 min-h-fit flex flex-col gap-4">
        <DialogTitle>Restore Device</DialogTitle>

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
            type="submit"
            //   disabled={loading}
            onClick={() => deleteMutation.mutate(id)}
            //   loading={loading}
          >
            Restore Device
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
