"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPreviousOrders } from "@/server/orderActions";
import { useQueryState } from "nuqs";
import AllOrdersTable from "./_components/AllOrdersTable";

function NewPage() {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "orders",
  });

  const [searchTerm, setSearchTerm] = useQueryState("searchQuery");
  const actualSearchTerm = useDeferredValue(searchTerm);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["fetch-orders"],
    queryFn: async () => {
      return getPreviousOrders();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="w-full h-fit relative  overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex gap-4 sticky top-0 z-50 items-center justify-between p-3 rounded-[10px] border border-[#0000001A] bg-white">
          <div className="flex gap-2">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-lg">
                <SelectValue placeholder="People" />
              </SelectTrigger>
              <SelectContent className="font-gilroyMedium">
                <SelectItem value="orders" className="w-full py-2.5 rounded-lg">
                  My Orders
                </SelectItem>
              </SelectContent>
            </Select>
            <></>
          </div>
          <div className="flex gap-2">
            {/* <div className="flex items-center border border-[rgba(0,0,0,0.2)] rounded-lg px-2 py-2 h-full">
              <div className="flex gap-2 justify-center items-center h-full">
                <Search className=" size-[1.16rem]" />
                <input
                  type="text"
                  value={searchTerm || ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Orders..."
                  className={`flex-grow h-full bg-transparent outline-none text-black placeholder-black placeholder:font-gilroyMedium placeholder:text-[15px] transition-all duration-1000 `}
                />
              </div>
            </div> */}
          </div>
        </div>
        <TabsContent value="orders">
          <AllOrdersTable data={data} />{" "}
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default NewPage;
