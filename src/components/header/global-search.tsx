import Link from "next/link";
import React from "react";
import { GetAvatar } from "../get-avatar";
import { formatDate } from "@/lib/utils";

const categories = [
  { key: "users", label: "People", route: "people" },
  { key: "teams", label: "Teams", route: "teams" },
  { key: "devices", label: "Assets", route: "assets" },
  { key: "issues", label: "Tickets", route: "tickets" },
  { key: "integrations", label: "Integrations", route: "integrations" },
];

const categoryMap = Object.fromEntries(categories.map((c) => [c.key, c]));

interface GlobalSearchProps {
  data: Record<string, any[]>;
  onClose: () => void;
}

const getFullName = (item: any) =>
  `${item?.first_name ?? ""} ${item?.last_name ?? ""}`.trim();

const generateHref = (key: string, item: any) =>
  key === "integrations"
    ? `/integrations/installed/${item?.platform}`
    : `/${categoryMap[key]?.route}/${item?._id}`;

const UserItem = ({ item }: { item: any }) => (
  <div className="flex items-center text-sm gap-2 font-gilroyMedium">
    <GetAvatar name={getFullName(item)} />
    <div className="flex flex-col">
      <span className="font-gilroySemiBold">{getFullName(item)}</span>
      <div className="text-xs font-gilroyMedium text-gray-700">
        {item?.email}
      </div>
    </div>
  </div>
);

const TeamItem = ({ item }: { item: any }) => {
  const title =
    item?.title?.charAt(0).toUpperCase() + item?.title?.slice(1) || "Untitled";
  const description =
    item?.description?.charAt(0).toUpperCase() + item?.description?.slice(1);

  return (
    <div className="flex items-center gap-3 text-sm font-gilroyMedium">
      <GetAvatar name={item?.title} />

      <div>
        <h1 className="font-gilroySemiBold">{title}</h1>
        <p className="text-xs text-gray-700 font-gilroyMedium">
          {description ? `${description} | ` : ""}
          {item?.team_code}
        </p>
      </div>
    </div>
  );
};

const DeviceItem = ({ item }: { item: any }) => (
  <div className="flex items-center text-sm gap-2 font-gilroyMedium">
    <div className="bg-gray-100 rounded-full py-3 px-2">
      <img
        src={
          "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
        }
        alt={`Logo of ${item?.custom_model}`}
        className="w-7 h-5 "
      />
    </div>
    <div className="flex flex-col">
      <h1 className="font-gilroySemiBold">{item?.custom_model}</h1>
      <p className="text-xs font-gilroyMedium text-gray-700">
        {item?.brand} | Assigned to:{" "}
        {item?.User_assigned?.trim() || "Unassigned"}{" "}
        {item?.issues?.length > 0 && <> | Issues: {item?.issues?.length}</>}
      </p>
    </div>
  </div>
);
const IntegrationItem = ({ item }: { item: any }) => (
  <div className="flex items-center gap-2 text-sm font-gilroyMedium">
    {item?.availableIntegrationInfo?.companyLogo ? (
      <img
        src={item.availableIntegrationInfo.companyLogo}
        alt={`Logo of ${item.platform}`}
        className="size-4"
      />
    ) : (
      <GetAvatar name={item.platform} />
    )}
    <span className="font-gilroySemiBold text-sm">{item.platform}</span>
  </div>
);

const IssueItem = ({ item }: { item: any }) => {
  return (
    <div className="flex items-start gap-3 text-sm font-gilroyMedium">
      <GetAvatar name={item?.category} />

      <div>
        <div className="font-gilroySemiBold">
          {item?.category}{" "}
          <span className="text-xs font-gilroyMedium text-gray-700">
            ({item?.code})
          </span>
        </div>
        <div className="text-xs text-gray-700 font-gilroyMedium">
          Raised on: {formatDate(item.openedOn)} | Opened By :
          {item.openedByFirstName}
        </div>
      </div>
    </div>
  );
};

export default function GlobalSearch({ data, onClose }: GlobalSearchProps) {
  const entries = Object?.entries(data || {}) as [string, any[]][];

  const nonEmpty = entries?.filter(([, items]) => items.length > 0);

  if (nonEmpty.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data found</div>;
  }

  return (
    <div className="p-3">
      {nonEmpty?.map(([key, items], idx) => {
        const { label } = categoryMap[key] || {};
        if (!label) return null;

        return (
          <React.Fragment key={key}>
            <div className="font-gilroySemiBold mb-2">{label}</div>
            <div className="space-y-1">
              {items?.map((item) => (
                <Link
                  key={item?._id}
                  href={generateHref(key, item)}
                  className="block p-2 hover:bg-gray-50 rounded-md"
                  onClick={onClose}
                >
                  {
                    {
                      users: <UserItem item={item} />,
                      teams: <TeamItem item={item} />,
                      devices: <DeviceItem item={item} />,
                      integrations: <IntegrationItem item={item} />,
                      issues: <IssueItem item={item} />,
                    }[key]
                  }
                </Link>
              ))}
            </div>
            {idx < nonEmpty.length - 1 && (
              <div className="h-[1px] bg-gray-200 my-4" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
