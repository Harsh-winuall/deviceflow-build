import { CombinedContainer } from "@/components/container/container";
import { Metadata } from "next";
import { NewPageWorkflows } from "./new-page";

export const metadata: Metadata = {
  title: "Workflows",
};

export default function Workflows() {
  return (
    <CombinedContainer title="Workflows">
      <NewPageWorkflows />
    </CombinedContainer>
  );
}
