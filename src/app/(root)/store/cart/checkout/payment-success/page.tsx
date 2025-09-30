"use client";
import Error from "@/app/error/page";
import NotFound from "@/app/not-found";
import { RootState } from "@/app/store/store";
import PaymentSuccessCracker from "@/icons/PaymentSuccessCracker";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [showTick, setShowTick] = useState(false);
  const [showTextAndButtons, setShowTextAndButtons] = useState(false);
  const [showCrackers, setShowCrackers] = useState(false);
  const [fadeOutCrackers, setFadeOutCrackers] = useState(false);
  const router = useRouter();
  const paymentData = useSelector((state: RootState) => state?.payment);
  const orderId = useSelector((state: RootState) => state?.payment);

  // if (!paymentData.paymentId) {
  //   router.push('/error');
  // }

  useEffect(() => {
    // Show the tick after 2 seconds
    const tickTimer = setTimeout(() => {
      setShowLoader(false);
      setShowTick(true);
      setShowCrackers(true);
    }, 1000);

    // Fade out the crackers and show the text/buttons after 2 more seconds
    const crackersTimer = setTimeout(() => {
      setFadeOutCrackers(true); // Trigger fade-out animation
    }, 3000);

    // Show the text and buttons after 3 seconds
    const textAndButtonsTimer = setTimeout(() => {
      setShowTextAndButtons(true);
      setShowCrackers(false); // Start the fall animation
    }, 4000);

    return () => {
      clearTimeout(tickTimer);
      clearTimeout(crackersTimer);
      clearTimeout(textAndButtonsTimer);
    };
  }, []);

  return (
    <>
      {paymentData.paymentId ? (
        <div className="flex flex-col items-center justify-center h-[80vh] bg-white">
          {/* Animation Container */}
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* Loader */}
            {showLoader && (
              <div className="w-24 h-24 border-8 border-t-transparent border-[#14AD23] rounded-full animate-spin"></div>
            )}
            {/* Green Circle with Tick */}
            {showTick && (
              <div className="absolute w-40 h-40 bg-[#14AD23] rounded-full flex items-center justify-center transform scale-90 animate-scale-up">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={4}
                  stroke="white"
                  className="w-32 h-32 animate-tick-fall"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            {showCrackers && (
              <div
                className={`absolute flex items-center justify-center w-full h-full ${
                  fadeOutCrackers
                    ? "animate-fall-fade-out"
                    : "animate-scale-up-center"
                }`}
              >
                <PaymentSuccessCracker/>
              </div>
            )}
          </div>

          {/* Success Text and Buttons */}
          <div className="flex flex-col items-center mt-8 gap-4">
            {showTick && (
              <div className="text-4xl font-gilroyBold text-black">
                Wohoo!! Order Placed
              </div>
            )}
            {showTextAndButtons ? (
              <div className="flex flex-col gap-3 animate-fade-in">
                <span
                  className="text-base font-gilroySemiBold bg-black text-white hover:text-black hover:bg-white hover:ring-1 hover:ring-black  px-9 py-4 rounded cursor-pointer"
                  onMouseEnter={() => {
                    router.prefetch("/store");
                  }}
                  onClick={() => {
                    router.push("/store");
                  }}
                >
                  Continue Shopping
                </span>
                <button
                  className="text-lg font-gilroyMedium text-center cursor-pointer"
                  // onClick={() =>  router.push(`/orders/${orderId}`)}
                >
                  View Order
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3"></div>
            )}
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default PaymentSuccess;
