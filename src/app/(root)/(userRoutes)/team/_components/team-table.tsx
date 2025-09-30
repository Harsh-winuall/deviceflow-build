"use client";
import { Table } from "@/components/wind/Table";
import { User } from "@/server/userActions";
import { useState } from "react";
import Pagination from "@/app/(root)/teams/_components/pagination";

const ITEMS_PER_PAGE = 6;
export default function TeamTable({ data }: { data: User[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalTeams = data?.length || 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeams = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <>
      <div className="flex flex-col">
        <Table
          data={currentTeams}
          isLoading={false}
          checkboxSelection={{
            uniqueField: "_id",
            //logic yet to be done
            onSelectionChange: (e) => console.log(e),
          }}
          columns={[
            {
              title: "Name",
              render: (data) => (
                <div
                  className="flex items-center gap-3"
                  // onClick={() => router.push(`/people/${data._id}`)}
                >
                  <img
                    src={
                      data?.image ||
                      "https://d22e6o9mp4t2lx.cloudfront.net/cms/pfp3_d7855f9562.webp"
                    } // Default image if no profile_image exists
                    alt={`${data?.first_name || "User"}'s Profile`}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                  <span>{data?.first_name || "N/A"}</span>
                </div>
              ),
            },
            { title: "Email", dataIndex: "email" },
            {
              title: "Role",
              render: (data: User) => (
                <div className="truncate max-w-[150px]">
                  {data?.designation || "N/A"}
                </div>
              ),
            },
            {
              title: "Joining Date",
              render: (data: User) => {
                const date = new Date(data?.onboarding_date!);
                const formattedDate = date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                return <div>{formattedDate}</div>;
              },
            },
            {
              title: "Reporting Manager",
              render: (data: User) => (
                <div className="text-center">
                  {data?.reporting_manager?.first_name || "-"}
                </div>
              ),
            },
            {
              title: "Assets assigned",
              render: (data: User) => (
                <div className="text-center w-fit px-2 font-gilroySemiBold rounded-lg bg-[#ECFDF3] text-[#027A48]">
                  {data?.devices!?.length > 0
                    ? `${data?.devices!.length} Assigned`
                    : "N/A"}
                </div>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
