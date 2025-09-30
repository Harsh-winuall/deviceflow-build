"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  exportIntegrationData,
  getConnectedIntegrations,
  getCustomCategories,
} from "@/server/integrationActions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InstalledSection } from "../_components/installed/installed-section";
import { TotalSpends } from "../_components/total-spends";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { ActionBar } from "@/components/action-bar/action-bar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomIntegration from "../_components/custom-integration";
import { Button } from "@/components/ui/button";
import DiscoverPage from "../discover/main";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  Calendar03Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/buttons/Button";
import { FilterDateDialog } from "../_components/installed/filter-date-dialog";
import { toast } from "sonner";

export default function InstalledPage() {
  const pathName = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "all-integrations",
  });
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // console.log(category);

  const { data, status } = useQuery({
    queryKey: [
      "connected-integrations",
      activeTab,
      billingCycle,
      category,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getConnectedIntegrations(
        billingCycle,
        activeTab,
        category,
        startDate,
        endDate
      ),
  });

  const exportMutation = useMutation({
    mutationFn: ({
      billingCycle,
      activeTab,
      category,
      format,
    }: {
      billingCycle?: string;
      activeTab?: string;
      category?: string;
      format: "csv" | "xlsx";
    }) => exportIntegrationData(billingCycle, activeTab, category, format),
  });

  const { data: customCategories, status: categoryStatus } = useQuery({
    queryKey: ["custom-categories"],
    queryFn: () => getCustomCategories(),
  });

  // handle changes coming from FilterDateDialog
  const onDatesChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);

    // console.log("Updated Dates =>", { start, end });
  };

  // console.log("Custom Categories : ", customCategories);

  const handleExport = (fileFormat: "csv" | "xlsx" | "zip") => {
    exportMutation.mutate(
      {
        billingCycle,
        activeTab,
        category,
        format: fileFormat,
      },
      {
        onSuccess: (response) => {
          try {
            const url = response?.link;
            if (!url) {
              throw new Error("No download link provided");
            }

            const a = document.createElement("a");
            a.href = url;
            a.download = `export-${activeTab}-${
              new Date().toISOString().split("T")[0]
            }.${fileFormat}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Data downloaded successfully !");
          } catch (err) {
            console.error("Export failed:", err);
          }
        },
        onError: (err) => {
          console.error("Export failed", err);
          toast.error("Failed to export data !");
        },
      }
    );
  };

  return (
    <>
      {status === "pending" ? (
        <InstalledSkeleton />
      ) : (
        <div className="flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="all-integrations"
            className="w-full"
          >
            <ActionBar>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <Select
                    value={activeTab}
                    onValueChange={setActiveTab}
                    defaultValue="all-integrations"
                  >
                    <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-md">
                      <SelectValue placeholder="People" />
                    </SelectTrigger>
                    <SelectContent className="font-gilroyMedium">
                      <SelectItem
                        value="all-integrations"
                        className="w-full py-2.5 rounded-lg"
                      >
                        All Integrations
                      </SelectItem>
                      <SelectItem
                        value="custom-integration"
                        className="w-full py-2.5 rounded-lg"
                      >
                        Custom Integration
                      </SelectItem>
                      <SelectItem
                        value="featured-integrations"
                        className="w-full py-2.5 rounded-lg"
                      >
                        Featured Integrations
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* For Billing Cycle */}

                  {/* <Select
                    value={billingCycle}
                    onValueChange={setBillingCycle}
                    defaultValue="monthly"
                  >
                    <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-md">
                      <SelectValue placeholder="Billing Cycle" />
                    </SelectTrigger>
                    <SelectContent className="font-gilroyMedium">
                      <SelectItem value="one-time">One Time</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quaterly">Quarterly</SelectItem>
                      <SelectItem value="half-yearly">Half Yearly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select> */}

                  <Select
                    value={category}
                    onValueChange={setCategory}
                    defaultValue=""
                  >
                    <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-md">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="font-gilroyMedium">
                      <SelectItem value="All">All Categories</SelectItem>
                      {customCategories?.map((category, index) => (
                        <SelectItem key={index} value={category?._id}>
                          {category?.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FilterDateDialog
                    startDate={startDate}
                    endDate={endDate}
                    onDatesChange={onDatesChange}
                  >
                    <div
                      className={`border relative border-[#E5E5E5] rounded-[5px] flex gap-3 px-4 py-[19px] items-center flex-nowrap ${buttonVariants(
                        {
                          variant: "outlineTwo",
                        }
                      )}`}
                    >
                      <span className="text-sm font-gilroyMedium text-nowrap">
                        Filter Date
                      </span>
                      <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                      {(startDate || endDate) && (
                        <div className="absolute p-0.5 bg-red-100 rounded-full -top-0.5 -right-0.5">
                          <div className="size-1.5 rounded-full bg-red-500 " />
                        </div>
                      )}
                    </div>
                  </FilterDateDialog>
                </div>

                <div className="flex gap-2 items-center">
                  <Select
                    onValueChange={(value) => {
                      if (value === "csv" || value === "xlsx") {
                        handleExport(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-md">
                      <SelectValue placeholder="Export" />
                    </SelectTrigger>
                    <SelectContent className="font-gilroyMedium pb-2">
                      <SelectItem value="csv">
                        <p className="flex gap-2 items-center">
                          <HugeiconsIcon icon={File01Icon} className="size-4" />{" "}
                          <span>CSV (.csv)</span>
                        </p>
                      </SelectItem>
                      <SelectItem value="xlsx">
                        <p className="flex gap-2 items-center">
                          <HugeiconsIcon
                            icon={Analytics01Icon}
                            className="size-4"
                          />
                          <span>Excel (.xls)</span>
                        </p>
                      </SelectItem>

                      <span className="bg-[#F7F7F7] rounded-[3px] px-3 py-1 text-xs font-gilroyMedium text-[#AEAEAE] mt-1 mx-1">
                        Export includes current filters
                      </span>
                    </SelectContent>
                  </Select>

                  <Button
                    className="rounded-md border border-[#DEDEDE]"
                    variant="default"
                    onClick={() => {
                      router.push("/integrations/discover");
                    }}
                  >
                    Explore More
                  </Button>
                </div>
              </div>
            </ActionBar>
            <TabsContent value="custom-integration">
              <section className="w-full h-[90vh] relative p-5 bg-white rounded-md border overflow-y-auto hide-scrollbar flex flex-col gap-2">
                <InstalledSection
                  data={data}
                  status={status}
                  startDate={startDate}
                />
              </section>
            </TabsContent>
            <TabsContent value="all-integrations">
              <section className="w-full h-[90vh] relative p-5 bg-white rounded-md border overflow-y-auto hide-scrollbar flex flex-col gap-2">
                <InstalledSection
                  data={data}
                  status={status}
                  startDate={startDate}
                />
              </section>
            </TabsContent>
            <TabsContent value="featured-integrations">
              <section className="w-full h-[90vh] relative p-5 bg-white rounded-md border overflow-y-auto hide-scrollbar flex flex-col gap-2">
                <InstalledSection
                  data={data}
                  status={status}
                  startDate={startDate}
                />
              </section>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}

const InstalledSkeleton = () => (
  <section className="w-full h-fit relative p-5 bg-white rounded-md border overflow-y-auto hide-scrollbar">
    <div className="rounded-md border p-3 flex justify-between w-full mb-3.5">
      <div className="flex flex-col justify-start gap-y-5 pt-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="flex justify-end gap-3 flex-none w-[76%]">
        <Skeleton className="max-w-52 w-full h-32" />
        <Skeleton className="max-w-52 w-full h-32" />
        <Skeleton className="max-w-52 w-full h-32" />
        <Skeleton className="max-w-52 w-full h-32" />
      </div>
    </div>

    <div className="flex flex-col gap-5 w-full h-[60vh]">
      <section className="flex justify-between h-full">
        <div className="flex flex-col gap-6 py-4 pl-8 ml-5 h-full overflow-y-auto hide-scrollbar w-full">
          <section className="w-full flex flex-col items-start gap-3">
            <Skeleton className="h-6 w-24" />
            <div className="flex flex-wrap gap-3 xl:grid xl:justify-items-center xl:gap-5 xl:grid-cols-3 w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 max-w-[18rem] w-full" />
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  </section>
);
