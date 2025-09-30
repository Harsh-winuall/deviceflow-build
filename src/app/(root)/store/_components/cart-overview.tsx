import Link from "next/link";
import { getCart } from "@/server/cartActions";
import { CartOverviewWrapper } from "./cart-overview-wrapper";
import VerticalSeperator from "@/icons/VerticalSeperator";
// import { usePathname } from "next/navigation";

export const CartOverview = async () => {
  // const [data, setData] = useState<Cart | null>(null);
  // const pathname = usePathname();

  // const fetchCart = async () => {
  //   try {
  const data = await getCart();

  const totalQty: number = data.items.reduce(
    // @ts-ignore
    (acc: number, item: DeviceWithQty) => acc + item?.quantity!,
    0
  );

  return (
    <CartOverviewWrapper data={data}>
      <Link href="/store/cart" className="flex gap-4 items-center">
        <img
          src={data?.items?.[0]?.image?.[0]?.url ?? "/media/mac.jpeg"}
          alt="cart-product"
          className="rounded-full object-contain size-12"
        />
        <div className="flex flex-col gap-0.5">
          <div className="text-base text-black font-gilroySemiBold">
            {data?.items[0]?.device_name ?? ""}
          </div>
          <div className="flex items-center gap-0.5 text-[#7C7C7C] text-xs">
            <div>{data?.items[0]?.processor ?? "-"}</div>•
            <div>{data?.items[0]?.ram ?? "-"}</div>•
            <div>{data?.items[0]?.storage ?? "-"}</div>
          </div>
        </div>

        {totalQty > 1 && (
          <div className="ml-4 flex items-center gap-4">
            <VerticalSeperator/>
            <div className="text-[#7C7C7C] text-xs font-gilroyMedium">
              +{totalQty - 1} more
            </div>
          </div>
        )}
      </Link>
      <div className="flex gap-x-8 items-center h-full">
        <div className="flex flex-col gap-0.5">
          <div className="text-[#7C7C7C] text-sm font-gilroyMedium">Total</div>
          <span className="text-black text-lg font-gilroyBold">
            ₹{data?.totalPrice ?? 0}/-
          </span>
        </div>
        <Link
          href="/store/cart"
          className="rounded-sm font-gilroyMedium max-w-xs w-[14rem] bg-black text-white hover:text-black ring-1 ring-black hover:bg-white  hover:ring-black h-[58%] flex items-center justify-center"
        >
          Proceed
        </Link>
      </div>
    </CartOverviewWrapper>
  );
};
