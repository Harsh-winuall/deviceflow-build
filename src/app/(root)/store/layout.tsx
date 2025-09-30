// "use client";
import StoreNavbar from "./_components/store-navbar";
// import Link from "next/link";
import { CartOverview } from "./_components/cart-overview";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex  rounded-3xl flex-col w-[97%] overflow-y-auto h-[83vh] min-h-[80vh] 2xl:min-h-[85vh]">
      <div className="w-full h-full flex flex-col justify-center">
        <StoreNavbar />
        <div className="flex-1 overflow-y-auto h-full">{children}</div>
        <CartOverview />
      </div>
    </section>
  );
}
