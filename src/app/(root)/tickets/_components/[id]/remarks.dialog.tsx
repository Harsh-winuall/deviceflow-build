import { LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { reopenTicket, resolveTicket } from "@/server/ticketActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const RemarksDialog = ({
  children,
  isReopen,
  ticketId,
}: {
  isReopen: boolean;
  ticketId: string;
  children: React.ReactNode;
}) => {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) {
      setRemarks("");
      setError("");
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: isReopen ? reopenTicket : resolveTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-ticket-by-id"],
        exact: false,
        type: "all",
        refetchType: "all",
      });
      setOpen(false);
      toast.success(isReopen ? "Issue reopened" : "Issue resolved");
    },
    onError: () => {
      toast.error(
        isReopen ? "Failed to reopen issue" : "Failed to resolve issue"
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        closeButton
        className="rounded-2xl bg-white p-4 shadow-lg max-w-sm w-full text-center"
      >
        <DialogHeader>
          <DialogTitle className="text-base font-gilroySemiBold">
            Remarks
          </DialogTitle>
        </DialogHeader>

        <Textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className={cn(
            "h-20 placeholder:text-[#00000033] font-gilroyRegular mb-0",
            error ? "ring-1 ring-destructive" : "border"
          )}
          placeholder="Leave your remarks..."
        />
        {/* <div className="text-destructive/80 text-xs text-left -mb-2 pb-1 -mt-3 font-gilroyMedium">
          {error}
        </div> */}

        <DialogFooter className="flex w-full  items-center justify-between">
          <LoadingButton
            onClick={() => {
              if (!remarks.trim().length) {
                setError("Remark is required");
              } else {
                setError("");
                mutation.mutate({ ticketId, remarks });
              }
            }}
            variant="primary"
            loading={mutation?.isPending}
            className="flex-1"
          >
            {isReopen ? "Reopen" : " Mark as Resolve"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
