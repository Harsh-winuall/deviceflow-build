import { CombinedContainer } from "@/components/container/container";
import { NewPageTeams } from "./new-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams",
};

export default function Teams() {
  return (
    <CombinedContainer title="Teams" description="Manage your teams">
      <NewPageTeams />
    </CombinedContainer>
  );
}
