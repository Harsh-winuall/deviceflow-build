import { CombinedContainer } from "@/components/container/container";
import { NewPage } from "./new-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
};

export default function People() {
  return (
    <CombinedContainer title="Assets">
      <NewPage />
    </CombinedContainer>
  );
}
