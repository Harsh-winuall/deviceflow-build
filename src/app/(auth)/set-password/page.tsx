'use client'
import React from "react";
import SetPasswordForm from "./_components/set-password-form";
import { notFound, useSearchParams } from "next/navigation";

const SetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return notFound();
  }
  return (
    <div className="w-full h-[96vh] justify-around flex flex-col lg:flex-row p-8 max-lg:p-2">
      <div className="w-[46%] h-full max-lg:hidden">
        <img
          src="/media/Loginpage.webp"
          alt="edify-background"
          width={"100%"}
          className="object-contain"
          style={{ height: 690 }}
        />
      </div>
      <div className="w-[42%] relative h-full justify-center items-center flex flex-col max-lg:w-full">
        <div
          className={`font-gilroy flex w-full flex-col gap-y-[17px] text-center `}
        >
          <div className="flex items-center">
            <div className="flex h-full w-full flex-shrink-0 flex-col justify-center overflow-clip pr-[0.31px] pt-[0.51px] text-center">
              <div className="flex h-[53px] max-lg:h-fit max-lg:text-4xl flex-shrink-0 items-center justify-center text-[45px] font-bold leading-[53px] tracking-[-1.72px] text-gray-950">
                <p className="text-center font-gilroyBold">{"Set Password "}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center px-16 max-lg:px-0 font-gilroyMedium leading-[26px] tracking-[0px] text-zinc-600">
            <p className="text-center text-sm">
              Log in to access your account and manage your assets effortlessly
              with DeviceFlow.
            </p>
          </div>
        </div>
        <div className="w-[76%] max-lg:w-full h-fit max-lg:mt-4">
          <SetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
