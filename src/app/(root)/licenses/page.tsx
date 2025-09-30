import React from "react";
import { License } from "./license";
import { CombinedContainer } from "@/components/container/container";

const Page = () => {
  return (
    <CombinedContainer title="Licenses">
      <License />
    </CombinedContainer>
  );
};

export default Page;
