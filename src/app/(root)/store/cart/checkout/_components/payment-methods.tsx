"use client";

import { setPaymentData } from "@/app/store/paymentSlice";
import { createOrderId } from "@/server/cartActions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PaymentMethods({
  // data: payments,
  price,
}: {
  // data: any;
  price: number;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const method = formData.get('payment'); // Get the selected payment method
    const res: any = await createOrderId(price, "card");
    const razorpayOrderId = res?.cart?.razorpay_order_id;
    const razorpayPrice = res?.cart?.totalPrice;

    handlePayment(razorpayOrderId, razorpayPrice);
    router.refresh();
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = (orderId: string, totalPrice: number) => {
    const options = {
      key: "rzp_live_08aII1Mfq4uUFm", // Use your test/live key here
      amount: totalPrice, // Amount in paise
      currency: "INR",
      name: "Edify",
      description: "Order Payment",
      image:
        "https://media.glassdoor.com/sqll/2268419/winuall-squarelogo-1562701582366.png",
      order_id: orderId, // Razorpay order ID from query parameter
      handler: function (response: any) {
        if (response?.razorpay_payment_id) {
          router.refresh();
          router.push(`/store/cart/checkout/payment-success`);
          setTimeout(() => {
            dispatch(
              setPaymentData({
                paymentId: response?.razorpay_payment_id as string,
                amount: totalPrice,
                orderId
              })
            );
          }, 0);
        }
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9090909090",
      },
      theme: {
        color: "#F37254",
      },
    };
    //@ts-ignore
    const rzp1 = new window.Razorpay(options);
    rzp1?.open();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* <div className="mt-4 space-y-2">
				{Object.keys(payments).map((key) => (
					<div key={key} className="flex items-center gap-2">
						<input
							type="radio"
							name="payment"
							value={payments[key].paymentOption}
							id={key}
						/>
						<label
							htmlFor={key}
							className="text-gray-700 w-full rounded p-2 ring-[0.8px] ring-neutral-200 dark:text-gray-300">
							{payments[key].displayString}
						</label>
					</div>
				))}
			</div> */}

      <button
        type="submit"
        className="bg-black text-white hover:text-black hover:bg-white hover:ring-1 hover:ring-black font-gilroyMedium text-base rounded-sm  text-center h-14 flex justify-center items-center w-full"
      >
        Proceed to Pay
      </button>
    </form>
  );
}
