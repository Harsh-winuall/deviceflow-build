"use client";
import { useIsMobile } from "@/app/(root)/_landing-page/_components/IsMobileView";
import { useRouter } from "next/navigation";
import LoginForm from "./_components/login-form";

export default function Login() {
  const isMobile = useIsMobile();
  const router = useRouter();
  return (
    <>
      {isMobile ? (
        <div className="px-6 mx-auto w-full flex justify-center items-center h-[80vh]">
          <div className="mx-auto text-center h-fit">
            <div className="flex justify-center">
              <img
                src="/media/landingPage/mobile-login.webp"
                alt="illustration"
                width={200}
                height={200}
              />
            </div>
            <div className="flex flex-col text-center gap-1">
              <p className="text-xs font-gilroySemiBold">WE’R STILL</p>
              <p className="text-4xl font-gilroyBold text-[#4B8BFF]">
                COOKING OUR APP
              </p>
            </div>

            <div className="text-center flex flex-col text-[#A6A6A6] text-sm font-gilroyMedium -leading-6">
              <span>We’re live on desktop – discover</span>
              <span>seamless browsing!</span>
            </div>

            <div className="w-full flex justify-center">
              <div
                className="mt-7 text-xs font-gilroyMedium px-4 py-2 rounded-[6.826px] bg-[#1D1F20] text-white w-fit cursor-pointer"
                onClick={() => router.push("/")}
              >
                Go to Home
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center border">
          {/* Image Section */}
          <div className="w-[46%] flex justify-center">
            <img
              src="/media/Loginpage.webp"
              alt="edify-background"
              className="h-[86vh] object-contain"
            />
          </div>

          {/* Form Section */}
          <div className="w-[42%] flex flex-col items-center justify-center">
            <div className="font-gilroy flex w-full flex-col gap-y-[17px] text-center">
              <div className="flex items-center justify-center">
                <p className="text-[45px] font-bold leading-[53px] tracking-[-1.72px] text-gray-950 font-gilroyBold">
                  Welcome Again!{" "}
                  <span className="text-[31px] leading-[53px]">👋</span>
                </p>
              </div>
              <div className="flex justify-center font-gilroyMedium text-zinc-600">
                <p className="text-sm">
                  Log in to access your account and manage <br /> your assets
                  effortlessly with DeviceFlow.
                </p>
              </div>
            </div>

            <div className="w-[76%] max-lg:w-full h-fit max-lg:mt-4">
              <LoginForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
