import React from "react";

const Brands = () => {
  const brands = [
    "/media/company/metafin.webp",
    "/media/company/joyspoon.webp",
    "/media/company/urban-white.webp",
    "/media/company/finaag.webp",
    "/media/company/mygate.webp",
    "/media/company/apnamart-new.webp",
    "/media/company/elchemy-new.webp",
    "/media/company/42-new.webp",
    "/media/company/apna.webp",
  ];

  return (
    <>
      <div className="flex flex-col lg:hidden justify-center items-center w-[95%] sm:w-[80%] lg:w-[70%]">
        <p className="text-lg sm:text-xl text-[#71717A] font-gilroyMedium mb-10 sm:mb-16 text-center">
          Popular brands use Deviceflow
        </p>

        {/* Brands Grid */}
        <div className="grid grid-cols-3   lg:grid-cols-5 gap-2 sm:gap-6 w-full justify-items-center">
          {brands.map((src, index) => (
            <div
              key={index}
              className="w-[100px] sm:w-[140px] h-[50px] flex items-center justify-center"
            >
              <img
                src={src}
                alt="brand-logo"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="bg-white h-[1px] w-full max-w-[400px] my-10 sm:my-14 opacity-10"></div>

        {/* Logo */}
        <img
          src="/media/logo/deviceflow-white.svg"
          alt="deviceflow"
          className="w-[120px] sm:w-[140px] h-[50px] object-contain"
        />
      </div>
      <div className="lg:flex hidden flex-col justify-center items-center sm:w-[70%] w-[95%]">
        <p className="text-xl text-[#71717A] font-gilroyMedium mb-16">
          Popular brands use Deviceflow
        </p>

        <div className="flex gap-6 w-full justify-between items-center">
          <img
            src="/media/company/metafin.webp"
            style={{ width: 140, height: 38, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
          <img
            src="/media/company/joyspoon.webp"
            style={{ width: 140, height: 38, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
          <img
            src="/media/company/urban-white.webp"
            style={{ width: 110, height: 60 }}
            className="max-md:w-4 max-md:h-4"
          />
          <img
            src="/media/company/finaag.webp"
            style={{ width: 70, height: 55, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
          <img
            src="/media/company/mygate.webp"
            style={{ width: 120, height: 38, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
        </div>

        <div className="flex gap w-full justify-between items-center mt-14 md:px-8 px-2">
          <img
            src="/media/company/apnamart-new.webp"
            style={{ width: 140, height: 60, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
          <img
            src="/media/company/elchemy-new.webp"
            style={{ width: 140, height: 38, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
          <img
            src="/media/company/42-new.webp"
            style={{ width: 110, height: 80, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
          <img
            src="/media/company/apna.webp"
            style={{ width: 80, height: 70, marginTop: 9 }}
            className="max-md:w-4 max-md:h-4 "
          />
        </div>

        <div className="bg-white h-[1px] w-[412px] my-14 opacity-10"></div>

        <img src="/media/logo/deviceflow-white.svg" alt="deviceflow" />
      </div>
    </>
  );
};

export default Brands;
