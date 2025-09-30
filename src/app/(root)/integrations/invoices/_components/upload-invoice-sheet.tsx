"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { useState } from "react";
import UploadInvoiceForm from "./upload-invoice-form";

type AssignAssetProps = {
  children: React.ReactNode;
  record?: any;
  availableIntegrations?: any[];
  startDate?: string;
  isEdit?: boolean;
};

export const UploadInvoiceSheet = ({ children, record, availableIntegrations, startDate, isEdit }: AssignAssetProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="h-fit">
        <UploadInvoiceForm isEdit={isEdit} intData={record} closeBtn={() => setOpen(false)} availableIntegrations={availableIntegrations} initStartDate = {startDate}/>
      </SheetContent>
    </Sheet>
  );
};
