
import CartIcon from "@/icons/CartIcon";
import { getCart } from "@/server/cartActions";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export const CartComponent = async () => {
  // const router = useRouter();
  // const initialData = {
  //   userId: "66f2a59efb1ea7c81cc967e6",
  //   orgId: "66cdb429eca7ef02552984e7",
  //   addressId: "6704c1de78d41ea73950ea71",
  //   items: [],
  //   totalPrice: 0,
  //   status: "Processing",
  //   addressDetails: {
  //     _id: "6704c1de78d41ea73950ea71",
  //     userId: "66f4fd33f12d3d8756fcbaf8",
  //     orgId: "66cdb429eca7ef02552984e7",
  //     city: "bangalore, kasahanavalli",
  //     isPrimary: false,
  //     deleted_at: "2024-12-11T09:50:11.726Z",
  //     createdAt: "2024-10-08T05:23:42.732Z",
  //     updatedAt: "2024-12-11T09:50:11.729Z",
  //     __v: 0,
  //   },
  // };
  // const [cart, setCart] = useState<Cart>(initialData);

  // useEffect(() => {
  //   const fetch = async () => {
  //     const res = await getCart();
  //     setCart(res);
  //   };
  //   fetch();
  // }, [router]);

  const cart = await getCart();

  const totalQty: number = cart.items.reduce(
    // @ts-ignore
    (acc: number, item: DeviceWithQty) => acc + item?.quantity!,
    0
  );

  return (
    <Link href="/store/cart" className="relative p-1 rounded-full">
      <div className="size-3.5 absolute top-0 left-0 rounded-full bg-red-500 text-white flex justify-center items-center text-[10px]">
        {totalQty}
      </div>
      <CartIcon className="size-[1.3rem]" />
    </Link>
  );
};
