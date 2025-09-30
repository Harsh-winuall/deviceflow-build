"use client";
import { Button } from "@/components/buttons/Button";
import html2pdf from "html2pdf.js";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReportFormat } from "./report";
import { getQcDataById, ReportData } from "@/server/checkMateActions";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ReportPreview({
  children,
  data,
  isPending,
  id,
}: {
  children: React.ReactNode;
  data?: ReportData;
  isPending?: boolean;
  id?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: getQcDataById,
  });
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          onClick={() => {
            if (id) {
              mutation.mutate(id);
            }
          }}
        >
          {children}
        </DialogTrigger>
        <DialogContent className="rounded-2xl w-full bg-white p-4 shadow-lg max-w-screen-lg max-h-[70%] overflow-y-auto h-full  text-center flex flex-col ">
          {mutation?.isPending ? (
            <>
              <Loader2 className="animate-spin " />
            </>
          ) : (
            <ReportFormat data={mutation?.data ?? {}} />
          )}

          <DialogTitle className="text-lg sr-only font-gilroySemiBold text-gray-900">
            QC Report
          </DialogTitle>

          {isPending ? (
            <>
              <Loader2 className="animate-spin " />
            </>
          ) : (
            <ReportFormat data={data ?? {}} />
          )}
          <Button
            className="border w-fit absolute bg-black text-white"
            onClick={() => {
              const element = document.querySelector("#invoice");
              if (element) {
                html2pdf(element, {
                  margin: 0,
                  filename: `${data?.data?.serial_no}_Report.pdf`,
                  image: { type: "png" },
                  html2canvas: { scale: 2 },
                  jsPDF: { unit: "in", format: "letter", orientation: "p" },
                });
              }
              setIsOpen(false);
            }}
          >
            Download
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
