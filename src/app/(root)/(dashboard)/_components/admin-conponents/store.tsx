export const DashboardStore = () => {
  return (
    <div className={`z-0 flex w-full items-start rounded-3xl `}>
      <div className="font-gilroy relative flex h-full w-full flex-shrink-0 flex-col gap-y-2 overflow-clip rounded-3xl border border-solid border-x-[#c0c0c099] border-y-[#c0c0c099] bg-white px-3.5 pb-[15px] pt-3 font-gilroyMedium tracking-[0px]">
        <div className="bg-dell__inspiron_2in-1_16_oled_touch_laptop_12th_gen_intel_core_i-7_16gb_memory_512gb_ssd_nv absolute bottom-0 right-0 z-0 h-24 max-h-full w-[121px] max-w-full flex-shrink-0 bg-no-repeat [background-position:0px_0px] [background-size:186%_160%]" />
        <div className="relative z-[2] flex items-center justify-center pr-1.5">
          <div className="z-[1] flex flex-grow flex-col gap-y-[5.1px] pl-[0.24px]">
            <div className="flex items-center">
              <div className="flex items-center justify-center rounded-[34px] border-x-[0.44px] border-t-[0.44px] border-solid border-x-[dimgray] border-y-[dimgray] py-[2.2px] pl-2.5 pr-[11px] [border-bottom-width:0.44px]">
                <div className="text-center text-[7.9px] leading-[9.7px] text-[dimgray]">
                  Store
                </div>
              </div>
            </div>
            <div>
              <div className="text-[21px] leading-6">
                <span>
                  <p>Top-Quality  </p>
                  <p>Refurbished & New</p>
                  <p>Devices</p>
                </span>
              </div>
              <div className="flex h-[17px] flex-shrink-0 items-end pr-[121px] text-[9px] leading-[11px] text-[darkgray]">
                <span>
                  <p>Affordable, reliable, and ready for work..</p>
                </span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-3.5 z-[2] flex h-7 w-[73px] flex-shrink-0 flex-col items-center">
            <div className="flex items-center justify-center gap-x-[7px] rounded-[57px] bg-black px-[18px] py-[6.5px]">
              <div className="text-[13px] font-gilroySemiBold leading-[normal] text-white">
                Visit
              </div>
              <div className="flex flex-col items-center">
                {/* <Frame className="h-[7.6px] w-[4.7px] flex-shrink-0" /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="z-[3] flex items-center gap-x-1 text-center text-[7.9px] leading-[9.7px]">
          <div className="flex items-center justify-center rounded-[34px] border-x-[0.44px] border-t-[0.44px] border-solid border-x-black border-y-black px-[11px] py-[2.2px] [border-bottom-width:0.44px]">
            <div className="text-center">Laptops</div>
          </div>
          <div className="flex items-center justify-center rounded-[34px] border-x-[0.44px] border-t-[0.44px] border-solid border-x-black border-y-black px-[11px] py-[2.2px] [border-bottom-width:0.44px]">
            <div className="text-center">Accessories</div>
          </div>
        </div>
      </div>
    </div>
  );
};
