"use client";
import { Button } from "@/components/buttons/Button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { createSignupLink } from "@/server/signupActions";
import { Input } from "@/components/inputs/Input";

export default function InvitePeopleTeam({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [link, setLink] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await createSignupLink(id);
        setLink(res.link);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [dialogOpen]);

  useEffect(() => {
    setLink("");
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Invite people
          </DialogTitle>
          <p className="text-[#B1B1B1] text-sm font-gilroyMedium -mt-2">
            Share this link to onboard your employees easily.
          </p>

          {/* <div className="group relative w-full mt-2 border border-red-400">
            <Input
              id="copy-link"
              type="text"
              className={
                "text-[#025CE5] w-fit rounded-md border-[#BEBEBE] focus-visible:border-[#BEBEBE] focus:border-[#BEBEBE] font-gilroyMedium text-sm"
              }
              value={link}
              placeholder=""
            />
            <button
              type="button"
              onClick={handleCopy}
              className="pl-2 pr-[3px] absolute m-1 flex items-center justify-end h-10 w-24 bg-white"
            >
              <span className="top-2.5 bg-[#EDEDED] px-2.5 py-[0.6rem] text-[#808080] text-xs font-gilroySemiBold whitespace-nowrap rounded-md">
                Copy Link
              </span>
            </button>
          </div> */}
          <div className="w-full mt-2 flex items-center  justify-between gap-x-2">
            <Input
              id="copy-link"
              type="text"
              className={
                "text-[#025CE5] select-none w-[17rem]  rounded-lg border-[#BEBEBE] focus-visible:border-[#BEBEBE] focus:border-[#BEBEBE] font-gilroyMedium text-sm h-10"
              }
              defaultValue={link}
              value={link}
              readOnly
              placeholder=""
            />
            <Button
              variant="outlineTwo"
              onClick={handleCopy}
              className="w-fit border-[#BEBEBE]"
            >
              Copy
            </Button>
          </div>

          <DialogFooter className="flex w-full items-center justify-center mt-4">
            <Button
              variant="primary"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
