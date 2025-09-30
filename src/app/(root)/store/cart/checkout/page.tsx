import { CombinedContainer } from "@/components/container/container";
import { Cart, getCart } from "@/server/cartActions";
import PaymentMethods from "./_components/payment-methods";
import { MoveLeft } from "lucide-react";
import AddressSection from "./_components/addressSection";
import { Address, getAddress } from "@/server/addressActions";
import { BackBtn } from "./_components/back-btn";
import Link from "next/link";

export default async function Checkout() {
  try {
    const cart: Cart = await getCart();
    const isCartEmpty = cart?.items?.length === 0;
    const allAddresses: Address[] = await getAddress();

    if (isCartEmpty) {
      return (
        <div className="flex flex-col font-gilroyMedium w-full justify-center items-center h-auto min-h-[71vh] gap-2 bg-white px-8 pb-8">
          <span className="text-2xl ">Cart is empty : (</span>
          <Link href="/store">Go back to store</Link>
        </div>
      );
    }

    return (
      <>
        <div className="flex w-full justify-between h-auto min-h-[71vh] gap-10 bg-white px-8 pb-8">
          <div className="flex flex-col h-full w-[73%]">
            <div className=" flex items-center mt-4 gap-7">
              <BackBtn>
                <MoveLeft className="size-5 cursor-pointer" />
              </BackBtn>

              <div className="flex gap-7 items-center">
                <div className="font-gilroySemiBold text-xl text-[#17183B]">
                  Address
                </div>
              </div>
            </div>
            <AddressSection allAddresses={allAddresses} />
          </div>

          <div className="border border-[#D1D1D8] rounded-lg h-fit mt-6 pt-5 pb-8 px-8 ">
            {/* border  h-fit mt-6 pb-8 pt-5 px-8 */}
            <div className="flex flex-col gap-4">
              <div className="text-[#17183B] text-[19px] font-gilroyBold min-w-80">
                Order Summary
              </div>

              <div className="flex flex-col gap-4 text-[#17183B] font-gilroyMedium text-base">
                {cart?.items?.map((item, i) => (
                  <div
                    key={i}
                    className="p-[15.25px] flex gap-[15.25px] rounded-[12.391px] bg-[#F6F6F6]"
                  >
                    <div>
                      <img
                        src={item?.image?.[0]?.url ?? "/media/CartProduct.png"}
                        alt="mac"
                        className="size-10 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="font-gilroySemiBold text-black text-[15.25px]">
                        {item?.device_name}
                      </div>
                      <div>
                        <span className="text-[#7F7F7F] text-xs">
                          {item?.quantity} x
                        </span>{" "}
                        <span className="text-sm text-black font-gilroyBold">
                          ₹{item?.payable}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-[15.25px]">
                <div className="flex justify-between items-center">
                  <span className="font-gilroySemiBold text-[15.25px]">
                    Subtotal
                  </span>
                  <span className="font-gilroySemiBold">
                    {isCartEmpty ? "-" : `₹${cart?.totalPrice}`}
                  </span>
                </div>

                <div className="flex flex-col gap-[7.63px] font-gilroyMedium">
                  <div className="flex justify-between items-center">
                    <span className=" text-[15.25px] text-[#545454]">
                      Estimated Tax
                    </span>
                    <span className="font-gilroySemiBold">
                      {isCartEmpty ? "-" : `₹0`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className=" text-[15.25px] text-[#545454]">
                      Estimated shipping & Handling
                    </span>
                    <span className="font-gilroySemiBold">
                      {isCartEmpty ? "-" : `₹0`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-[15.25px] text-[#545454]">
                      Shipment method
                    </span>
                    {isCartEmpty ? (
                      <>-</>
                    ) : (
                      <span className="font-gilroySemiBold text-[#3AA39F]">
                        Free
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-[1px] bg-[#D1D1D8] w-full"></div>

                <div className="flex flex-col gap-6 text-[#17183B] font-gilroyMedium text-base">
                  <div className="flex justify-between items-center font-gilroyBold">
                    <span>Total</span>
                    <span className="font-gilroyBold text-lg">
                      ₹{cart?.totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {!isCartEmpty ? (
                <div className="flex justify-center items-center w-full">
                  <PaymentMethods
                    // data={payments}
                    price={cart?.totalPrice}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    return (
      <CombinedContainer title="Checkout">
        <div className="flex flex-col items-center text-center space-y-6 mt-16">
          <p className="text-red-600">Some Error Occurred!</p>
        </div>
      </CombinedContainer>
    );
  }
}
