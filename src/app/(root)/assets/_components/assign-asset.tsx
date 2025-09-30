"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { Device } from "@/server/deviceActions";
import { useState } from "react";
import AssignAssetsForm from "./assignAssetsForm";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AssignAssetProps = {
  children: React.ReactNode;
  device: Device;
};

export const AssignAsset = ({ children, device }: AssignAssetProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="rounded-lg max-w-md p-4 min-h-fit flex flex-col">
        <AssignAssetsForm closeBtn={setOpen} device={device}/>
      </DialogContent>
    </Dialog>
  );
};
