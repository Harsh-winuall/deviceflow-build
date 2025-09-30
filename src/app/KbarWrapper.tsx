"use client"; // Ensure this is a client-side component
import { Icons } from "@/components/icons";
import KBarIcons from "@/icons/KBarIcons";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from "kbar";
import {
  FileText,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Store,
  TriangleAlert,
  UserRound,
} from "lucide-react";

const EmpActions = [
  {
    id: "home",
    name: "Home",
    shortcut: ["H"],
    keywords: "home homepage",
    logo: <LayoutDashboard className="text-[#6C6C6C] size-5 mb-0.5" />,
    perform: () => (window.location.pathname = "/"),
  },
  {
    id: "profile",
    name: "Profile",
    shortcut: ["P"],
    keywords: "profile",
    logo: <UserRound className="text-[#6C6C6C] size-5 mb-0.5" />,
    perform: () => (window.location.pathname = "/profile"),
  },
  {
    id: "devices",
    name: "Devices",
    shortcut: ["D"],
    keywords: "devices",
    logo: <KBarIcons.assets_icon className="text-[#6C6C6C] size-5 mb-0.5" />,
    perform: () => (window.location.pathname = "/devices"),
  },
  {
    id: "teams",
    name: "Teams",
    shortcut: ["T"],
    keywords: "teams",
    perform: () => (window.location.pathname = "/teams"),
    logo: <KBarIcons.team_icon className="text-[#6C6C6C] size-[22px] mb-0.5" />,
  },
];

const adminActions = [
  {
    id: "dashboard",
    name: "Home",
    shortcut: ["H"],
    logo: <LayoutDashboard className="text-[#6C6C6C] size-5 mb-0.5" />,
    keywords: "home homepage dashboard",
    perform: () => (window.location.pathname = "/"),
  },
  {
    id: "reports",
    name: "Reports",
    shortcut: ["R"],
    logo: <FileText className="text-[#6C6C6C] size-5 mb-0.5" />,
    keywords: "reports",
    perform: () => (window.location.pathname = "/reports"),
  },
  {
    id: "orders",
    name: "Orders",
    logo: <Package className="text-[#6C6C6C] size-5" />,
    shortcut: ["W"],
    keywords: "reports",
    perform: () => (window.location.pathname = "/orders"),
  },
  {
    id: "people",
    name: "People",
    logo: <KBarIcons.people_icon className="text-[#6C6C6C] size-6 mb-0.5" />,
    shortcut: ["P"],
    keywords: "people",
    perform: () => (window.location.pathname = "/people"),
  },
  {
    id: "assets",
    name: "Assets",
    shortcut: ["A"],
    logo: <KBarIcons.assets_icon className="text-[#6C6C6C] size-5 mb-0.5" />,
    keywords: "assets",
    perform: () => (window.location.pathname = "/assets"),
  },
  {
    id: "teams",
    name: "Teams",
    shortcut: ["T"],
    logo: <Icons.team_icon className="text-[#6C6C6C] size-[22px] mb-0.5" />,
    keywords: "teams",
    perform: () => (window.location.pathname = "/teams"),
  },
  {
    id: "store",
    name: "Store",
    shortcut: ["S"],
    logo: <Store className="text-[#6C6C6C] size-[18px] mb-0.5" />,
    keywords: "store",
    perform: () => (window.location.pathname = "/store"),
  },
  {
    id: "issues",
    name: "Issues",
    logo: <TriangleAlert className="text-[#6C6C6C] size-5 mb-0.5" />,
    shortcut: ["I"],
    keywords: "issues",
    perform: () => (window.location.pathname = "/issues"),
  },
  {
    id: "settings",
    name: "Settings",
    logo: <Settings className="text-[#6C6C6C] size-5 mb-0.5" />,
    shortcut: ["X"],
    keywords: "settings",
    perform: () => (window.location.pathname = "/settings"),
  },
];

// Custom component to render the results inside the command bar
function RenderResults() {
  const { results } = useMatches();
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="text-gray-500 px-4 py-2">{item}</div>
        ) : (
          <div
            className={`px-3 flex justify-between items-center py-2 rounded-md cursor-pointer hover:bg-[#f5f5f5] ${"bg-white text-black"}`}
          >
            <div className="flex gap-[10px] items-center">
              <div>{item?.logo}</div>
              <div className="text-base font-gilroyMedium">{item?.name}</div>
            </div>

            <div className="flex size-6 rounded-[5px] bg-white border-[1.5px] border-[#E4E4E4] text-[#6C6C6C] justify-center items-center">
              <div>{item?.shortcut}</div>
            </div>
          </div>
        )
      }
    />
  );
}

export default function KbarWrapper({
  userRole,
}: {
  userRole: number | undefined;
}) {
  return (
    <KBarProvider actions={userRole === 1 ? EmpActions : adminActions}>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <KBarAnimator className="w-full max-w-lg min-h-fit bg-white rounded-[14px] px-3 shadow-xl space-y-4 pb-3 overflow-hidden">
            <div className="flex gap-2 justify-between items-center py-3 px-3">
              <div className="flex gap-2 items-center">
                <Search className="text-[#B9B9B9]" />
                <KBarSearch
                  defaultPlaceholder="Search"
                  className="w-full border-none border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <KBarIcons.kbar_icon />
            </div>

            <div className="h-[1px] w-[200%] bg-[#E8E8E8] mb-2 -ml-10"></div>
            {/* Rendering all actions */}

            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  );
}
