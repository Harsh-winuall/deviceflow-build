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
import { Issues, updateIssue } from "@/server/issueActions"; // Import the updateIssue function
import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import WarningIcon from "@/icons/WarningIcon";
import { useQueryClient } from "@tanstack/react-query";
import { reopenTicket, resolveTicket } from "@/server/ticketActions";

export const IssueStatusChange = ({
  id,
  issueData, // Add the issue data as a prop
  children,
  reOpen,
  className,
  onRefresh,
}: {
  id: string;
  issueData: Issues;
  children: React.ReactNode;
  reOpen: boolean;
  className?: string;
  onRefresh?: () => Promise<void>;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [initText, setInitText] = useState("Are you sure?");
  const queryClient = useQueryClient();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(className)}>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center ">
          <div>
            <WarningIcon />
          </div>
        </div>

        {/* Title */}
        <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
          Are you sure?
        </DialogTitle>

        {/* Description */}
        <DialogDescription className="-mt-4 mb-3 font-gilroyMedium text-sm text-gray-600">
          {reOpen
            ? "Are you sure you want to change the status of this ticket to Open?"
            : "Are you sure you want to change the status of this ticket to Closed?"}
        </DialogDescription>

        {/* Footer Buttons */}
        <DialogFooter className="flex w-full items-center justify-between ">
          <Button
            // className="w-1/2 rounded-md border border-[#D0D5DD] bg-[#FFF] shadow-base text-[#344054]"
            variant="outlineTwo"
            className="w-1/2"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-1/2 bg-green-700 hover:bg-green-700 hover:border-none border-none text-white"
            variant="outlineTwo"
            // className="w-1/2 rounded-md border border-[#039855] bg-[#039855] shadow-base text-white"
            onClick={async () => {
              if (id) {
                try {
                  if(!reOpen){
                    const res = await resolveTicket({ticketId: id});
                  } 
                  else{
                    const res = await reopenTicket({ticketId: id});
                  }
                  setOpen(false);
                  queryClient.invalidateQueries({
                    queryKey: ["fetch-all-tickets"],
                    exact: false,
                    refetchType: "all",
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["fetch-ticket-by-id"],
                    exact: false,
                    refetchType: "all",
                  });
                } catch (e: any) {
                  const errorMessage =
                    e.response?.data?.message ||
                    e.message ||
                    "Failed to update the ticket status.";
                  setInitText(errorMessage); // Set any error message to display
                }
              }
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
