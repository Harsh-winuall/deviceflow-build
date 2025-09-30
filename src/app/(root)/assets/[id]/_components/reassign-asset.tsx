"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";

import { Button, LoadingButton } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { AsyncSelect } from "@/components/ui/async-select";
import { Device, updateDevice } from "@/server/deviceActions";
import { fetchUsers, User } from "@/server/userActions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ReassignAsset({
  children,
  deviceData,
}: {
  children: React.ReactNode;
  deviceData: Device;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  useEffect(() => {
    setError("");
    setUser({});
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?._id) {
      setError("User required");
      return;
    }

    setLoading(true);
    try {
      // @ts-ignore
      await updateDevice(deviceData?._id ?? "", { userId: user?._id });
      setOpen(false);
      toast.success(` ${deviceData?.custom_model} assigned to user !`);
      setLoading(false);
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["device-timeline"],
        refetchType: "all",
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-timeline"],
        refetchType: "all",
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
      // console.log(queryClient.getQueryCache().getAll());
    } catch (error) {
      toast.error("Failed to assign to user !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="w-fit">
        {children}
      </SheetTrigger>
      <SheetContent>
        <div className="flex justify-center w-full h-full items-start">
          <div className="flex flex-col w-[97%] gap-4 h-full justify-start items-center">
            <h1 className="font-gilroySemiBold w-full text-center text-xl ">
              Assign Asset
            </h1>

            <div className="h-[1px] bg-gray-200 w-full mb-1"></div>

            <div className=" w-full bg-[#f5f5f5]  rounded-md p-3 flex items-center gap-4 ">
              <img
                src={
                  deviceData?.image?.[0]?.url ??
                  "https://static.vecteezy.com/system/resources/thumbnails/012/807/215/small/silhouette-of-the-laptop-for-sign-icon-symbol-apps-website-pictogram-logo-art-illustration-or-graphic-design-element-format-png.png"
                }
                alt="device-image"
                className="w-16 h-16 p-1 object-contain border rounded-full "
              />
              <div className=" w-full flex flex-col justify-center ">
                <h1 className="text-black font-gilroySemiBold text-lg ">
                  {deviceData?.custom_model ?? "-"}
                </h1>

                <h1 className="text-[#7C7C7C] flex  items-center text-sm  font-gilroyMedium">
                  {deviceData?.ram ?? "RAM"} {deviceData?.storage ?? "Storage"}{" "}
                  {deviceData?.serial_no ?? "Serial number"}
                </h1>
                <p className="text-[#027A48] rounded-full w-fit bg-[#ECFDF3] text-xs  font-gilroyMedium flex justify-center items-center px-2 py-0.5">
                  Active
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-7 relative h-full"
            >
              <div className="flex flex-col gap-2 pt-3">
                <AsyncSelect<User>
                  fetcher={fetchUsers}
                  queryKey="fetch-users"
                  preload
                  fixInputClear={false}
                  renderOption={(user) => (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="font-gilroyMedium">
                          {user?.first_name}
                        </div>
                        <div className="text-xs font-gilroyRegular text-muted-foreground">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  )}
                  filterFn={(user, query) =>
                    user?.first_name
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase()) ||
                    user?.email?.toLowerCase()?.includes(query?.toLowerCase())
                  }
                  getOptionValue={(user) => user?.email}
                  getDisplayValue={() => (
                    <div className="flex items-center gap-2 text-left w-full">
                      <div className="flex flex-col leading-tight">
                        <div className="font-gilroyMedium">
                          {user?.email ?? ""}
                        </div>
                      </div>
                    </div>
                  )}
                  notFound={
                    <div className="py-6 text-center font-gilroyMedium text-sm">
                      No users found
                    </div>
                  }
                  label="User"
                  placeholder="Add Member"
                  value={user?.email || "null"}
                  onChange={(selected: User | null) =>
                    setUser({
                      _id: selected?._id,
                      first_name: selected?.first_name,
                      email: selected?.email,
                      employment_type: selected?.employment_type,
                      designation: selected?.designation,
                    })
                  }
                  width="100%"
                />
                {error.length > 0 && (
                  <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
                    {error}
                  </p>
                )}
              </div>

              {user?.first_name ? (
                <div className=" w-full bg-[#f5f5f5]  rounded-md p-2.5 flex items-center gap-4 ">
                  <GetAvatar name={user?.first_name ?? ""} size={56} />

                  <div className=" w-full flex flex-col justify-center ">
                    <h1 className="text-black font-gilroySemiBold text-base ">
                      {user?.first_name ?? ""}
                    </h1>
                    <h1 className="text-[#7C7C7C] font-gilroyMedium text-sm ">
                      {user?.email ?? ""}
                    </h1>

                    <h1 className="text-[#7C7C7C] flex  items-center text-sm  font-gilroyMedium">
                      {user?.employment_type ?? ""}
                      <span className="flex text-2xl mx-1 -mt-3"> </span>
                      {user?.designation ?? ""}
                    </h1>
                  </div>
                </div>
              ) : null}
              <div className="flex gap-2 absolute bottom-0 w-full mt-4">
                <Button
                  variant="outlineTwo"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <LoadingButton
                  variant="primary"
                  className="w-full"
                  type="submit"
                  disabled={loading}
                  loading={loading}
                >
                  Assign
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
