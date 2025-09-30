"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";

import { useState } from "react";
import { UserForm } from "../../_components/user-form";
import { CreateUserArgs, NewUserResponse } from "@/server/userActions";

export default function EditUser({
  children,
  userData,
  onRefresh,
}: {
  children: React.ReactNode;
  userData?: NewUserResponse;
  onRefresh?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <UserForm
          closeBtn={setOpen}
          isEditForm={true}
          userData={userData}
          onRefresh={onRefresh}
        />
        {/* <DatetimePickerDisplayFormat /> */}
        {/* <EmployeeForm
          onSubmit={(data) => console.log("Form submitted:", data)}
          isEditing
          defaultValues={userData}
        /> */}
      </SheetContent>
    </Sheet>
  );
}

// import { DateTimePicker } from "@/components/ui/datetime-picker";

// const DatetimePickerDisplayFormat = () => {
//   const [date, setDate] = useState<Date | undefined>(undefined);
//   return (
//     <DateTimePicker
//       displayFormat={{ hour24: "MMM dd yyyy" }}
//       value={date}
//       onChange={setDate}
//       className="w-72"
//       granularity="day"
//     />
//   );
// };
