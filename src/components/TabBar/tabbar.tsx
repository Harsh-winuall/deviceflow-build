"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";

interface Tab {
  id?: string;
  label?: string;
  content?: React.ReactNode;
  number?: number | string;
}

interface TabBarProps {
  tabs?: Tab[];
  defaultActiveTab?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  status?: string;
  onTabChange?: (tabId: string) => void;
}

const TabBar = ({
  tabs,
  status,
  defaultActiveTab,
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  onTabChange,
}: TabBarProps) => {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  // const tabFromURL = searchParams.get("tab");
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: defaultActiveTab ?? "",
  });

  // useEffect(() => {
  //   const currentTab = tabFromURL || defaultActiveTab || tabs[0]?.id;
  //   if (!tabFromURL && currentTab) {
  //     // set tab param in URL if missing
  //     const params = new URLSearchParams(Array.from(searchParams.entries()));
  //     params.set("tab", currentTab);
  //     router.replace(`?${params.toString()}`, { scroll: false });
  //   }
  //   setActiveTab(currentTab);
  // }, [tabFromURL, defaultActiveTab, tabs]);

  const handleTabClick = (tabId: string) => {
    // const params = new URLSearchParams(Array.from(searchParams.entries()));
    // params.set("tab", tabId);
    // router.replace(`?${params.toString()}`, { scroll: false });
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className={className}>
      <div className="relative">
        <div className="flex border-b border-[rgba(0, 0, 0, 0.10)]">
          <div className="flex mx-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "px-2 mr-4 pt-2 flex items-center gap-2 font-gilroyMedium text-sm focus:outline-none",
                  "transition-colors duration-200",
                  tabClassName,
                  activeTab === tab.id
                    ? cn(
                        "text-black border-b-2 border-black -mb-[1px]",
                        activeTabClassName
                      )
                    : "text-[#808080]"
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
                {tab?.number ? (
                  <span className="bg-[#FF0000] -mt-1 p-2 text-white text-[9px] rounded-full size-4 flex justify-center items-center">
                    <span>{tab.number}</span>
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      {status === "pending" ? (
        <div className="h-[20vh] flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        tabs.some((tab) => tab.content) && (
          <div className="mt-4">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        )
      )}
    </div>
  );
};

export default TabBar;
