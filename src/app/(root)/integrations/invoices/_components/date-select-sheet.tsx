"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { useState } from "react";
import DownloadInvoiceForm from "./download-invoice-form";
import SelectDatesForm from "./select-dates-form";

type AssignAssetProps = {
  children: React.ReactNode;
  startDate?: string;
  endDate?: string;
  items?: any[];
  onDatesChange: (start: string, end: string) => void;
};

export const DataSelectSheet = ({
  children,
  startDate,
  endDate,
  onDatesChange,
}: AssignAssetProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="h-fit">
        <SelectDatesForm
          closeBtn={() => setOpen(false)}
          initialStartDate={startDate}
          initialEndDate={endDate}
          onDatesChange={onDatesChange}
        />
      </SheetContent>
    </Sheet>
  );
};
