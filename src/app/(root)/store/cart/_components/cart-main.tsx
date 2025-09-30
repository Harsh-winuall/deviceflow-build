"use client";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Cart, DeviceWithQty } from "@/server/cartActions";
import { CartItem } from "./cart-item";
// import { coupons } from "./utils";
// import { CouponsModal } from "./coupons-modal";
// import { CouponCard } from "./coupon-card";
// import { useEffect, useState } from "react";
import { BackBtn } from "../checkout/_components/back-btn";

const CartMain = ({ cart }: { cart: Cart }) => {
  // const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  // const [couponCode, setCouponCode] = useState<string>("");
  // const router = useRouter();

  // const handleCouponSelect = (code: string) => {
  //   setSelectedCoupon(code);
  //   setCouponCode(code);
  // };

  // const handleApplyCoupon = (code: string) => {
  //   setCouponCode(code);
  // };

  // useEffect(() => {
  //   const fetchData = async ()=>{
  //     const cartDetail = await getCart();
  //     if (cartDetail?.items?.length === 0){
  //       router.push('/store');
  //     }
  //   }
  //   fetchData();
  // },[]);

  const isCartEmpty = cart?.items?.length === 0;

  return (
    <>
      <div className="flex w-full justify-between h-full min-h-[70vh] gap-10 bg-white px-12 pb-8">
        <div className="flex flex-col mt-3 w-full">
          <div className="flex items-center gap-7 mb-1">
            <BackBtn>
              <MoveLeft className="size-5 cursor-pointer" />
            </BackBtn>

            <div className="flex items-baseline gap-[18px]">
              <div className="font-gilroySemiBold text-xl text-[#17183B]">
                Cart
              </div>
              <div className="text-base text-[#A2A3B1] font-gilroyMedium">
                {cart?.items?.reduce(
                  (acc: number, item: DeviceWithQty) => acc + item?.quantity!,
                  0
                )}{" "}
                ITEMS
              </div>
            </div>
          </div>

          <div className="w-full h-full min-h-[50vh] overflow-y-auto">
            {isCartEmpty ? (
              <div className="w-full h-full items-center justify-start flex flex-col gap-0">
                <img
                  src="/media/empty-cart.svg"
                  alt="empty-cart"
                  className="w-96 h-96 -mt-16 2xl:mt-0 object-contain"
                />
                <h3 className="font-gilroySemiBold text-xl  mb-6 -mt-7">
                  Your cart is empty !
                </h3>
                <Link
                  href="/store"
                  className="rounded-sm font-gilroyMedium max-w-xs w-[14rem] bg-black text-white hover:text-black ring-1 ring-black hover:bg-white  hover:ring-black h-12 flex items-center justify-center"
                >
                  Continue Shopping{" "}
                </Link>
              </div>
            ) : (
              cart?.items?.map((data: DeviceWithQty, i: number) => (
                <div
                  className="flex flex-col"
                  key={`${data._id}-cart-item-${i}`}
                >
                  <CartItem data={data} />
                  {i < cart?.items?.length - 1 && cart?.items?.length > 1 && (
                    <div className="h-[1px] bg-[#D1D1D8] w-full my-2"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-[#D1D1D8] h-fit mt-6 pb-8 pt-5 px-8">
          <div className="flex flex-col gap-4">
            <div className="text-[#17183B] text-2xl font-gilroySemiBold min-w-80">
              Order Summary
            </div>

            <div className="flex flex-col gap-3 text-[#17183B] font-gilroyMedium text-base">
              <div className="flex justify-between items-center">
                <div>Price</div>
                <div>{isCartEmpty ? "-" : `₹${cart?.totalPrice}`}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Discount</div>
                <div>{isCartEmpty ? "-" : `₹0`}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Shipping</div>
                {isCartEmpty ? (
                  <div className="text-black">-</div>
                ) : (
                  <div className="text-[#3AA39F]">Free</div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>Tax</div>
                <div>{isCartEmpty ? "-" : `₹0`}</div>
              </div>
            </div>

            <div className="h-[1px] bg-[#D1D1D8] w-full"></div>

            <div className="flex flex-col gap-6 text-[#17183B] font-gilroyMedium text-base">
              <div className="flex justify-between items-center font-gilroyBold">
                <div>Total</div>
                <div className="font-gilroyBold text-lg">
                  ₹{cart?.totalPrice}
                </div>
              </div>

              {/* <div className="flex justify-between items-center focus:ring-0">
                <div>Estimated Delivery by</div>
                <div className="font-gilroySemiBold">01 Feb, 2023</div>
              </div> */}

              {/* <div className="flex justify-between items-center w-full bg-white gap-4 p-4 border border-[#D1D1D8] rounded-[2px]">
                <input
                  type="text"
                  className="w-full focus:outline-none"
                  placeholder="Coupon Code"
                  onChange={(e) => setCouponCode(e?.target?.value)}
                  value={couponCode}
                />
                <CouponsModal
                  triggerLabel={
                    <div className="text-base font-gilroyRegular cursor-pointer text-black text-nowrap">
                      View All
                    </div>
                  }
                  content={
                    <div className="flex flex-col gap-4">
                      {coupons.map((coupon, index) => (
                        <CouponCard
                          coupon={coupon}
                          key={index}
                          selected={selectedCoupon === coupon?.code}
                          onClick={() => handleCouponSelect(coupon?.code)}
                        />
                      ))}
                    </div>
                  }
                  onApply={handleApplyCoupon}
                  selectedCouponCode={selectedCoupon || ""}
                />
              </div> */}

              {cart?.items?.length !== 0 && (
                <div className="flex justify-center items-center w-full">
                  <Link
                    href="/store/cart/checkout"
                    className="bg-black text-white hover:text-black hover:bg-white hover:ring-1 hover:ring-black font-gilroyMedium text-base rounded-sm text-center h-14 flex justify-center items-center w-full"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartMain;
