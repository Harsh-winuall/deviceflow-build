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
import WarningDelete from "@/icons/WarningDelete";
import { deleteCustomIntegration } from "@/server/customIntegrationActions";
import { deleteIntegrationById } from "@/server/integrationActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const RemoveCustomIntegration = ({
  id,
  children,
}: {
  id: string;

  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCustomIntegration,
    onSuccess: async () => {
      toast.success("Integration deleted!!");
      await queryClient.invalidateQueries({
        queryKey: ["user-by-integrations", "all-data"],
        exact: true,
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["fetch-people"],
        exact: false,
        refetchType: "all",
      });
      queryClient.removeQueries({
        queryKey: ["user-by-integrations"],
        exact: false,
        type: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["all-integrations"],
        exact: false,
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-integration-by-id"],
        exact: false,
        refetchType: "all",
      });
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          <div className="flex justify-center ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <WarningDelete />
            </div>
          </div>

          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Are you sure?
          </DialogTitle>

          <DialogDescription className="p-1 -mt-4 text-sm text-gray-600">
            Are you sure you want to delete this?
          </DialogDescription>

          <DialogFooter className="flex w-full items-center justify-between ">
            <Button
              className="w-1/2 rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-sm text-[#344054]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <LoadingButton
              className="w-1/2 rounded-md bg-[#D92D20] text-white"
              onClick={() => {
                mutation.mutate({ id: id });
                router.push("/integrations/installed");
              }}
              disabled={mutation.isPending}
              loading={mutation.isPending}
              onMouseEnter={() => router.prefetch("/integrations/installed")}
            >
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
