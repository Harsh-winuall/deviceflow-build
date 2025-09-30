"use client";
import { Button, buttonVariants } from "@/components/buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uniqueIdGeneration } from "@/server/checkMateActions";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Loading from "../loading";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const mutation = useMutation({
    mutationFn: uniqueIdGeneration,
    onError: () => {
      toast.error("Error generating unique id");
    },
  });

  const [copiedState, setCopiedState] = useState(false);

  const handleCopy = () => {
    if (copiedState) return;
    navigator.clipboard.writeText(mutation?.data?.uniqueId ?? "");
    setCopiedState(true);
    toast.success("Copied to clipboard !");
    setTimeout(() => {
      setCopiedState(false);
    }, 1000);
  };

  const downloadLinks = [
    {
      title: "Windows",
      href: "https://github.com/Harsh-winuall/QC-Release/releases/download/Windows/Check.Mate.Setup.5.0.0.exe",
    },
    {
      title: "Apple M Series",
      href: "https://github.com/Harsh-winuall/QC-Release/releases/download/5.0.1-Apple-Silicone/CheckMate-5.0.1-arm64.dmg",
    },
    {
      title: "Apple Intel",
      href: "https://github.com/Harsh-winuall/QC-Release/releases/download/5.0.0-Apple/CheckMate-5.0.0.dmg",
    },
  ];

  const handleDownloadSoftware = (val: string) => {
    const link = downloadLinks.find((item) => item.title === val);
    if (link) {
      const a = document.createElement("a");
      a.href = link.href;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div>
      {/* <div className="bg-white"> */}
      <div className="rounded-lg border border-gray-200 h-[80vh] bg-white backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5">
        <div className="flex flex-col justify-center items-center">
          <img
            src="/media/analyze.webp"
            width={200}
            height={200}
            alt="analyze-device"
          />
          <h1 className="text-3xl font-gilroySemiBold">Analyze your device</h1>
          <p className="text-base text-[#4E4D4D] py-3 font-gilroyMedium">
            Detailed insights & full specs of your laptop
          </p>
          <div className="space-y-3 mt-3 w-52">
            <Select onValueChange={handleDownloadSoftware}>
              <SelectTrigger className="w-full font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-md">
                <SelectValue placeholder="Download Software" />
              </SelectTrigger>

              <SelectContent className="font-gilroyMedium">
                {downloadLinks.map((itm) => (
                  <SelectItem
                    key={itm.title}
                    value={itm.title}
                    className="w-full py-2.5 rounded-lg"
                  >
                    {itm.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger className="w-full">
                <span
                  className={buttonVariants({
                    variant: "primary",
                    className: "w-full",
                  })}
                  onClick={() => mutation?.mutate()}
                >
                  Generate UID
                </span>
              </DialogTrigger>
              <DialogContent className="rounded-2xl max-w-md space-y-4 py-20">
                {mutation?.isPending ? (
                  <Loading />
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle className="font-gilroySemiBold text-xl text-center">
                        Login Key
                      </DialogTitle>
                      <DialogDescription className="font-gilroyMedium text-center">
                        Use this Unique Login key to login into Checkmate
                      </DialogDescription>
                    </DialogHeader>
                    <h1 className="w-full text-7xl font-gilroyBold text-center tracking-wider">
                      {mutation?.data?.uniqueId}
                    </h1>
                    <DialogFooter>
                      <div className="flex flex-col w-full gap-3">
                        <Button
                          variant="outline"
                          className="w-full h-9"
                          onClick={handleCopy}
                        >
                          Copy
                        </Button>

                        <DialogClose asChild>
                          <Button variant="primary" className="w-full">
                            Done
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
            <Link
              href="/diagnostic/reports"
              className={buttonVariants({
                variant: "outline",
                className: "w-full",
              })}
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
