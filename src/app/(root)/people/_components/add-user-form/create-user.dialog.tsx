import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";

import BulkUpload from "@/components/bulk-upload";
import { GsuiteDialog } from "@/components/bulk-upload/gsuite-bulk-upload.dialog";
import { LoadingButton } from "@/components/buttons/Button";
import { Device, updateDevice } from "@/server/deviceActions";
import {
  bulkUploadUsers,
  createUser,
  updateUser,
  User,
} from "@/server/userActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { bulkUploadKeys } from "../helper/utils";
import { NewUserFormOne } from "./new-user-form-one";
import { NewUserFormTwo } from "./new-user-form-two";
import {
  userFormOneSchema,
  UserFormOneType,
  userFormTwoSchema,
  UserFormTwoType,
} from "./validations";
import ExtraSeatConfirmationDialog from "@/components/settings/extra-seat-dialog";

export default function CreateUserDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [page, setPage] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [extraSeatDialogOpen, setExtraSeatDialogOpen] = React.useState(false);
  const [extraSeatData, setExtraSeatData] = React.useState<any>(null);
  const [error, setError] = React.useState("");
  const queryClient = useQueryClient();
  const [openGsuiteModal, setOpenGsuiteModal] = React.useState(false);

  const userFormOne = useForm<UserFormOneType>({
    resolver: zodResolver(userFormOneSchema),
    defaultValues: {
      first_name: "",
      email: "",
      phone: "",
      dob: undefined,
      gender: undefined,
    },
  });

  function userFormOneSubmit(values: UserFormOneType) {
    setPage(2);
  }

  const userFormTwo = useForm<UserFormTwoType>({
    resolver: zodResolver(userFormTwoSchema),
    defaultValues: {
      asset: "",
      designation: "",
      employment_type: undefined,
      emp_id: "",
      reporting_manager: "",
      reporting_manager_id: "",
      team: "",
      team_id: "",
      asset_id: "",
      onboarding_date: undefined,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-people"],
        type: "all",
        refetchType: "all",
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["async-select", "fetch-users"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (input: { id: string; userData: User }) =>
      updateUser(input.id, input.userData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-team-by-id"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["get-users-by-team-id"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["async-select", "fetch-users"],
      });
    },
    onError: () => {},
  });

  const updateDeviceMutation = useMutation({
    mutationFn: (input: { id: string; deviceData: Device }) =>
      updateDevice(input.id, input.deviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-timeline"],
        type: "all",
        refetchType: "all",
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["async-select", "fetch-users"],
      });
    },
    onError: () => {},
  });

  function userFormTwoSubmit(values: UserFormTwoType) {
    const userFormOneValues = userFormOne.getValues();

    const user = {
      ...(userFormOneValues.first_name && {
        first_name: userFormOneValues.first_name,
      }),
      ...(userFormOneValues.email && { email: userFormOneValues.email }),
      ...(userFormOneValues.phone && { phone: userFormOneValues.phone }),
      ...(values.designation && { designation: values.designation }),
      ...(values.onboarding_date && {
        onboarding_date: new Date(values.onboarding_date).toISOString(),
      }),
      ...(values.employment_type && {
        employment_type: values.employment_type,
      }),
      ...(userFormOneValues.dob && {
        date_of_birth: new Date(userFormOneValues.dob).toISOString(),
      }),
      ...(userFormOneValues.gender && { gender: userFormOneValues.gender }),
      ...(values.emp_id && { emp_id: values.emp_id }),
    };

    setError("");

    if (values?.reporting_manager_id) {
      user["reporting_manager"] = values.reporting_manager_id;
    }

    createUserMutation.mutate(user, {
      onSuccess: (createdUser) => {
        console.log(createdUser);
        if (createdUser.message) {
          setExtraSeatData(createdUser);
          setExtraSeatDialogOpen(true);
          return;
        }
        const userId = createdUser._id;

        const actions: Promise<any>[] = [];

        if (values.team_id) {
          actions.push(
            new Promise((resolve, reject) => {
              updateUserMutation.mutate(
                {
                  id: userId,
                  // @ts-ignore
                  userData: { teamId: values.team_id },
                },
                {
                  onSuccess: resolve,
                  onError: (err) => {
                    setError("Failed to assign team to user.");
                    toast.error("Failed to assign team to user.");
                    reject(err);
                  },
                }
              );
            })
          );
        }

        if (values.asset_id) {
          actions.push(
            new Promise((resolve, reject) => {
              updateDeviceMutation.mutate(
                {
                  id: values.asset_id,
                  deviceData: { userId: userId },
                },
                {
                  onSuccess: resolve,
                  onError: (err: any) => {
                    setError("Failed to assign device to user.");
                    toast.error("Failed to assign device to user.");
                    reject(err);
                  },
                }
              );
            })
          );
        }

        if (actions.length) {
          Promise.all(actions)
            .then(() => {
              toast.success("User created successfully.");
              setOpen(false);
            })
            .catch(() => {
              toast.error("User created, but some associations failed.");
            });
        } else {
          toast.success("User created successfully.");
          setOpen(false);
        }
      },
      onError: () => {
        setError("Failed to create user.");
        toast.error("Failed to create user.");
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setPage(1);
          setError("");
          userFormOne.reset();
          userFormTwo.reset();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible rounded-xl p-0 max-w-md [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-3 text-lg">
            Add Employee
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add an employee to your organization
        </DialogDescription>

        <div className="p-6 h-[28.6rem] w-full overflow-y-auto hide-scrollbar">
          {page === 1 ? (
            <>
              <GsuiteDialog
                open={openGsuiteModal}
                setOpen={setOpenGsuiteModal}
              />

              <div className="w-full flex flex-col gap-2 justify-between items-center ">
                <div className="rounded-md h-[3.75rem] p-2 w-full flex justify-between items-center border border-gray-200">
                  <div className="flex gap-2">
                    <Image
                      src="/media/integrations-companies/google.webp"
                      alt="GSuite"
                      className="size-9"
                      width={35}
                      height={30}
                    />

                    <div className="flex items-center">
                      <h1 className="text-[15px] font-gilroySemiBold">
                        GSuite
                      </h1>
                    </div>
                  </div>
                  <button
                    className={` bg-black rounded-md text-white font-gilroyMedium  text-sm py-2 px-6 hover:bg-gray-800 ${
                      false ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      setOpenGsuiteModal(true);
                    }}
                  >
                    Import
                  </button>
                </div>
                <BulkUpload
                  bulkApi={bulkUploadUsers}
                  closeBtn={() => setOpen(false)}
                  requiredKeys={bulkUploadKeys}
                  type="user"
                  sampleData={{
                    first_name: "XXXX YYYY",
                    designation: "Engineer",
                    email: "demo@exampledemo.com",
                    phone: "1234567890",
                    employment_type: "Full time",
                    date_of_birth: "09/12/1992",
                    gender: "Male",
                    onboarding_date: "28/01/2020",
                    team_code: "ABCDEF",
                    emp_id: "0123",
                  }}
                />
              </div>

              <div className="w-full mt-6 mb-4 text-xs text-[#0000004D] flex gap-2 items-center justify-center font-gilroyMedium">
                <div className="w-[10%] h-[0.5px] bg-[#0000001A] " />
                OR
                <div className="w-[10%] h-[0.5px] bg-[#0000001A] " />
              </div>

              <NewUserFormOne
                userFormOne={userFormOne}
                userFormOneSubmit={userFormOneSubmit}
              />
            </>
          ) : (
            <>
              <NewUserFormTwo
                error={error}
                userFormTwo={userFormTwo}
                userFormTwoSubmit={userFormTwoSubmit}
              />
            </>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-3 justify-end">
          <Button
            type="button"
            onClick={() => {
              if (page === 2) {
                setPage(1);
              } else if (open) {
                setOpen(false);
              }
            }}
            variant="outline"
          >
            {page === 1 ? "Cancel" : "Previous"}
          </Button>
          <LoadingButton
            type="submit"
            loading={
              createUserMutation.isPending ||
              updateUserMutation.isPending ||
              updateDeviceMutation.isPending
            }
            disabled={
              createUserMutation.isPending ||
              updateUserMutation.isPending ||
              updateDeviceMutation.isPending
            }
            variant="primary"
            className="min-w-20 w-fit "
            form={page === 1 ? "user-form-1" : "user-form-2"}
          >
            {page === 1 ? "Next" : "Submit"}
          </LoadingButton>
        </DialogFooter>
        <ExtraSeatConfirmationDialog
          data={extraSeatData}
          open={extraSeatDialogOpen}
          setOpen={setExtraSeatDialogOpen}
          followingFn={userFormTwo.handleSubmit(userFormTwoSubmit)}
        />
      </DialogContent>
    </Dialog>
  );
}
