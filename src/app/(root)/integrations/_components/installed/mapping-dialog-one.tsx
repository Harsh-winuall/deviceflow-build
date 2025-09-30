"use client";
import { Button, LoadingButton } from "@/components/buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AddIntegrationRes } from "@/server/integrationActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { updateWorkflow } from "@/server/workflowActions/workflow";
import { useChangeWorkflowStatus } from "@/app/(root)/workflows/[id]/_components/hooks/use-change-workflow-status";

export default function MappingDialogOne({
  children,
  urlAddress,
  open,
  setOpen,
  response,
  setNextSteps,
  platform,
  _id,
}: {
  _id?: string;
  platform?: string;
  urlAddress?: string;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setNextSteps?: React.Dispatch<React.SetStateAction<number>>;
  response?: any;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { updateMutation } = useChangeWorkflowStatus(_id ?? "");


  const descriptionDetails = [
    "Deactivating unused licenses will revoke access for the associated users.",

    "I have read and agree to the Terms & Conditions.",
  ];

  const active = useMemo(() => {
    return response
      ? response?.data?.data.filter((u) => u.userId !== null).length
      : 0;
  }, [response]);

  const inActive = useMemo(() => {
    return response
      ? response?.data?.data.filter((u) => u.userId === null).length
      : 0;
  }, [response]);

  const handleSkipClick = async () => {
    setLoading(true);
    await queryClient.invalidateQueries({
      queryKey: ["get-integration-by-id"],
      exact: false,
      refetchType: "all",
    });
    await queryClient.invalidateQueries({
      queryKey: ["workflow-by-id"],
      exact: false,
    });
    await queryClient.invalidateQueries({
      queryKey: ["fetch-people"],
      exact: false,
      refetchType: "all",
    });
    await queryClient.invalidateQueries({
      queryKey: ["user-by-integrations", "all-data"],
      exact: true,
      refetchType: "all",
    });
    await queryClient.invalidateQueries({
      queryKey: ["all-integrations", "discover"],
      exact: true,
      refetchType: "all",
    });
    await queryClient.invalidateQueries({
      queryKey: ["all-integrations"],
      exact: false,
      refetchType: "all",
    });
    queryClient.removeQueries({ queryKey: ["add-integration-response"] });
    queryClient.removeQueries({ queryKey: ["gsuite-integration-response"] });
    setNextSteps(0);
    setLoading(false);

    router.replace(
      urlAddress ? urlAddress : `/integrations/installed/${platform}`,
      {
        scroll: false,
      }
    );

    if (_id) {
      updateMutation.mutate({ allNodesIntegrated: false });
    }

    toast.success("Integration successfull !");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setNextSteps(0)}>
        <DialogTrigger onClick={(e) => e.stopPropagation()}>
          {children}
        </DialogTrigger>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onInteractOutside={(e) => e.preventDefault()}
          className="rounded-2xl bg-white p-6 shadow-lg max-w-[32rem] w-full text-center"
        >
          <DialogTitle className="text-lg font-gilroySemiBold -my-2">
            Found
          </DialogTitle>
          <DialogDescription className="sr-only">
            Mapping dialog one
          </DialogDescription>
          {/* <pre> {JSON.stringify(response, null, 2)}</pre> */}

          <div className="flex gap-1 text-[#2E8016] items-center justify-center -my-1">
            <span className="text-4xl font-gilroyBold">
              {active === undefined ? (
                <Skeleton className="w-20 h-16" />
              ) : (
                <>{active === 1 ? `${active} User` : `${active} Users`}</>
              )}
            </span>
          </div>
          <p className="text-[#7f7f7f] text-sm font-gilroyMedium -my-2">
            All the members are successfully imported from {platform}.
          </p>
          {/* {JSON.stringify(response)} */}

          <div className="h-[1px] bg-gray-200 my-2 -mx-6"></div>
          <h1 className="text-center text-base font-gilroySemiBold -mt-2">
            Deviceflow has found{" "}
          </h1>
          <div className="bg-neutral-100 rounded-xl flex justify-start gap-2 items-center p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="21"
              viewBox="0 0 23 21"
              fill="none"
            >
              <path
                d="M5.84764 8.80554C8.06018 5.24642 9.16644 3.46685 10.6845 3.00877C11.5196 2.75676 12.4192 2.75676 13.2543 3.00877C14.7724 3.46685 15.8786 5.24642 18.0912 8.80554C20.3037 12.3646 21.41 14.1442 21.0781 15.5942C20.8955 16.392 20.4457 17.1155 19.7932 17.6612C18.607 18.6531 16.3945 18.6531 11.9694 18.6531C7.54433 18.6531 5.33179 18.6531 4.14562 17.6612C3.49306 17.1155 3.04326 16.392 2.86069 15.5942C2.52883 14.1442 3.6351 12.3646 5.84764 8.80554Z"
                stroke="#DC060D"
                strokeWidth="1.12756"
              />
              <path
                d="M11.9629 14.0698H11.9716"
                stroke="#DC060D"
                strokeWidth="1.50342"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9697 11.5698V8.23645"
                stroke="#DC060D"
                strokeWidth="1.12756"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-[#DC060D] text-base font-gilroyMedium">
              {active === undefined ? (
                <Skeleton className="w-40 h-7" />
              ) : (
                <>
                  {" "}
                  {inActive === 1
                    ? `${inActive} Unmapped user`
                    : `${inActive} Unmapped users`}
                </>
              )}
            </h1>
          </div>
          <h1 className="text-sm font-gilroyMedium text-left">
            {inActive === 1 ? `${inActive} user is ` : `${inActive} users are `}
            currently unmapped. They will be saved as guest users by default, or
            you can map them to existing members.
          </h1>
          <h1 className="text-base font-gilroySemiBold text-start ">
            By proceeding, I acknowledge that:{" "}
          </h1>
          <div className="flex flex-col gap-1 text-start ">
            {descriptionDetails.map((item) => (
              <div className="flex items-start gap-1 py-0.5">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="text-blue-600"
                />
                <p className="text-sm font-gilroyMedium">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-sm font-gilroyMedium text-start ">
            By clicking <strong>Agree & Proceed</strong>, you authotize
            deviceflow to deactivate the licences on your behalf.
          </p>
          <div className="h-[1px] bg-gray-200  -mx-6"></div>

          <DialogFooter className="flex w-full items-center justify-between -mb-1.5">
            {response?.unMapped?.length === 0 || inActive === 0 ? (
              <LoadingButton
                loading={loading}
                disabled={loading}
                className="w-full rounded-lg text-sm bg-black text-white font-gilroyMedium tracking-wide hover:bg-neutral-900/80"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkipClick();
                }}
              >
                Confirm
              </LoadingButton>
            ) : (
              <>
                <LoadingButton
                  loading={loading}
                  disabled={loading}
                  variant="outline"
                  className="w-[48%] bg-white hover:bg-white hover:border-black cursor-pointer"
                  // onClick={handleSkipClick}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkipClick();
                  }}
                  onMouseEnter={() =>
                    router.prefetch(
                      urlAddress ?? `/integrations/installed/${platform}`
                    )
                  }
                >
                  Skip
                </LoadingButton>
                <Button
                  className="w-[48%] rounded-lg text-sm bg-black text-white font-gilroyMedium tracking-wide hover:bg-neutral-900/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNextSteps(2);
                  }}
                >
                  Map Users
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
