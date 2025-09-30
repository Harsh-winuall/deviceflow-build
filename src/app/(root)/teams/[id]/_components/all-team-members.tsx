"use client";

import { AltIntegration } from "@/app/(root)/integrations/_components/icons";
import AllIntegrationsDisplay from "@/app/(root)/integrations/_components/installed/all-integration-display";
import { buttonVariants } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { Table } from "@/components/wind/Table";
import type { User } from "@/server/userActions";
import { useRouter } from "next/navigation";
import React, { memo, useMemo, useCallback } from "react";
import { RemoveTeamMember } from "./remove-team-member";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import MoveTeamMember from "./move-team-member";

// Memoize the row component to prevent unnecessary re-renders
const MemoizedNameCell = memo(({ data }: { data: any }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/people/${data?._id}`);
  }, [router, data?._id]);

  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={handleClick}
    >
      <GetAvatar name={data?.first_name ?? ""} size={30} />
      <div className="relative group">
        <div className="font-gilroyMedium text-sm text-black truncate max-w-[150px]">
          {data?.first_name?.length! > 12
            ? `${data?.first_name!.slice(0, 12)}...`
            : data?.first_name}
        </div>
        <div className="absolute left-0 mt-1 hidden w-max max-w-xs p-2 bg-white text-black text-xs rounded shadow-lg border group-hover:block">
          {data?.first_name ?? "-"}
        </div>
      </div>
    </div>
  );
});

MemoizedNameCell.displayName = "MemoizedNameCell";

// Memoize the assets cell
const MemoizedAssetsCell = memo(({ user }: { user: User }) => {
  if (user?.devices && user?.devices?.length > 0) {
    return (
      <div className="text-[#6C6C6C]">{`${user?.devices?.length} ${
        user.devices.length > 1 ? "Assets" : "Asset"
      }`}</div>
    );
  }
  return <div>-</div>;
});

MemoizedAssetsCell.displayName = "MemoizedAssetsCell";

// Memoize the subscriptions cell
const MemoizedSubscriptionsCell = memo(({ record }: { record: User }) => {
  const integrations = useMemo(
    () => record?.subscriptions?.filter((p) => p.platform) ?? [],
    [record?.subscriptions]
  );

  if (integrations?.length === 0) {
    return <span className="text-gray-400">-</span>;
  }

  const firstThree = integrations?.slice(0, 3);
  const extraCount = integrations?.length - 3;

  return (
    <AllIntegrationsDisplay
      data={record}
      allIntegrations={integrations}
      isTeamBased
    >
      <div className="flex items-center gap-0">
        <div className="flex items-center gap-2 -space-x-5">
          {firstThree.map((i, index) => (
            <React.Fragment key={`${i.platform}-${index}`}>
              {i?.image ? (
                <div className="flex justify-center items-center p-1.5 bg-white rounded-full border">
                  <img
                    src={i.image ?? ""}
                    width={16}
                    height={16}
                    className=" object-contain "
                    alt="Integration"
                  />
                </div>
              ) : (
                <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-1.5">
                  <AltIntegration className={"size-4"} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        {extraCount > 0 && (
          <span className="text-sm text-gray-500 font-gilroySemiBold">
            +{extraCount}
          </span>
        )}
      </div>
    </AllIntegrationsDisplay>
  );
});

MemoizedSubscriptionsCell.displayName = "MemoizedSubscriptionsCell";

// Memoize the actions cell
const MemoizedActionsCell = memo(({ data }: { data: any }) => (
  <div className="flex justify-start items-center gap-5 2xl:gap-10 -ml-2">
    <RemoveTeamMember userData={data}>
      <HugeiconsIcon icon={Delete02Icon} size={22} className="text-[#656B70]" />
    </RemoveTeamMember>
    <MoveTeamMember userData={data}>
      <span
        className={buttonVariants({
          variant: "outlineTwo",
        })}
      >
        Move
      </span>
    </MoveTeamMember>
  </div>
));

MemoizedActionsCell.displayName = "MemoizedActionsCell";

const AllTeamMembersTable = ({
  data,
  status,
  selectedIds,
  setSelectedIds,
  handleSelectionChange,
}: {
  data: any[];
  status?: any;
  selectedIds?: any;
  setSelectedIds?: any;
  handleSelectionChange?: any;
}) => {
  // Memoize the columns to prevent recreation on every render
  const columns = useMemo(
    () => [
      {
        title: "Name",
        render: (data: any) => <MemoizedNameCell data={data} />,
      },
      {
        title: "Assets assigned",
        render: (user: User) => <MemoizedAssetsCell user={user} />,
      },
      {
        title: "Subscriptions",
        render: (record: User) => <MemoizedSubscriptionsCell record={record} />,
      },
      {
        title: "",
        render: (data: any) => <MemoizedActionsCell data={data} />,
      },
    ],
    []
  );

  // Memoize the checkbox selection config
  const checkboxSelection = useMemo(
    () => ({
      uniqueField: "_id" as const,
      onSelectionChange: handleSelectionChange,
    }),
    [handleSelectionChange]
  );

  // Early return for empty data
  if (!data || data.length === 0 || data === undefined) {
    return (
      <div className="flex justify-center items-center text-gray-500 p-4">
        <img
          src="/media/no_data/people.svg"
          alt="No-People Logo"
          className="size-[450px]"
        />
      </div>
    );
  }

  return (
    <div className="mx-5 h-[60dvh] hide-scrollbar rounded-[5px] border border-[#e5e5e5] overflow-auto ">
      <Table
        data={data ?? []}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isLoading={status === "pending"}
        checkboxSelection={checkboxSelection}
        columns={columns}
      />
    </div>
  );
};

AllTeamMembersTable.displayName = "AllTeamMembersTable";

export default memo(AllTeamMembersTable);
