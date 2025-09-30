import React from "react";

const FeaturesSection = () => {
  return (
    <div className="w-[80%] mx-auto grid gap-6">
      {/* First Row - changes from 3 columns to 1 column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <img
          src="/media/investorsPage/bottom-1.png"
          alt="first feature"
          className="w-full"
        />
        <img
          src="/media/investorsPage/bottom-2.png"
          alt="second feature"
          className="w-full"
        />
        <img
          src="/media/investorsPage/bottom-3.png"
          alt="third feature"
          className="w-full"
        />
      </div>

      {/* Second Row - uncomment if needed */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <img
          src="/media/investorsPage/bottom-4.png"
          alt="fourth feature"
          className="w-full sm:col-span-1"
        />
        <img
          src="/media/investorsPage/bottom-5.png"
          alt="fifth feature"
          className="w-full sm:col-span-2"
        />
      </div> */}
    </div>
  );
};

export default FeaturesSection;