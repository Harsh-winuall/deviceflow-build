"use client";
import { Table } from "@/components/wind/Table";
import { User } from "@/server/userActions";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { orderIcons } from "../icons";
const ITEMS_PER_PAGE = 5;
function AllOrdersTable({ data }: { data: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };

  // const [currentPage, setCurrentPage] = useState(1);

  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // const currentOrder = data?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // const totalPages = data && data.length > 0 ? Math.ceil(data.length / 5) : 0;

  // const handlePageChange = (page: number) => setCurrentPage(page);
  return (
    <>
      {!isLoading && data?.length === 0 ? (
        <div className="flex flex-col gap-6 justify-center items-center py-10">
          <div className="flex  font-gilroySemiBold flex-col   justify-center items-center ">
            <img src="/media/no_data/Orders.svg" alt="No-Orders Logo" />
          </div>

          <Link href={"/store"}>
            <div className="py-2 px-5 text-sm rounded-md hover:bg-gray-800 text-white font-gilroySemiBold bg-black">
              Shop Now
            </div>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-[#F6F6F6] bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px]  flex flex-col ">
          <div className="flex 2xl:gap-2 gap-1.5 w-fit px-6 pt-5">
            <h1 className="text-base font-gilroyMedium ">Total Orders</h1>
            <span className="2xl:text-[12.435px] ml-1 text-xs font-gilroySemiBold flex justify-center items-center rounded-full px-2 bg-[#F9F5FF] text-[#6941C6]">
              {data?.length} Orders
            </span>
          </div>

          <div className="flex flex-col mt-5">
            <Table
              data={data ?? []}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              isLoading={isLoading}
              checkboxSelection={{
                uniqueField: "_id",
                //logic yet to be done
                onSelectionChange: handleSelectionChange,
              }}
              columns={[
                {
                  title: "Order ID",
                  render: (data: any) => (
                    <div
                      className="2xl:w-28  justify-start flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/orders/${data?.cartDetails?.razorpay_order_id}`
                        )
                      }
                    >
                      <div className="font-gilroySemiBold 2xl:text-[14.507px] text-sm gap-1 flex whitespace-nowrap  text-black ">
                        {data?.cartDetails?.razorpay_order_id}
                      </div>
                    </div>
                  ),
                },

                {
                  title: "Ordered on",
                  render: (record) => {
                    const date = new Date(record?.response[0]?.ordered_on);

                    const formattedDate = date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    return <div>{formattedDate}</div>;
                  },
                },
                {
                  title: "QTY",
                  // dataIndex: "quantity",
                  render: (data) => (
                    <div className=" whitespace-nowrap flex 2xl:text-[14.507px] text-[12.507px] text-[#7F7F7F] gap-1">
                      {data?.response?.length} items
                    </div>
                  ),
                },
                {
                  title: "Payment Status",
                  // dataIndex: "quantity",
                  render: (data) => (
                    <>
                      {data?.cartDetails?.state !== "failed" ? (
                        <div className="text-[#027A48] bg-[#ECFDF3] py-1 px-2 rounded-[16.58px] whitespace-nowrap flex text-xs w-fit">
                          {data?.cartDetails?.state}
                        </div>
                      ) : (
                        <div className="bg-alert-foreground text-failure py-1 px-2 rounded-[16.58px] text-xs w-fit">
                          {data?.cartDetails?.state}
                        </div>
                      )}
                    </>
                  ),
                },
                {
                  title: "Delivery Office",
                  render: (data: User) => (
                    <div className=" whitespace-nowrap flex 2xl:text-[14.507px] text-[12.507px] text-[#7F7F7F] gap-1">
                      {data?.cartDetails?.addressId?.city}
                    </div>
                  ),
                },
                {
                  title: "Total",
                  render: (data) => (
                    <div className="whitespace-nowrap flex 2xl:text-[14.507px] text-[12.507px] text-[#7F7F7F] gap-1">
                      {data?.cartDetails?.totalPrice
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(Number(data.cartDetails.totalPrice))
                        : "N/A"}
                    </div>
                  ),
                },
                {
                  title: "",
                  render: (data) => (
                    <ChevronRight className="text-[#CECECE] 2xl:text-[14.507px] text-[12.507px] cursor-pointer" />
                  ),
                },
              ]}
            />
            {/* Pagination Control */}
          </div>
          {/* <div className="my-2">
            <Pagination
              current_page={currentPage}
              per_page={ITEMS_PER_PAGE}
              total_pages={totalPages}
              onPageChange={handlePageChange}
            />
          </div> */}
        </div>
      )}
    </>
  );
}

export default AllOrdersTable;
