import { CombinedContainer } from "@/components/container/container";
import React from "react";
import dynamic from "next/dynamic";
import NotFound from "@/app/not-found";
import NewPage from "./new-page";
const TabDisplay = dynamic(() => import("./OrdersTabDisplay"), { ssr: false });

const OrdersPage = async () => {
  try {
    return (
      <CombinedContainer title="Orders">
        <NewPage />
        {/* <TabDisplay /> */}
      </CombinedContainer>
    );
  } catch (error) {
    return (
      <CombinedContainer title="Orders">
        <NotFound />
      </CombinedContainer>
    );
  }
};

export default OrdersPage;
