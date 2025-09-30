"use client";
import React, { useState } from "react";
import QualityCheckModal from "./quality-check-modal";

const QualityCheck = ({ data }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className=" px-6 py-4 w-full border border-[#C3C3C34F] bg-white rounded-2xl  2xl:p-7 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className=" font-gilroySemiBold flex w-full items-center justify-between text-lg 2xl:text-xl">
            Quality Check
          </div>
        </div>

        {data?.qualityCheckDetails?.length > 0 ? (
          <div className="text-[#737373] font-gilroySemiBold text-sm 2xl:text-base">
            Check the Quality Check Report{" "}
            <span className="text-blue-500 cursor-pointer underline" onClick={handleOpenModal}>here</span>
          </div>
        ) : (
          <div className="text-[#737373] font-gilroySemiBold text-sm 2xl:text-base">
            No Quality Check Report
          </div>
        )}
      </div>

      {isModalOpen && (
        <QualityCheckModal
          qualityCheckDetails={data?.qualityCheckDetails}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default QualityCheck;
