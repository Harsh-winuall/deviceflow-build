"use client";

import { Button } from "@/components/buttons/Button";
import Spinner, { spinnerVariants } from "@/components/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAlert } from "@/hooks/useAlert";
import WarningDelete from "@/icons/WarningDelete";
import { deleteUser } from "@/server/userActions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteUser = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    if (id) {
      setLoading(true);
      try {
        await deleteUser(id);
        setLoading(false);
        toast.success("Successfully deleted user !");
        setOpen(false);
        router.push("/people");
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

        queryClient.invalidateQueries({
          queryKey: ["user-timeline"],
          exact: false,
          refetchType: "all",
        });
      } catch (e: any) {
        showAlert({
          title: "Failed to delete the user.",
          description:
            "User has devices assigned. Please remove all devices before deleting the user.",
          isFailure: true,
          key: "delete-user-1",
        });
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          <div className="flex justify-center">
            <WarningDelete />
          </div>

          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Are you sure?
          </DialogTitle>

          <DialogDescription className="p-1 text-sm text-gray-600">
            Are you sure you want to delete this?
          </DialogDescription>

          <DialogFooter className="flex w-full items-center justify-between ">
            <Button
              className="w-1/2 rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-sm text-[#344054]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-1/2 rounded-md bg-[#D92D20] text-white"
              onClick={handleDelete}
            >
              {loading ? (
                <>
                  <Spinner className={spinnerVariants({ size: "sm" })} />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
