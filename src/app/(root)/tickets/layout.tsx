import { CombinedContainer } from "@/components/container/container";
import { getSession } from "@/server/helper";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tickets",
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
        <Suspense fallback={<LoadingSpinnerScreen />}>{admin}</Suspense>
      ) : (
        <Suspense fallback={<LoadingSpinnerScreen />}>{employee}</Suspense>
      )}
    </CombinedContainer>
  );
}

export const LoadingSpinnerScreen = () => {
  return (
    <div className="h-60 w-full flex justify-center items-center">
      <Loader2 className="animate-spin size-4" />
    </div>
  );
};
