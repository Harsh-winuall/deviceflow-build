"use client";
import { OrdersProps } from "@/app/(root)/orders/_components/orderPage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const NewDeviceTable: React.FC<OrdersProps> = ({ data }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Devices purchased within the last 7 days
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const filteredData = data.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= twoDaysAgo;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 h-96 overflow-y-auto">
        {paginatedData.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-sm rounded-md p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300 ease-in-out"
          >
            <div className="flex items-center">
              <img
                src={
                  order.item.image ||
                  "https://th.bing.com/th/id/R.d589fbf35245e2db2929bb113c0b1547?rik=fhPXY3J%2ff4BmSw&riu=http%3a%2f%2fwww.tracyandmatt.co.uk%2fwp%2fwp-content%2fuploads%2f2013%2f11%2fcomputer-laptop.png&ehk=GBtBE3fo5fsbw6lTC9D4mX%2fXwJRRolFdXxhiHPufbSg%3d&risl=&pid=ImgRaw&r=0"
                }
                alt={order.item.device_name}
                className="w-20 h-20 object-cover rounded border border-gray-300"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-gilroyMedium text-gray-800 truncate">
                  {order.item.device_name}
                </h2>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {order.quantity}
                </p>
                <p className="text-sm text-gray-700 font-gilroySemiBold">
                  Price: ₹ {order.item.payable}
                </p>
                <p className="text-xs text-gray-400">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <button
                  className="text-sm font-gilroyMedium text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={() => router.push(`assets/${order.itemId}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Logic */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          className={`px-4 py-2 text-sm font-gilroyMedium border rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className={`px-4 py-2 text-sm font-gilroyMedium border rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewDeviceTable;
