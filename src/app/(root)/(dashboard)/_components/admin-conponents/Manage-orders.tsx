import { useRouter } from "next/navigation";
import { DashboardDetails } from "./interface";
import EmptyOrderIcon from "@/icons/EmptyOrderIcon";

export const ManageOrders = ({
  dashboardData,
}: {
  dashboardData: DashboardDetails | null;
}) => {
  const router = useRouter();

  return (
    <div
      className={`font-gilroy relative flex w-full flex-col items-start gap-y-[11px] rounded-3xl border border-solid border-x-[#c0c0c099] border-y-[#c0c0c099] bg-white pb-[13px] pl-[13px] pr-[13px] pt-[13px] tracking-[0px] backdrop-blur-[24] `}
    >
      <div className="flex items-center self-stretch px-[1.3px]">
        <div className="text-sm font-gilroySemiBold leading-[23px]">Orders</div>
      </div>

      <div className="self-stretch pr-[0.8px] pt-[3px]">
        {(dashboardData?.orders.length || 0) > 0 ? (
          dashboardData?.orders?.map((response, index) => {
            const date = new Date(response.created_at);
            const formattedDate = date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            return (
              <div className="p-1 " key={`orders-${index}`}>
                <div
                  style={{
                    width: "100%",
                    height: 43,
                    borderRadius: "6.561px",
                    background: "#F4F4F4",
                    paddingTop: 6,
                    paddingLeft: 7,
                    paddingRight: 6,
                  }}
                >
                  <div className="flex justify-between items-center gap-2 ">
                    <div className="flex flex-col">
                      <div
                        style={{
                          color: "#000",
                          fontSize: "11.859px",
                          fontStyle: "normal",
                          fontWeight: 600,
                        }}
                        className="font-gilroySemiBold"
                      >
                        {response.orderId}
                      </div>
                      <div className="flex gap-2">
                        <div
                          style={{
                            color: "#737791",
                            fontSize: 9,
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "17.789px",
                          }}
                        >
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        borderRadius: 5.672,
                        border: " 0.709px solid #E5E5E5",
                        width: 70,
                        height: 28,
                        background: "#FFF",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        marginRight: 2,
                        marginBottom: 5
                      }}
                      onClick={() => {
                        router.push(`orders/${response.orderId}`);
                      }}
                    >
                      <span
                        style={{
                          color: "#0F3659",
                          fontSize: 9,
                          fontStyle: "normal",
                          fontWeight: "500",
                          lineHeight: "14.179px",
                        }}
                      >
                        {" "}
                        View More
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col justify-center items-center">
            <EmptyOrderIcon/>
            <div
              className={`font-gilroy h-12 w-full text-center font-semibold leading-[19px] tracking-[0px]`}
            >
              <span>
                <p className="text-center text-[15px] leading-[19px]">
                  {"No orders yet. "}
                </p>
                <p className="text-center text-xs leading-[19px] text-[dimgray]">
                  Your wish list is waiting to shine!
                </p>
              </span>
            </div>
          </div>
        )}
        {dashboardData?.orders.length !==0 && <div
          className="flex items-center absolute bottom-3 w-[90%] justify-center rounded-[49px]  whitespace-nowrap right-3 bg-black py-[9px] "
          style={{ marginTop: !dashboardData ? 70 : 0, cursor: "pointer" }}
          onClick={() => {
            router.push("orders");
          }}
        >
          <div className="text-center text-sm font-gilroySemiBold leading-[normal] text-white">
            Manage Orders
          </div>
        </div>}
      </div>
    </div>
  );
};
