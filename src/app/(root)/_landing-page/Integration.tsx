import React from "react";

export function Integration({}) {
  return (
    <div
      className={`font-gilroy flex w-full flex-col items-center gap-y-2 bg-white max-[380px]:px-4 px-8 pt-24 sm:px-12 lg:px-36 mb-20 text-center tracking-[0px] text-gray-500`}
    >
      <div className="w-full font-gilroySemiBold leading-6 text-xl max-sm:text-sm max-lg:text-lg">
        Integrations
      </div>
      <div className="w-full max-lg:text-3xl font-gilroySemiBold leading-[40px] max-sm:text-2xl text-4xl max-sm:leading-[30px] text-gray-950">
        Upcoming Integrations
      </div>
      <div className="flex items-end justify-center self-stretch px-8 sm:px-16 pt-2 text-lg max-sm:text-base font-gilroyMedium leading-[30px] max-sm:hidden">
        <div>
          <div className="text-center max-sm:text-sm">
            Soon DeviceFlow will work seamlessly with your favorite apps.
          </div>
          <div className="max-sm:text-sm">
            Use over 50+ apps with just one click.
          </div>
        </div>
      </div>

      <div className="max-sm:block hidden self-stretch px-8 sm:px-16 pt-2 text-lg max-sm:text-base font-gilroyMedium leading-[30px] ">
        Soon DeviceFlow will work seamlessly with your favorite apps.
      </div>

      <div className="flex items-end justify-center self-stretch pr-[0.32px] pt-12 sm:pt-16">
        <div className="flex items-center justify-center gap-x-[8.5px] pt-[1.4px] text-center">
          <img
            src="/media/landingPage/Deviceflow-logo.png"
            alt="deviceflow-logo"
            width={160}
            height={36}
            style={{
              flexShrink: 0,
            }}
            className="max-lg:w-48"
          />
        </div>
      </div>
      <div className="flex items-center justify-center self-stretch px-6 sm:px-12 py-[1.5px]">
        <div className="relative w-full z-0 flex items-center justify-center pt-2.5 text-center">
          <img
            src="/media/landingPage/device-flow-vector.webp"
            alt="device-flow-vector"
            width={"100%"}
            height={100}
            style={{
              flexShrink: 0,
            }}
            className=" max-sm:w-full max-sm:h-[52px] max-lg:w-40"
          />
        </div>
      </div>
      <div className="relative max-lg:w-[100%] max-lg:mx-auto flex items-center justify-center max-lg:gap-x-4 gap-[65px] gap-y-9 self-stretch pt-[3.5px] min-[1430px]:flex-nowrap max-lg:flex-row max-lg:gap-y-6 max-lg:overflow-hidden">
        <img
          alt="gmail"
          src="/media/landingPage/gmail.webp"
          className="max-sm:w-[65px] max-sm:h-[50px] md:w-[63px] md:h-[79px] md:mt-2"
        />
        <img
          alt="slack"
          src="/media/landingPage/Slack.webp"
          className=" max-sm:w-[55px] max-sm:h-[35px] max-sm:mt-[13px] md:w-[46px] md:h-[49px] md:mt-5"
        />
        <img
          src="/media/landingPage/zoho.webp"
          alt="zoho"
          className="max-sm:w-[80px] max-sm:h-[60px] md:w-[124px] md:h-[85px]"
        />
        <img
          src="/media/landingPage/keka.webp"
          alt="keka"
          className="max-sm:w-[65px] max-sm:h-[45px] md:w-[75px] md:h-[80px]"
        />
        <img
          src="/media/landingPage/sheet.webp"
          alt="sheet"
          className=" max-sm:w-[55px] max-sm:h-[35px] max-sm:mt-[13px] md:w-[53px] md:h-[59px] md:mt-5"
        />
        <img
          src="/media/landingPage/asana.webp"
          alt="asana"
          className="max-sm:w-[55px] max-sm:h-[35px] max-sm:mt-[13px] md:w-[60px] md:h-[53px] md:mt-5"
        />
        <img
          src="/media/landingPage/razor.webp"
          alt="razorpay"
          style={{ width: 239, height: 68, marginTop: 16 }}
          className=" max-sm:hidden max-sm:w-8 max-sm:h-8"
        />
      </div>
    </div>
  );
}
