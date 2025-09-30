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
import { Button, buttonVariants } from "@/components/buttons/Button";
import { updateUser, User } from "@/server/userActions";
import { toast } from "sonner";
import Spinner, { spinnerVariants } from "@/components/Spinner";
import WarningDelete from "@/icons/WarningDelete";
import { useQueryClient } from "@tanstack/react-query";

export const RemoveTeamMember = ({
  userData,
  children,
}: {
  userData: User;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleRemove = async () => {
    if (userData._id) {
      setLoading(true);
      try {
        await updateUser(userData._id, { teamId: null });
        setOpen(false);

        queryClient.invalidateQueries({
          queryKey: ["fetch-team-by-id"],
          exact: false,
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["get-users-by-team-id"],
          exact: false,
          refetchType: "all",
        });
        toast.success("Removed member from team !");
        router.refresh();
      } catch (e: any) {
        toast.error("Can't remove member from this team!");
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
          <div className="flex justify-center ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <WarningDelete />
            </div>
          </div>

          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Are you sure?
          </DialogTitle>

          <DialogDescription className="p-1 -mt-4 text-sm text-gray-600 font-gilroyMedium">
            Are you sure you want to remove member from this team?
          </DialogDescription>

          <DialogFooter className="flex w-full items-center justify-between">
            <Button
              className={buttonVariants({
                variant: "outlineTwo",
                className: "w-1/2",
              })}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className={buttonVariants({
                variant: "outlineTwo",
                className: "bg-[#D92D20] w-1/2 text-white border-none",
              })}
              onClick={handleRemove}
            >
              {loading ? (
                <>
                  <Spinner className={spinnerVariants({ size: "sm" })} />
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
