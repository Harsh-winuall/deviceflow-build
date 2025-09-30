"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { useState } from "react";
import { AddressForm } from "./address-form";
import { Address } from "@/server/addressActions";

export default function EditAddress({
  children,
  address,
}: {
  children: React.ReactNode;
  address: Address;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <AddressForm closeBtn={setOpen} {...address} isEditForm={true} />
      </SheetContent>
    </Sheet>
  );
}
