import { CombinedContainer } from "@/components/container/container";
import { Metadata } from "next";
import { DeviceIssueEmployee } from "./_components/new-device-container";

export const metadata: Metadata = {
  title: "Devices",
};

export default function Devices() {
  return (
    <CombinedContainer title="Assets">
      <DeviceIssueEmployee />
    </CombinedContainer>
  );
}
