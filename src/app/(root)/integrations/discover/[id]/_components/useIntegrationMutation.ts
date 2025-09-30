import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseIntegrationMutationOptions<TParams> {
  mutationFn: (params: TParams) => Promise<any>;
  mutationKey: string[];
  setNextSteps?: (step: number) => void;
  setShowConnectModal?: (open: boolean) => void;
  showErrorToast?: boolean;
}

export function useIntegrationMutation<TParams>({
  mutationFn,
  mutationKey,
  setNextSteps,
  setShowConnectModal,
  showErrorToast = true,
}: UseIntegrationMutationOptions<TParams>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey,
    mutationFn,
    onMutate: () => {
      setShowConnectModal?.(true);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["get-integration-by-id"],
          exact: false,
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["fetch-people"],
          exact: false,
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["user-by-integrations", "all-data"],
          exact: true,
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["all-integrations", "discover"],
          exact: true,
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["all-integrations"],
          exact: false,
          refetchType: "all",
        }),
      ]);

      setNextSteps?.(1);
      setShowConnectModal?.(false);
    },
    onError: () => {
      setShowConnectModal?.(false);
      if (showErrorToast) {
        toast.error("Failed to integrate !");
      }
    },
  });
}
