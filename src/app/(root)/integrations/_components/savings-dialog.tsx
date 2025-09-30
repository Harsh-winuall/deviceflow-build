"use client";
import { Button } from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function SavingsDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const descriptionDetails = [
    "Deactivating unused licenses will revoke access for the associated users.",
    "This action is permanent and cannot be undone.",
    "Any stored data related to the license may be lost.",
    "I have read and agree to the Terms & Conditions.",
  ];
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="rounded-2xl bg-white p-6 shadow-lg max-w-[32rem] w-full text-center">
          <DialogTitle className="text-lg font-gilroySemiBold">
            Save
          </DialogTitle>
          <div className="flex gap-1 text-[#2E8016] items-end justify-center">
            <span className="text-4xl font-gilroyBold">₹135</span>
            <span className="font-gilroyMedium text-2xl">/Month</span>
          </div>
          <p className="text-[#7f7f7f] text-sm font-gilroyMedium">
            Reduce unnecessary expenses by deactivating licenses that are no
            longer in use.
          </p>

          <div className="flex flex-col gap-3">
            <h1 className="font-gilroySemiBold">Deviceflow will deactivate:</h1>
            <div className="flex justify-between">
              {[23, 54].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#b4b4b4] p-3 flex flex-col justify-between w-full max-w-[13rem] "
                >
                  <h2 className="font-gilroySemiBold">Used seats</h2>
                  <span className="text-3xl font-gilroyBold">231</span>
                  <Button className="w-full bg-black text-white">
                    Review & Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <h1 className="text-base font-gilroySemiBold text-start ">
            By proceeding, I acknowledge that:{" "}
          </h1>
          <div className="flex flex-col gap-1 text-start ">
            {descriptionDetails.map((item) => (
              <div key={item} className="flex items-center gap-1 py-0.5">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="text-blue-600"
                />
                <p className="text-sm font-gilroyMedium">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-sm font-gilroyMedium text-start ">
            By clicking Agree & Proceed, you authotize deviceflow to deactivate
            the licences on your behalf.
          </p>
          <div className="h-[1px] bg-gray-200 my-2"></div>

          <DialogFooter className="flex w-full items-center justify-between mt-4">
            <Button
              className="w-[48%] rounded-sm font-gilroyMedium  bg-white text-black  ring-1 ring-black   flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-[48%] rounded-sm font-gilroyMedium  bg-black text-white  ring-1 ring-black   flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              Agree & Proceed{" "}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
