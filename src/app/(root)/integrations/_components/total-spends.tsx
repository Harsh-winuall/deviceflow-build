"use client";
import { buttonVariants } from "@/components/buttons/Button";
import { getUsersOfIntegration } from "@/server/integrationActions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SeatsCard from "./seats-card";
import { formatNumber } from "@/lib/utils";

export const TotalSpends = ({totalPrice}:{totalPrice?:number}) => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["user-by-integrations", "all-data"],
    queryFn: () => getUsersOfIntegration({}),
  });

  return (
    <div className="rounded-md border bg-white p-3 flex justify-between w-full mb-3.5">
      {/* {JSON.stringify(data)} */}
      <div className="flex flex-col justify-start gap-y-5 pt-2">
        <div className="flex flex-col justify-start">
          <h3 className="font-gilroySemiBold text-xl">Total Spends</h3>
          {/* {(() => {
            const date = new Date();
            const currentMonthIndex = date.getMonth();
            const currentYear = date.getFullYear();

            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            const currentMonth = monthNames[currentMonthIndex];
            const nextMonth = monthNames[(currentMonthIndex + 1) % 12];

            return (
              <p className="font-gilroyMedium text-base text-[#7F7F7F]">{`${currentMonth} - ${nextMonth} ${currentYear}`}</p>
            );
          })()} */}
        </div>

        <p className="flex items-end gap-1 font-gilroyBold text-4xl ">
          {`₹${formatNumber(totalPrice ?? 0)}`}
        </p>
      </div>

      <div className="flex justify-end gap-3 flex-none w-[76%]">
        <div className="max-w-52 w-full h-32 rounded-lg flex flex-col justify-between bg-black text-white p-3.5">
          <span className="font-gilroyMedium text-sm">Can Save</span>
          <div className="font-gilroyBold text-2xl w-fit">
            {`₹${formatNumber(data?.unmappedUsersCost ?? 0)}`}
          </div>
          <span
            className={buttonVariants({
              className:
                "text-center  h-8 rounded-lg text-sm bg-white text-black w-full font-gilroySemiBold border border-black",
            })}
          >
            Coming Soon
          </span>
        </div>

        <SeatsCard
          type="total"
          totalSeats={data?.totalSeats ?? 0}
          onClick={() => {
            router.push("/integrations/users?tab=totalseats");
          }}
          data={data}
        />

        <SeatsCard
          type="unmapped"
          onClick={() => {
            router.push("/integrations/users?tab=unmapped");
          }}
          totalSeats={data?.unmappedSeats ?? 0}
          data={data}
        />
        <SeatsCard
          type="unused"
          className="cursor-default"
          totalSeats={0}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};
