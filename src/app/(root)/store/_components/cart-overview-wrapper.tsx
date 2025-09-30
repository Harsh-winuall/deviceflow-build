"use client";

import { Cart } from "@/server/cartActions";
import { usePathname } from "next/navigation";

export const CartOverviewWrapper = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: Cart;
}) => {
  const pathname = usePathname();
  const showCartOverview =
    (pathname === "/store" ||
      (pathname.startsWith("/store/") &&
        !pathname.startsWith("/store/cart"))) &&
    data?.items?.length > 0;

  if (!showCartOverview) return null;
  return (
    <div
      className="sticky -mt-7 h-20 bottom-0 left-0 right-0 z-[100] px-16 bg-white shadow-2xl rounded-tl-3xl rounded-tr-3xl w-full flex justify-between items-center"
      style={{
        borderRadius: "23px 23px 0px 0px",
        boxShadow: "0px -5px 21.5px 0px rgba(0, 0, 0, 0.12)",
      }}
    >
      {children}
    </div>
  );
};
