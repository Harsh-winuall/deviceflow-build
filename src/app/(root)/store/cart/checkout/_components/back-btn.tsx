"use client";
import { useRouter } from "next/navigation";

export const BackBtn = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
};
