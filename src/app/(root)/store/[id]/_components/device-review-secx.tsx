"use client";
import { Icons } from "@/components/icons";
import { StoreDevice } from "@/server/deviceActions";
import { RatingStarComp } from "./rating-stars";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CreateReview } from "./create-review";

export const DeviceReviewsSecx = ({ data }: { data: StoreDevice }) => {
  const { overallReviews, overallRating } = data;
  const [viewMore, setViewMore] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(2);

  useEffect(() => {
    // Set the number of visible reviews based on the total number of reviews
    setVisibleReviews(data?.reviews?.length! > 2 ? 2 : data?.reviews?.length!);
  }, [data]);

  const handleViewMore = () => {
    // Toggle the viewMore state
    setViewMore(!viewMore);
    // If viewMore is true, show all reviews; otherwise, show only 2
    setVisibleReviews(viewMore ? 2 : data?.reviews?.length!);
  };

  return (
    <section className="px-[8.5rem] flex flex-col pt-5 pb-4 ">
      <div className="px-5 py-3 ">
        <h3 className="text-[#0D0C22] font-gilroyMedium text-xl 2xl:text-2xl pb-2">
          Reviews
        </h3>
        <div className="flex justify-between mb-3">
          <div className="w-[28%] flex flex-col gap-y-3">
            <h2 className="font-gilroyBold text-6xl 2xl:text-[5rem]">
              {overallRating}
            </h2>
            <div className="flex gap-2 items-end flex-wrap">
              <RatingStarComp rating={overallRating ?? ""} className="size-7" />
              <span className="text-[#858585] font-gilroyMedium text-base">{`(${overallReviews} Reviews)`}</span>
            </div>

            <CreateReview deviceId={data?._id ?? ""}>
              <span className="rounded-md  bg-black text-white hover:text-black hover:bg-white hover:ring-1 hover:ring-black font-gilroyMedium text-base 2xl:text-2xl  flex justify-center items-center h-10 mt-2">
                Write a Review
              </span>
            </CreateReview>
          </div>

          <div className="w-[68%] flex flex-col-reverse gap-y-2.5 -mt-4">
            {data?.ratingDetails?.map((v) => (
              <div
                key={v.stars}
                className="flex gap-4 max-[1300px]:gap-6 justify-between items-center"
              >
                <div className="whitespace-nowrap font-gilroyMedium w-[7%]">{`${v.stars} stars`}</div>
                <div className="rounded-2xl h-[6px] relative bg-[#F2F6FB]  w-[83%]">
                  <div
                    style={{ width: `${v.percentage}%` }}
                    className=" rounded-2xl absolute h-full bg-[#E7B66B] "
                  />
                </div>
                <span className="font-gilroyMedium w-[8%]">
                  {v.reviewsCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-2.5 pt-5">
          {data?.reviews?.slice(0, visibleReviews).map((v, i) => (
            <div className="flex flex-col" key={v?._id}>
              <div className="flex flex-col gap-y-4 py-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-x-2">
                    <RatingStarComp
                      rating={v?.rating ?? "-"}
                      className="size-5"
                    />
                    <div className="text-[#858585] text-lg font-gilroyMedium">{`${
                      v?.rating ?? 0
                    }/5`}</div>
                  </div>
                  <span className="text-sm font-gilroyMedium">
                    {new Date(v?.createdAt!).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  {v?.image ? (
                    <>
                      <img
                        src={v?.image}
                        alt="user"
                        className="size-11 rounded-full border"
                      />
                    </>
                  ) : (
                    <>
                      <div className="size-14 rounded-full bg-opacity-20 bg-[#5465FF] text-[#5465FF] font-gilroySemiBold text-lg flex justify-center items-center">
                        {v?.name?.split("")[0].toUpperCase() ?? ""}
                      </div>
                    </>
                  )}
                  <div className="flex flex-col ">
                    <span className="font-gilroyMedium text-base/3 ">
                      {v?.name ?? ""}
                    </span>
                    <span className="text-[#858585] text-sm font-gilroyMedium">
                      {/* {v?.role ?? ""} */}
                      Backend Dev
                    </span>
                  </div>
                </div>
                {/* 
                review images
                <div className="flex gap-y-2">
                
                  <div className="flex gap-x-2">
                    <div className="size-20 bg-slate-100 rounded-md" />
                    <div className="size-20 bg-slate-100 rounded-md" />
                    <div className="size-20 bg-slate-100 rounded-md" />
                  </div>
                </div> */}

                <p className="text-[#0D0C22] text-base text-pretty font-gilroyMedium">
                  {v?.comment ?? ""}
                </p>
              </div>
              {i < data?.reviews?.length! - 1 && data?.reviews?.length! > 1 && (
                <div className="h-[2px] w-full bg-[#F8F7F4] rounded-3xl mt-2.5 mb-3.5" />
              )}
            </div>
          ))}
        </div>

        {data?.reviews?.length! > 2 && (
          <div className="flex items-center justify-center py-4">
            <button
              onClick={handleViewMore}
              className="w-40 group h-12 border border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center gap-1.5 rounded-md "
            >
              {viewMore ? (
                <>
                  <span className="font-gilroySemiBold text-sm pr-1">
                    View Less
                  </span>
                  <ChevronUp className="text-black group-hover:text-white" />
                </>
              ) : (
                <>
                  <span className="font-gilroySemiBold text-sm">View More</span>
                  <ChevronDown className="text-black group-hover:text-white" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
