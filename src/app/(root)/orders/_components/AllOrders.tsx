import { getPreviousOrders } from "@/server/orderActions";
import React from "react";
import AllOrdersTable from "./AllOrdersTable";

const AllOrders = async () => {
  const prevOrders = await getPreviousOrders();
  return (
    <>
      <div className="rounded-[33px] border border-[#C3C3C34F] 2xl:p-5 p-3 bg-white/80 backdrop-blur-[22.8px]">
        <AllOrdersTable data={prevOrders} />
      </div>
    </>
  );
};

export default AllOrders;
