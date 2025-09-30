"use client";
import { LoadingButton } from "@/components/buttons/Button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { updateTicket } from "@/server/ticketActions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

const severityArray = [
  {
    icon: (
      <img alt="low" className="w-full" src={"/media/severity/low-sev.png"} />
    ),
    title: "Low",
    desc: `Small glitch, doesn't slow us down can wait a bit!`,
  },
  {
    icon: (
      <img
        alt="medium"
        className="w-full"
        src={"/media/severity/medium-sev.png"}
      />
    ),
    title: "Medium",
    desc: `Noticeable issue, but nothing that'll break the flow fix soon!`,
  },
  {
    icon: (
      <img
        alt="critical"
        className="w-full"
        src={"/media/severity/critical-sev.png"}
      />
    ),
    title: "Critical",
    desc: `Major issue, needs immediate attention—fix now!`,
  },
];

const EditTicketDialog = ({
  children,
  ticketId,
}: {
  children: React.ReactNode;
  ticketId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newSeverity: string) =>
      updateTicket(ticketId, { severity: newSeverity }),
    onSuccess: () => {
      toast.success("Ticket Severity Updated!");
      queryClient.invalidateQueries({
        queryKey: ["fetch-ticket-by-id", "fetch-all-tickets"],
        exact: false,
      });
      setOpen(false); // close dialog after success
    },
    onError: () => {
    //   console.log(severity);
      toast.error("Failed to update Ticket Severity!");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl bg-white p-5 shadow-lg text-center w-full">
        <h2 className="text-lg font-gilroySemiBold text-start">
          Select Severity
        </h2>

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex gap-5 w-full justify-between">
            {severityArray?.map((v) => (
              <div
                key={v?.title}
                className={cn(
                  "flex flex-col w-1/3 justify-center items-center rounded-md py-3.5 border pl-5 gap-2 cursor-pointer group",
                  severity === v.title
                    ? "border-[#025CE5] border-2"
                    : "border-[#E5E5E5]"
                )}
                onClick={() => setSeverity(v?.title)}
              >
                <div className="w-full justify-start items-center flex">
                  {v?.icon ?? ""}
                </div>
                <div className="w-full flex flex-col justify-center gap-1">
                  <div className="font-gilroyMedium text-sm text-black leading-[18.652px]">
                    {v?.title ?? ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center gap-2 mt-2">
          <DialogClose className="flex-1">
            <Button
              variant="outline"
              type="button"
              className="w-full py-3 flex-1"
            >
              Cancel
            </Button>
          </DialogClose>

          <LoadingButton
            className="w-full rounded-md h-9 bg-black text-white flex-1"
            onClick={() => mutation.mutate(severity)}
            loading={mutation.isPending}
            disabled={!severity}
          >
            Update
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTicketDialog;
