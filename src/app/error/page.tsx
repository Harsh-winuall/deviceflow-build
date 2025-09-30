export default function Error() {
  return (
    <div className="flex flex-col justify-center items-center h-[95vh] sm:h-screen w-full">
      <div className="relative w-full h-[65%] flex justify-center items-center">
        <img
          src="/media/error.webp"
          alt="500-error"
          className="w-48 absolute z-[1] h-48 sm:w-60 sm:h-60 md:w-[500px] md:h-[350px] lg:w-[650px] lg:h-[420px]  object-contain"
        />
        <div className="text-[#EEE] absolute z-[0] font-gilroyBold text-8xl sm:text-[16rem] md:text-[18rem] lg:text-[20rem] ">
          500
        </div>
      </div>
      <h1 className="text-[1.2rem] md:text-3xl lg:text-4xl  font-gilroyBold font-manuale text-black mb-4">
        Sorry, Unexpected Error
      </h1>
      <h2 className="text-[0.9rem] md:text-xl lg:text-2xl  font-gilroyMedium font-manuale text-[#6C6C6C] mb-4 text-center">
        We are working on fixing the problem. Be Back Soon
      </h2>
    </div>
  );
}
