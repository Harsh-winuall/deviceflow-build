"use client";
import RaiseTicketForm from "@/app/(root)/tickets/_components/raise-ticket.form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import React, { useState } from "react";

function CreateIssue({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center items-center gap-8">
      <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>{children}</SheetTrigger>
          <SheetContent>
            <RaiseTicketForm closeBtn={setIsOpen} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default CreateIssue;
