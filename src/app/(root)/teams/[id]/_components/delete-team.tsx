"use client";

import { Button, buttonVariants } from "@/components/buttons/Button";
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
import { deleteTeam } from "@/server/teamActions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteTeam = ({
  id,
  children,
  onRefresh,
}: {
  id: string;
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}) => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteTeam(id);
        setOpen(false);

        queryClient.invalidateQueries({
          queryKey: ["teams"],
          exact: false,
          type: "all",
          refetchType: "all",
        });
        router.refresh();
        router.push("/teams?tab=active-teams");
        toast.success("Team Deleted Successfully!");
      } catch (e: any) {
        showAlert({
          title: "Failed to delete the team.",
          description:
            "This team has members. Please remove all members before deleting the team.",
          isFailure: true,
          key: "delete-team-1",
        });
        setOpen(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          {/* Warning Icon */}
          <div className="flex justify-center ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <WarningDelete />
            </div>
          </div>

          {/* Title */}
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Are you sure?
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="p-1 -mt-4 text-sm text-gray-600">
            Are you sure you want to delete team?
          </DialogDescription>

          {/* Footer Buttons */}
          <DialogFooter className="flex w-full items-center justify-between ">
            {/* <Button
              className="w-1/2 rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-sm text-[#344054]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-1/2 rounded-md bg-[#D92D20] text-white"
              onClick={handleDelete}
            >
              Delete
            </Button> */}
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
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
