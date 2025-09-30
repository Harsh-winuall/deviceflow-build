import { CombinedContainer } from "@/components/container/container";
import React, { Suspense } from "react";
import DetailsContainer from "./_components/detailsContainer";
import Spinner from "@/components/Spinner";
import DeviceFlowLoader from "@/components/deviceFlowLoader";

const OrderDetail = ({ params }: { params: { id: string } }) => {
  return (
    <CombinedContainer title="Order Details">
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-full h-[500px]">
            <DeviceFlowLoader />
          </div>
        }
      >
        <DetailsContainer orderId={params.id} />
      </Suspense>
    </CombinedContainer>
  );
};

export default OrderDetail;
