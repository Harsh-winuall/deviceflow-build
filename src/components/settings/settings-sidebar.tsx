import {
  Building03Icon,
  CreditCardIcon,
  Location04Icon,
  ShieldUserIcon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";
import OrgDetails from "./org-details";
import AdminAccess from "./admin-access";
import AssetLocations from "./asset-locations";
import { useQuery } from "@tanstack/react-query";
import { getCurrentOrg, Org } from "@/server/orgActions";
import UserProfileSettings from "./user-profile-setting";
import SubscriptionSection from "./subscription";
import DialogPlans from "./deviceflow-plans";
import ExtraSeatConfirmationDialog from "./extra-seat-dialog";
import PaymentReminderDialog from "./payment-reminder";

type SettingsSidebarProps = {
  selectItem: number;
  searchTerm: string;
  onSelect: (index: number) => void;
};

export const sideBarItems = ({ searchTerm }: { searchTerm?: string } = {}) => {
  const { data: OrgData } = useQuery<Org>({
    queryKey: ["get-org"],
    queryFn: () => getCurrentOrg(),
    refetchOnWindowFocus: false,
  });
  return [
    // {
    //   icons: User03Icon,
    //   label: "Profile",
    //   component: <UserProfileSettings OrgData={OrgData} />,
    // },
    {
      icons: Building03Icon,
      label: "Organisation",
      component: <OrgDetails OrgData={OrgData} />,
    },

    {
      icons: ShieldUserIcon,
      label: "Admin Access",
      component: <AdminAccess searchTerm={searchTerm} />,
    },
    {
      icons: Location04Icon,
      label: "Asset Locations",
      component: <AssetLocations />,
    },
    {
      icons: CreditCardIcon,
      label: "Subscription",
      component: <SubscriptionSection />,
    },
    // {
    //   icons: CreditCardIcon,
    //   label: "Pop ups hain",
    //   component: (
    //     <>
    //       <ExtraSeatConfirmationDialog>
    //         <p>Extra seat waala popup</p>
    //       </ExtraSeatConfirmationDialog>

    //       <PaymentReminderDialog>
    //         <p>Payment waala</p>
    //       </PaymentReminderDialog>
    //     </>
    //   ),
    // },
  ];
};

function SettingsSidebar({
  selectItem,
  onSelect,
  searchTerm,
}: SettingsSidebarProps) {
  const items = sideBarItems({ searchTerm });

  return (
    <>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="flex flex-col p-2 gap-3 min-w-[160px] max-w-[180px] border-r border-gray-200">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelect(index)}
              className={`${
                selectItem === index ? "bg-[#F6F6F6]" : ""
              } flex items-center gap-2 hover:bg-[#F6F6F6] p-2 w-full rounded-[5px] cursor-pointer`}
            >
              <HugeiconsIcon
                icon={item.icons}
                className="text-[#727272] size-4"
              />
              <h1 className="text-[13px] font-gilroyMedium text-black">
                {item.label}
              </h1>
            </div>
          ))}
        </div>

        {/* Right Section (scrollable) */}
        <div className="flex-1 overflow-y-auto px-5 pt-4">
          {items[selectItem]?.component}
        </div>
      </div>
    </>
  );
}

export default SettingsSidebar;
