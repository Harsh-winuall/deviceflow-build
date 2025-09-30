"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { TeamForm } from "../../_components/team-form";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function EditTeam({
  children,
  _id,
  title,
  manager,
  description,
  image,
}: {
  children: React.ReactNode;
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  manager?: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <TeamForm
          manager={manager}
          closeBtn={setOpen}
          isEditForm={true}
          id={_id!}
          title={title}
          description={description}
          image={image}
        />
      </DialogContent>
    </Dialog>
  );
}
