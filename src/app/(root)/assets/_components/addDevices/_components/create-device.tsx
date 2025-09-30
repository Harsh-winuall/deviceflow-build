"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import React, { useState } from "react";
import Form from "../Form";

function CreateDevice({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  return (
    <div className="flex justify-center items-center gap-8">
      <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>{children}</SheetTrigger>
          <SheetContent>
            <Form closeBtn={handleClose} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default CreateDevice;
