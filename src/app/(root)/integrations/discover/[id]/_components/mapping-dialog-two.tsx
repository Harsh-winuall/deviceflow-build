"use client";

import { useChangeWorkflowStatus } from "@/app/(root)/workflows/[id]/_components/hooks/use-change-workflow-status";
import { Button } from "@/components/buttons/Button";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mapIntegrationUsers } from "@/server/integrationActions";
import { ArrowLeft01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type UsersType = {
  _id: string;
  first_name: string;
  email: string;
  employment_type: string;
  designation: string;
  image: string;
  team: {
    _id: string;
    title: string;
    team_code: string;
  }[];
  devices: number;
  // If last_name is applicable, you might include:
  last_name?: string;
};

type AddIntegrationResType = {
  message: string;
  integrationId: string;
  status: string;
  data: {
    _id: string;
    orgId: string;
    __v: number;
    createdAt: string;
    email: string;
    image: null;
    name: string;
    subscriptions: {
      integrationId: string;
      refId: string;
      _id: string;
    }[];
    updatedAt: string;
    userId: null;
  }[];
  totalCount: number;
  unMapped: UsersType[];
  unMappedCount: number;
};

interface MappingDialogTwoProps {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setNextSteps?: React.Dispatch<React.SetStateAction<number>>;
  response?: any;
  platform?: string;
  urlAddress?: string;
  _id?: string;
}

export default function MappingDialogTwo({
  children,
  urlAddress,
  open,
  _id,
  setOpen,
  setNextSteps,
  response,
  platform,
}: MappingDialogTwoProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { updateMutation } = useChangeWorkflowStatus(_id ?? "");

  const [mappingSelections, setMappingSelections] = useState<
    Record<number, UsersType | null>
  >({});
  const [error, setError] = useState<string>("");

  // Filter out the integration records which have a null userId  const active = useMemo(() => {

  const filteredData = response
    ? response?.data?.data.filter((u) => u?.userId === null)
    : [];

  // console.log(filteredData);

  const getUsers = async (query: string = ""): Promise<UsersType[]> => {
    try {
      const data = response?.unMapped || [];

      // Collect all selected user _ids from the mappingSelections
      const selectedUserIds = Object.values(mappingSelections)
        .filter((user): user is UsersType => !!user)
        .map((user) => user._id);

      const res = data?.filter((user) => {
        const searchStr = query.toLowerCase();

        const matchesSearch =
          user?.first_name?.toLowerCase().includes(searchStr) ||
          user?.email?.toLowerCase().includes(searchStr) ||
          (user?.name && user?.name.toLowerCase().includes(searchStr));
        user?.last_name && user?.last_name.toLowerCase().includes(searchStr);

        const isNotSelected = !selectedUserIds.includes(user._id);

        return matchesSearch && isNotSelected;
      });

      return res;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  };

  // Update the mapping selection for a given row index
  const updateMappingSelection = (index: number, user: UsersType | null) => {
    setMappingSelections((prev) => ({
      ...prev,
      [index]: user,
    }));
    // Clear any previous error if a valid selection is made
    if (user) setError("");
  };

  // Reset mapping selections (clearing AsyncSelect fields)
  const clearAll = () => {
    setMappingSelections({});
    setError("");
  };

  // API Mutation handler
  const mutation = useMutation({
    mutationFn: mapIntegrationUsers,
    mutationKey: ["map-integration-users"],
    onSuccess: async () => {
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
      setNextSteps && setNextSteps(0);
    },
  });

  // Handle the Confirm button click
  const handleMapping = async () => {
    // Validate that every mapping row has a selected user
    // const incompleteMapping = filteredData?.some(
    //   (_, index) => !mappingSelections?.[index]
    // );
    // if (incompleteMapping) {
    //   setError("Please select a user for every mapping.");
    //   return;
    // }
    // Build payload: each mapping object includes keys as required.
    const payload = filteredData?.map((mapping, index) => {
      const selectedUser = mappingSelections?.[index] as UsersType;
      return {
        integrationId: response?.integrationId,
        userId: selectedUser?._id,
        userIntegrationId: mapping?._id, // adjust if different data is needed
      };
    });
    // console.log(payload);
    // Call the API with the payload
    mutation.mutate(
      { payload },
      {
        onSuccess: () => {
          router.replace(
            urlAddress ? urlAddress : `/integrations/installed/${platform}`,
            {
              scroll: false,
            }
          );
          toast.success("Integration successfull !");
        },
      }
    );

    if (_id) {
      updateMutation.mutate({ allNodesIntegrated: false });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setNextSteps && setNextSteps(0)}>
        <DialogTrigger onClick={(e) => e.stopPropagation()}>
          {children}
        </DialogTrigger>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onInteractOutside={(e) => e.preventDefault()}
          className="rounded-2xl bg-white p-4 shadow-lg max-w-md w-full"
        >
          <DialogTitle className="text-base flex gap-3 items-center font-gilroyMedium pl-2">
            <div
              className="rounded-full cursor-pointer bg-gray-100 p-1 flex justify-center items-center"
              onClick={() => setNextSteps && setNextSteps(1)}
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                className="text-black size-5"
              />
            </div>
            Map Users
          </DialogTitle>
          <DialogDescription className="sr-only">
            Mapping dialog two
          </DialogDescription>
          <div className="w-full space-y-4 px-2 h-full max-h-[40vh] overflow-y-auto">
            {filteredData?.map((mapping, index) => (
              <div
                key={mapping?._id || index}
                className="flex items-center justify-between gap-x-5"
              >
                <Input
                  value={mapping?.name || mapping?.email || ""}
                  defaultValue={mapping?.name || mapping?.email || ""}
                  className="rounded-md border border-gray-200 w-[9.5rem]"
                  placeholder="Enter value"
                  readOnly
                />
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  className="text-gray-900 size-5"
                />

                <div className="flex flex-col gap-2">
                  <AsyncSelect<UsersType>
                    fetcher={getUsers}
                    queryKey="fetch-users"
                    fixInputClear={false}
                    renderOption={(user) => (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div className="font-gilroyMedium">
                            {user?.first_name}
                          </div>
                          <div className="text-xs font-gilroyRegular text-muted-foreground">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    )}
                    getOptionValue={(user) => user?.email}
                    getDisplayValue={() => (
                      <div className="flex items-center gap-2 text-left w-fit">
                        <div className="flex flex-col leading-tight">
                          <div className="font-gilroyMedium truncate min-w-0 w-[6.2rem]">
                            {mappingSelections?.[index]?.email ?? ""}
                          </div>
                        </div>
                      </div>
                    )}
                    notFound={
                      <div className="py-6 text-center font-gilroyMedium text-sm">
                        No users found
                      </div>
                    }
                    label="User"
                    placeholder="Map to"
                    value={mappingSelections?.[index]?.email || "null"}
                    onChange={(selected: UsersType | null) =>
                      updateMappingSelection(index, selected)
                    }
                    width="10rem"
                  />
                </div>
              </div>
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
          <div className="h-[1px] bg-gray-200  -mx-4"></div>
          <DialogFooter className="flex w-full items-center justify-between mt-1 mb-1 px-2">
            <Button
              className="w-[48%] rounded-lg text-sm bg-white text-black  font-gilroyMedium tracking-wide border hover:border-black"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
            >
              Clear All
            </Button>
            <Button
              disabled={mutation.isPending}
              className="w-[48%] rounded-lg text-sm bg-black text-white font-gilroyMedium tracking-wide hover:bg-neutral-900/80"
              onClick={(e) => {
                e.stopPropagation();
                handleMapping();
              }}
              onMouseEnter={() =>
                router.prefetch(
                  urlAddress ?? `/integrations/installed/${platform}`
                )
              }
            >
              {mutation.isPending ? (
                <>
                  Confirm <Loader2 className="animate-spin size-4" />
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
