import { CombinedContainer } from "@/components/container/container";
import { getSession } from "@/server/helper";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Diagnostic",
};

export default async function Layout({
  employee,
  admin,
}: {
  employee: React.ReactNode;
  admin: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <CombinedContainer>
      {session?.user?.user?.role !== 1 ? (
        <Suspense fallback={<Loading />}>{admin}</Suspense>
      ) : (
        <Suspense fallback={<Loading />}>{employee}</Suspense>
      )}
    </CombinedContainer>
  );
}
