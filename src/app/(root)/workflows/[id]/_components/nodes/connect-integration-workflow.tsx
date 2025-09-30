import { ConnectIntegration } from "@/app/(root)/integrations/_components/connect-integration";
import MappingDialogOne from "@/app/(root)/integrations/_components/installed/mapping-dialog-one";
import MappingDialogTwo from "@/app/(root)/integrations/discover/[id]/_components/mapping-dialog-two";
import { useIntegrationMutation } from "@/app/(root)/integrations/discover/[id]/_components/useIntegrationMutation";
import {
  connectGsuiteIntegration,
  connectIntegration,
  getIntegrationById,
} from "@/server/integrationActions";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

type Props = {
  data: any;
  showConnectModal: boolean;
  setShowConnectModal: (open: boolean) => void;
};

function ConnectIntegrationFlow({
  data,
  showConnectModal,
  setShowConnectModal,
}: Props) {
  const [nextSteps, setNextSteps] = useState(0);
  const { data: IntegrationData, status } = useQuery({
    queryKey: ["get-integration-by-id", data?.integrationId],
    queryFn: () => getIntegrationById({ id: data?.integrationId }),
  });

  const mutation = useIntegrationMutation({
    mutationFn: ({ payload }) => connectIntegration({ payload }),
    mutationKey: ["add-integration-response"],
    setNextSteps,
    setShowConnectModal,
  });

  const gSuiteMutation = useIntegrationMutation({
    mutationFn: ({ id }) => connectGsuiteIntegration({ id }),
    mutationKey: ["gsuite-integration-response"],
    setNextSteps,
    setShowConnectModal,
  });

  const isGsuite = IntegrationData?.platform?.toLowerCase().includes("suite");

  return (
    <>
      <ConnectIntegration
        integrationData={IntegrationData}
        mutation={mutation}
        open={showConnectModal}
        setOpen={setShowConnectModal}
        gSuiteMutation={gSuiteMutation}
        loading={
          isGsuite
            ? gSuiteMutation.status === "pending"
            : mutation.status === "pending"
        }
      />
      <MappingDialogOne
        urlAddress={`/workflows/${data?.workflowId}`}
        open={nextSteps === 1}
        _id={data?.workflowId}
        response={gSuiteMutation.data || mutation.data}
        platform={IntegrationData?.platform}
        setNextSteps={setNextSteps}
      />
      <MappingDialogTwo
        // workflowId={data?.workflowId}
        urlAddress={`/workflows/${data?.workflowId}`}
        open={nextSteps === 2}
        _id={data?.workflowId}
        response={gSuiteMutation.data || mutation.data}
        platform={IntegrationData?.platform}
        setNextSteps={setNextSteps}
      />
    </>
  );
}

export default ConnectIntegrationFlow;
