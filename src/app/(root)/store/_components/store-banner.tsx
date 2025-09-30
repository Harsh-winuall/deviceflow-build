import StoreBanners from "@/icons/StoreBanners";

function StoreBanner() {
  return (
    <>
      <div className="flex  bg-white relative px-24 flex-col justify-center items-center w-full overflow-hidden">
        {/* Absolute Positioned Image */}
        <img
          src="/media/store_banner.png"
          alt="store_banner"
          className="absolute w-[25rem] h-[20rem] -left-[2.75rem] top-[4.2rem] object-contain"
        />

        {/* Text Content */}
        <div className="flex flex-col gap-6 pt-16">
          <h1 className="text-6xl font-gilroySemiBold flex gap-1 flex-col justify-center items-center">
            <span>Top-Quality Refurbished</span>
            <span>& New Devices</span>{" "}
          </h1>
          <h1 className="text-2xl gap-2 font-gilroyMedium text-[#7F7F7F] flex flex-col justify-center items-center">
            <span>Affordable, reliable, and ready for work.</span>
          </h1>
        </div>
        {/*Icons content*/}
        <div className="pt-36 flex pb-12 gap-24">
          <div className="text-xl gap-6  flex font-gilroyMedium">
            <StoreBanners.store_banner_car className="size-20" />
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-[#717171]">Free Delivery</h1>
              <h1 className="text-black"> 1-2 day</h1>
            </div>
          </div>
          <div className="text-xl gap-6  flex font-gilroyMedium">
            <StoreBanners.store_banner_payment className="size-20" />
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-[#717171]">Secure Payments</h1>
              <h1 className="text-black">With all modes </h1>
            </div>
          </div>
          <div className="text-xl gap-6  flex font-gilroyMedium">
            <StoreBanners.store_banner_warranty className="size-20" />
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-[#717171]">Warranty on</h1>
              <h1 className="text-black"> All products</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoreBanner;
