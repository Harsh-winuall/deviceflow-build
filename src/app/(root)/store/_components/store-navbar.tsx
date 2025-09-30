import Link from "next/link";
import { StoreGlobalSearch } from "./store-global-search";
import { CartComponent } from "./cart-count";
import { StoreNavbarWrapper } from "./store-navbar-wrapper";
import EdifyLogo from "@/icons/EdifyLogo";

export default function StoreNavbar() {
  return (
    <>
      <StoreNavbarWrapper>
        <nav className="flex items-center justify-between w-full h-full">
          <div className="flex justify-between w-[68%] 2xl:w-[65%] items-center">
            <Link href="/store">
              <EdifyLogo />
            </Link>
            <div className="flex text-base font-gilroySemiBold text-black gap-12">
              <Link href="/store?tab=best_sellers#best_sellers">
                <h1>Bestsellers</h1>
              </Link>
              <Link href="/store?tab=latest_release#latest_release">
                <h1>Latest Releases</h1>
              </Link>
              <Link href="/store/all-products">
                <h3>All Products</h3>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-6">
            <StoreGlobalSearch />
            <CartComponent />
          </div>
        </nav>
      </StoreNavbarWrapper>
    </>
  );
}
