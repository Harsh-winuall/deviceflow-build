"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { useState } from "react";
import { AddressForm } from "./address-form";
import { Address } from "@/server/addressActions";

export default function CreateAddress({
  totalAddresses,
  children,
}: {
  children: React.ReactNode;
  totalAddresses: Address[] | undefined;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <AddressForm closeBtn={setOpen} totalAddresses={totalAddresses} />
      </SheetContent>
    </Sheet>
  );
}
