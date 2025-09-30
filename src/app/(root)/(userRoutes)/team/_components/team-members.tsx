"use client";
import { SetStateAction, useEffect, useState } from "react";
import { getUsersByTeamId, User } from "@/server/userActions";
import { Table } from "@/components/wind/Table";
import Pagination from "@/app/(root)/teams/_components/pagination";
import { Icons } from "@/app/(root)/people/icons";
import { GetAvatar } from "@/components/get-avatar";

const TeamMembers = ({
  users,
  setUsers,
  id,
}: {
  users: User;
  setUsers: React.Dispatch<SetStateAction<User | null>>;
  id: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<User>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectionChange = (selected: string[]) => {
    setSelectedIds(selected);
  };

  useEffect(() => {
    const fetch = async () => {
      const res: User = await getUsersByTeamId(id, 1);
      setData(res);
    };
    fetch();
  }, []);

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      const res: User = await getUsersByTeamId(id, page);
      setData(res);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching Members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-[10px] flex flex-col"
      style={{ border: "1px solid #F6F6F6" }}
    >
      {!isLoading && data?.users?.length === 0 ? (
        <div className="flex flex-col gap-6 justify-center items-center py-8">
          <Icons.no_people_display />
        </div>
      ) : (
        <div className="flex flex-col overflow-auto">
          <div className="flex gap-3 p-3 items-center">
            <h2 className="text-lg pl-3 font-gilroySemiBold text-gray-800">
              Team Members
            </h2>

            <span className="bg-[#F9F5FF] font-gilroySemiBold text-[#6941C6] text-xs px-2 py-1 rounded-full">
              {data?.total
                ? `${data?.total} ${data?.total > 1 ? "Members" : "Member"}`
                : "N/A"}
            </span>
          </div>
          <>
            <div className="flex flex-col">
              <Table
                data={data?.users ?? []}
                selectedIds={selectedIds}
                isLoading={isLoading}
                setSelectedIds={setSelectedIds}
                columns={[
                  {
                    title: "Name",
                    render: (data) => (
                      <div
                        className="flex items-center gap-3"
                        // onClick={() => router.push(`/people/${data._id}`)}
                      >
                        {/* <img
                          src={
                            data?.image && data.image.length > 0
                              ? data?.image
                              : data?.gender === "Male"
                              ? "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012636473.png"
                              : "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012892650.png"
                          }
                          alt="Profile Image"
                          className="size-10 object-cover rounded-full"
                        /> */}
                        <GetAvatar name={data?.first_name ?? "Guest"} />
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
                  // {
                  //   title: "Joining Date",
                  //   render: (data: User) => {
                  //     const date = new Date(data?.onboarding_date!);
                  //     const formattedDate = date.toLocaleDateString("en-GB", {
                  //       day: "2-digit",
                  //       month: "short",
                  //       year: "numeric",
                  //     });
                  //     return <div>{formattedDate}</div>;
                  //   },
                  // },
                  // {
                  //   title: "Reporting Manager",
                  //   render: (data: User) => (
                  //     <div className="text-center">
                  //       {data?.reporting_manager?.first_name || "-"}
                  //     </div>
                  //   ),
                  // },
                  // {
                  //   title: "Assets assigned",
                  //   render: (user: User) =>
                  //     user?.devices && user?.devices?.length > 0 ? (
                  //       <div className="flex justify-center items-center w-fit px-3 rounded-lg bg-[#ECFDF3] text-[#027A48]">
                  //         {`${user?.devices?.length} Assigned`}
                  //       </div>
                  //     ) : (
                  //       <div>-</div>
                  //     ),
                  // },
                ]}
              />
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
