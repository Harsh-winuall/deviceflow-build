"use client";
import { ConfirmationModal } from "@/app/(root)/workflows/[id]/_components/dropdowns/confirmation-popup";
import { ActionBar } from "@/components/action-bar/action-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { CombinedContainer } from "@/components/container/container";
import {
  assignLicensesToDevice,
  deleteSingleSoftware,
  getLicenseByID,
} from "@/server/deviceActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CreateDeviceDialog from "../../_components/addDevices/_components/add-device-form";
import SingleSoftwareScreen from "./_components/single-software";

import { HoverDropdownMenu } from "@/components/action-bar/hover-dropdown-menu";
import { useRouter } from "next/navigation";

export default function Main({ params: slug }: { params: any }) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: newData, status } = useQuery({
    queryKey: ["fetch-single-device", slug],
    queryFn: () => getLicenseByID(slug),
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (licenseId: string) =>
      assignLicensesToDevice(newData._id, null),
    onSuccess: () => {
      setOpen(false);
      toast.success("Software unassigned successfully");
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to assign software");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSingleSoftware,
    onSuccess: () => {
      toast.success("Software deleted Successfully");
      setDeleteOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Failed to delete software");
    },
  });
  const handleUnAssignSubmit = () => {
    mutation.mutate(newData._id);
  };
  const handleDeleteSingleSoftware = () => {
    deleteMutation.mutate(newData._id);
    router.push("/licenses");
    queryClient.invalidateQueries({
      queryKey: ["licenses"],
      exact: false,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["fetch-assets"],
      exact: false,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["fetch-single-device"],
      exact: false,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["device-timeline"],
      exact: false,
      refetchType: "all",
    });
  };
  return (
    <CombinedContainer>
      <ActionBar showBackBtn>
        <div className="flex gap-2"></div>
        <div className="flex gap-2">
          {newData?.deviceDetails.length != 0 && (
            <ConfirmationModal
              open={open}
              setOpen={setOpen}
              functionToBeExecuted={handleUnAssignSubmit}
              type="warning"
              skipBtnText="Discard"
              title="Are you sure?"
              description="Unassigning this software will revoke the asset's subscription access."
              successBtnText="Confirm"
            >
              <div className={buttonVariants({ variant: "outlineTwo" })}>
                Unassign
              </div>
            </ConfirmationModal>
          )}

          <HoverDropdownMenu>
            {/* <CreateDeviceDialog isEdit={true} editDevice={newData}>
              <button
                role="menuitem"
                className="w-full text-[13px] text-left px-4 py-2 font-gilroyMedium hover:bg-gray-50"
              >
                Edit Software
              </button>
            </CreateDeviceDialog> */}

            <button
              role="menuitem"
              onClick={() => setDeleteOpen(true)}
              className="w-full text-[13px] text-left px-4 py-2 font-gilroyMedium hover:bg-gray-50 text-red-600"
            >
              Delete Software
            </button>
          </HoverDropdownMenu>

          {/* ✅ always mounted, just controlled */}
          <ConfirmationModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            functionToBeExecuted={handleDeleteSingleSoftware}
            type="warning"
            skipBtnText="Discard"
            title="Are you Sure?"
            description="Are you sure you want to delete this software?"
            successBtnText="Confirm"
          />
        </div>
      </ActionBar>

      <SingleSoftwareScreen data={newData} status={status} />
    </CombinedContainer>
  );
}
