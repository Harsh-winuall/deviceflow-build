"use client";

import { usePathname } from "next/navigation";

export const StoreNavbarWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const showStoreNavbar =
    pathname === "/store" ||
    (pathname.startsWith("/store/") &&
      !pathname.startsWith("/store/cart/checkout/payment-success"));

  if (!showStoreNavbar) return null;
  return (
    <div className="h-24 px-24 sticky z-[100] top-0 left-0 right-0 bg-white  w-full rounded-tr-3xl rounded-tl-3xl">
      {children}
    </div>
  );
};
