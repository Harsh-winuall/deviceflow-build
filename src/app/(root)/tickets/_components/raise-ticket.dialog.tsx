"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { useState } from "react";
import RaiseTicketForm from "./raise-ticket.form";

export default function RaiseTicket({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full gap-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="w-full">{children}</SheetTrigger>
        <SheetContent className="h-fit px-2 overflow-y-auto">
          <RaiseTicketForm closeBtn={setOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
