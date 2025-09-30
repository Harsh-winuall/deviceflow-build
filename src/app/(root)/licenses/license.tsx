"use client";
import { ActionBar } from "@/components/action-bar/action-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getAllLicenses } from "@/server/licenseActions";
import { useQuery } from "@tanstack/react-query";
import CreateDeviceDialog from "../assets/_components/addDevices/_components/add-device-form";
import AssignedLicenses from "./assignedLicense";

export const License = () => {
  const { data, status } = useQuery({
    queryKey: ["licenses"],
    queryFn: () => getAllLicenses(),
  });
  return (
    <section className="w-full h-fit relative  overflow-hidden">
      <Tabs
        value="active-licenses"
        defaultValue="active-licenses"
        className="w-full"
        key={`licenses-action-bar`}
      >
        <ActionBar showBackBtn={true} key={`licenses-action-bar`}>
          <div className="flex gap-2 justify-end w-full">
            <div>
              <CreateDeviceDialog licenseDeviceType={true}>
                <button
                  className={buttonVariants({
                    variant: "primary",
                    className: "w-fit",
                  })}
                >
                  Add License
                </button>
              </CreateDeviceDialog>
            </div>
          </div>
        </ActionBar>
        <TabsContent value="active-licenses" key={"active-licenses"}>
          <div>
            <AssignedLicenses data={data} status={status} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};
