"use client";

import { downloadInvoice } from "@/server/integrationActions";
import { useMutation } from "@tanstack/react-query";

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: ({
      integrationIds,
      startDate,
      endDate,
    }: {
      integrationIds: string[];
      startDate: string;
      endDate: string;
    }) => downloadInvoice({ integrationIds, startDate, endDate }),
  });
}
