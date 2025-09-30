"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { ActionBar } from "@/components/action-bar/action-bar";
import { ActionSearchBar } from "@/components/action-bar/action-search-bar";
import { Button, buttonVariants } from "@/components/buttons/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";
import InvitePeople from "../people/[id]/_components/invite-people";
import DiscoverPage from "./discover/main";
import InstalledPage from "./installed/main";
import InvoicesMain from "./invoices/_components/invoices-main";
import CustomIntegration from "./_components/custom-integration";

function Main() {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "discover-integration",
  });
  return (
    <section className="w-full h-fit relative  overflow-y-auto hide-scrollbar">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="discover-integration"
        className="w-full"
      >
        <ActionBar>
          <div className="flex gap-2">
            <Select
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue="discover-integration"
            >
              <SelectTrigger className="w-fit font-gilroyMedium flex bg-white border border-[#DEDEDE] rounded-md">
                <SelectValue placeholder="People" />
              </SelectTrigger>
              <SelectContent className="font-gilroyMedium">
                <SelectItem
                  value="discover-integration"
                  className="w-full py-2.5 rounded-lg"
                >
                  Discover Integration
                </SelectItem>
                <SelectItem
                  value="installed-integration"
                  className="w-full py-2.5 rounded-lg"
                >
                  Installed Integration
                </SelectItem>
                <SelectItem
                  value="invoices"
                  className="w-full py-2.5 rounded-lg"
                >
                  Invoices
                </SelectItem>
              </SelectContent>
            </Select>
            <CustomIntegration>
              <Button
                className="rounded-md border border-[#DEDEDE]"
                variant="outlineTwo"
              >
                Add Custom Integration
              </Button>
            </CustomIntegration>
          </div>
        </ActionBar>
        <TabsContent value="discover-integration">
          {/* <TeamsMain teams={data} status={status} value="discover-integration" /> */}
          <DiscoverPage />
        </TabsContent>
        <TabsContent value="installed-integration">
          <InstalledPage />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoicesMain />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default Main;
