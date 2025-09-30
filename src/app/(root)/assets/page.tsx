import { CombinedContainer } from "@/components/container/container";
import { Metadata } from "next";
import NewPage from "./new-page";

export const metadata: Metadata = {
  title: "Assets",
};

export default function Assets() {
  return (
    <CombinedContainer title="Assets">
      <NewPage />
    </CombinedContainer>
  );
}
