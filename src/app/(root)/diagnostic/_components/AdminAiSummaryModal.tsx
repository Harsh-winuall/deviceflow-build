"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function AdminAISummaryModal({
  children,
  data,
  isPending,
}: {
  children: React.ReactNode;
  data: any;
  isPending?: boolean;
}) {
  const headers = Object?.keys(data?.data?.repairs?.[0] || {});

  return (
    <>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="rounded-2xl w-full bg-white p-4 shadow-lg max-w-screen-lg max-h-[70%] overflow-y-auto h-full  text-center flex flex-col ">
          {isPending ? (
            <div className="w-full h-20 flex items-center justify-center">
              <Loader2 className="animate-spin size-4" />
            </div>
          ) : (
            <>
              <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
                AI Summary {data?.tag ? `(${data?.tag})` : null}
              </DialogTitle>
              <div>
                <div className="flex justify-center items-center font-gilroyMedium h-full w-full">
                  {data?.data.fieldWiseStatsSummary ? (
                    <div>
                      <h2>{data?.data.fieldWiseStatsSummary}</h2>
                      <br />
                      <h2>{data?.data.note}</h2>
                      <br />
                      <div className="overflow-x-auto p-4">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                          <thead className="bg-gray-100">
                            <tr>
                              {headers.map((header) => (
                                <th
                                  key={header}
                                  className="px-4 py-2 border-b text-center text-gray-600"
                                >
                                  {header.charAt(0).toUpperCase() +
                                    header.slice(1)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.data.repairs.map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                {headers.map((header) => (
                                  <td
                                    key={header}
                                    className="px-4 py-2 border-b"
                                  >
                                    {row[header]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end items-center pr-10">
                        <h1 className="text-base font-gilroyBold">
                          Total Cost - {data?.data?.total_cost}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <img
                      src="/media/loader.gif"
                      alt="Generating Ai summary..."
                      style={{ height: 400, width: 400 }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
