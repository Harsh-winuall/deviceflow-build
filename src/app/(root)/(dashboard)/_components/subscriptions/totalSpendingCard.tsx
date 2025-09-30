"use client";
import { formatNumber } from "@/lib/utils";
import { Subscriptions, TeamWiseStat } from "./interface";
import MultiLevelProgressBar from "./MultiLevelProgress";

export default function TotalSpendingCard({
  integrationData,
  totalPrice,
}: {
  integrationData?: Subscriptions;
  totalPrice?: number;
}) {
  const colors = ["#7086FD", "#F7B64F", "#63bc48", "#FF928A"];

  // seats count total
  const totalSeatCount = integrationData?.reduce(
    (acc, item) => acc + item?.totalSubscriptionsCount,
    0
  );

  // ✅ Prepare modifiedData with "Others"
  let modifiedData: TeamWiseStat[] = [];
  if (integrationData?.length > 4) {
    const top3 = integrationData.slice(0, 3);
    const others = integrationData.slice(3);

    const othersAggregate = {
      teamName: "Others",
      totalSubscriptionsCount: others.reduce(
        (acc, item) => acc + item.totalSubscriptionsCount,
        0
      ),
      totalTeamSubscriptionCost: others.reduce(
        (acc, item) => acc + item.totalTeamSubscriptionCost,
        0
      ),
      userCount: others.reduce((acc, item) => acc + (item.userCount ?? 0), 0),
    };

    modifiedData = [...top3, othersAggregate];
  } else {
    modifiedData = integrationData ?? [];
  }

  // ✅ Progress data calculation
  const progressData = modifiedData?.map(
    (response: TeamWiseStat, index: number) => {
      const percentage = totalSeatCount
        ? (response?.totalSubscriptionsCount / totalSeatCount) * 100
        : 0;
      return {
        color: colors[index % colors.length],
        percentage: parseFloat(percentage.toFixed(2)),
      };
    }
  );

  if (!integrationData) {
    return (
      <div className="w-[50%] bg-white rounded-md border border-black/10 flex flex-col justify-center items-center px-3 py-5 gap-6 lg:p-7">
        <img
          src="/media/dashboard/spending-empty.webp"
          width={200}
          height={150}
        />
        <div className="w-full">
          <p className="text-black text-lg font-gilroySemiBold text-center">
            No data Available
          </p>
          <p className="text-gray-400 text-sm font-gilroyMedium text-center">
            Integrate your apps to see data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-[50%] bg-white rounded-md border border-black/10 flex flex-col justify-start px-3 py-5 lg:p-7"
      style={{
        background:
          "linear-gradient(147deg, rgb(13, 155, 0) -47.83%, rgba(13, 155, 0, 0.34) -27.9%, hsl(0deg 0% 100%) 36.95%)",
      }}
    >
      <div className="flex justify-start items-center gap-4">
        <h1 className="font-gilroyBold text-5xl font-bold text-black">
          ₹{formatNumber(totalPrice ?? 0)}
        </h1>
      </div>

      <div className="border mt-4 border-gray-200 border-dashed"></div>

      <div>
        <div className="flex gap-2 items-center mt-5">
          <span className="text-[#11263C] text-center font-gilroySemiBold text-4xl ">
            {totalSeatCount ?? 0}
          </span>
          <span className="text-black mt-1 font-gilroyMedium text-base font-medium ">
            Seats
          </span>
        </div>

        <MultiLevelProgressBar segments={progressData} />

        <div className="flex gap-2 items-center justify-between mt-4 flex-wrap">
          {modifiedData?.map((res: any, index: number) => (
            <div key={index} className="flex gap-2 items-start justify-center">
              <div
                className="mt-2"
                style={{
                  width: 30,
                  height: 5,
                  borderRadius: 100,
                  background: colors[index % colors.length],
                }}
              />
              <div className="flex gap-2 flex-col">
                <span className="text-black font-gilroySemiBold text-xs xl:text-sm">
                  {res?.teamName}
                </span>
                <span className="text-black font-gilroySemiBold text-xs xl:text-sm">
                  {res?.totalSubscriptionsCount} Seats
                </span>
                <span className="text-black font-gilroySemiBold text-xs xl:text-sm">
                  ₹{formatNumber(res?.totalTeamSubscriptionCost ?? 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
