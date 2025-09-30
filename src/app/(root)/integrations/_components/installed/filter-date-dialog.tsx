"use client";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { useState } from "react";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type FilterDateDialogProps = {
  children: React.ReactNode;
  startDate?: string;
  endDate?: string;
  onDatesChange: (start: string, end: string) => void;
};

export const FilterDateDialog = ({
  children,
  startDate,
  endDate,
  onDatesChange,
}: FilterDateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined
  );

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // yesterday = maximum allowed date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleStartDateChange = (date: Date | undefined) => {
    if (date && date > today) {
      date = today; // restrict to today
    }
    setTempStartDate(date);

    if (date && tempEndDate && tempEndDate < date) {
      setError("End date cannot be earlier than start date");
    } else {
      setError(null);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && date > today) {
      date = today;
    }
    setTempEndDate(date);

    if (tempStartDate && date && date < tempStartDate) {
      setError("End date cannot be earlier than start date");
    } else {
      setError(null);
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate && tempEndDate < tempStartDate) {
      setError("End date cannot be earlier than start date");
      return;
    }

    if (tempStartDate && tempEndDate) {
      const formattedStart = formatDate(tempStartDate);
      const formattedEnd = formatDate(tempEndDate);

      onDatesChange(formattedStart, formattedEnd);
      setError(null);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setTempStartDate(undefined);
    setTempEndDate(undefined);
    onDatesChange("", "");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-fit rounded-[5px] p-4">
        <div className="flex flex-col ">
          <h2 className="text-lg font-gilroySemiBold">Choose dates</h2>

          <div className="flex items-center gap-4 mt-3">
            {/* Start Date */}
            <div className="flex flex-col flex-1 gap-1.5">
              <label className="font-gilroyMedium text-[13px]">From</label>
              <DateTimePicker
                displayFormat={{ hour24: "dd/MM/yyyy" }}
                value={tempStartDate}
                onChange={handleStartDateChange}
                granularity="day"
                className="md:text-[13px]"
                maxValue={tempEndDate || today} // can't go beyond end date or yesterday
                placeholder="Select start date"
                isDateUnavailable={(date) => date > today}
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col flex-1 gap-1.5">
              <label className="font-gilroyMedium text-[13px]">To</label>
              <DateTimePicker
                displayFormat={{ hour24: "dd/MM/yyyy" }}
                value={tempEndDate}
                onChange={handleEndDateChange}
                granularity="day"
                className="md:text-[13px]"
                minValue={tempStartDate} // can't select before start date
                maxValue={today} // can't select beyond yesterday
                placeholder="Select end date"
                isDateUnavailable={(date) => date > today}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 font-gilroyMedium">
              {error}
            </p>
          )}
          {/* Action Buttons */}
          <div className="flex gap-4 mt-5">
            <Button
              variant="outlineTwo"
              className="w-full  rounded-[5px]"
              onClick={handleClear}
            >
              Clear
            </Button>

            <LoadingButton
              variant="primary"
              className="w-full rounded-[5px]"
              onClick={handleApply}
              disabled={!tempStartDate || !tempEndDate}
            >
              Apply
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
