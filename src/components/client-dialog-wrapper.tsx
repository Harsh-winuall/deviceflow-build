"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GsuiteDialog } from "./bulk-upload/gsuite-bulk-upload.dialog";


export default function ClientDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const gsuiteDialogOpen = params.get("gsuiteDialog");

  useEffect(() => {
    if (gsuiteDialogOpen === "true") {
      setDialogOpen(true);
    }
  }, [params]);

  return (
    <>
      {children}
      <GsuiteDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
}
