"use client";
import { getDevicesByUserId } from "@/server/deviceActions";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../loading";
import Devices from "./devicesPage";

export const DeviceIssueEmployee = () => {
  const { data, status, isError } = useQuery({
    queryKey: ["get-devices-by-user-id"],
    queryFn: async () => {
      return getDevicesByUserId();
    },
  });

  return (
    <section className="w-full h-screen relative overflow-y-auto hide-scrollbar">
      {status === "pending" ? <Loading /> : <Devices devices={data} />}
      {isError && (
        <span className="font-gilroyMedium text-sm">
          Failed to fetch devices
        </span>
      )}
    </section>
  );
};
