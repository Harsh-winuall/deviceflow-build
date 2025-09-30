"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AISummaryModal({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  return (
    <>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="rounded-2xl w-full bg-white p-4 shadow-lg max-w-screen-lg max-h-[70%] overflow-y-auto h-full  text-center flex flex-col ">
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            AI Summary {data?.tag ? `(${data?.tag})` : null}
          </DialogTitle>
          <div>
            <div className="flex justify-center font-gilroyMedium items-center h-full w-full">
              {data?.summary ? (
                <p className="break-words">{data?.summary}</p>
              ) : (
                <img
                  src="/media/loader.gif"
                  alt="Generating Ai summary..."
                  style={{ height: 400, width: 400 }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
