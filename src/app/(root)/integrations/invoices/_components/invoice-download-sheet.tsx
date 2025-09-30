"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { useState } from "react";
import DownloadInvoiceForm from "./download-invoice-form";

type AssignAssetProps = {
  children: React.ReactNode;
  startDate?: string;
  endDate?: string;
  items?: any[];
  availableIntegrations?: string[];
};

export const InvoiceDownload = ({
  children,
  startDate,
  endDate,
  items,
  availableIntegrations,
}: AssignAssetProps) => {
  const [open, setOpen] = useState(false);
  // console.log(startDate, endDate);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="h-fit">
        <DownloadInvoiceForm
          autoStartDate={startDate}
          autoEndDate={endDate}
          closeBtn={() => setOpen(false)}
          items={items}
          availableIntegrations={availableIntegrations}
        />
      </SheetContent>
    </Sheet>
  );
};
