"use client";
import { Device } from "@/server/deviceActions";
import { PreviousOrder } from "@/server/orderActions";
import { useRouter } from "next/navigation";
import React from "react";

export interface OrdersProps {
  data: Array<PreviousOrder & { item: Device }>;
}

const Orders: React.FC<OrdersProps> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <h1 className="text-3xl font-gilroyBold text-gray-800 mb-10">
        Your Orders
      </h1>
      <div className="space-y-8">
        {data?.map((order) => (
          <div
            key={order?._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out"
          >
            <div className="flex items-start">
              <img
                src={
                  order?.item?.image![0]?.url ||
                  "https://th.bing.com/th/id/R.d589fbf35245e2db2929bb113c0b1547?rik=fhPXY3J%2ff4BmSw&riu=http%3a%2f%2fwww.tracyandmatt.co.uk%2fwp%2fwp-content%2fuploads%2f2013%2f11%2fcomputer-laptop.png&ehk=GBtBE3fo5fsbw6lTC9D4mX%2fXwJRRolFdXxhiHPufbSg%3d&risl=&pid=ImgRaw&r=0"
                }
                alt={order?.item?.device_name}
                className="w-28 h-28 object-cover rounded-md border border-gray-300"
              />
              <div className="ml-6 flex-1">
                <h2 className="text-xl font-gilroySemiBold text-gray-800 mb-1">
                  {order?.item?.device_name}
                </h2>
                <p className="text-gray-500 mb-1">Order ID: {order?._id}</p>
                <p className="text-gray-500 mb-1">
                  Quantity: {order?.quantity}
                </p>
                <p className="text-gray-700 font-gilroySemiBold mb-1">
                  Price: ₹ {order?.price}
                </p>
                <p className="text-sm text-gray-400">
                  Ordered on: {new Date(order?.createdAt)?.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-6">
              <button
                className="text-sm font-gilroyMedium text-blue-600 hover:text-blue-800 hover:underline"
                onClick={() => router.push(`assets/${order?.itemId}`)}
              >
                View Details
              </button>
              <button
                className="text-sm font-gilroyMedium text-blue-600 hover:text-blue-800 hover:underline"
                onClick={() => router.push(`/store`)}
              >
                Buy Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
