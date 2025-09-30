"use client";

import BulkUpload from "@/components/bulk-upload";
import { buttonVariants, LoadingButton } from "@/components/buttons/Button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  bulkUploadDevices,
  createDevices,
  type Device,
  removeDuplicateLicense,
  updateDevice,
  assignLicensesToDevice, // Added import for software assignment
} from "@/server/deviceActions";
import React, { useState } from "react";
import AssetOneFormType from "./asset-one-form-type";
import { useForm } from "react-hook-form";
import {
  assetFormOneSchema,
  type assetFormOneType,
  laptopFormOneSchema,
  type laptopFormOneType,
  laptopFormTwoSchema,
  type laptopFormTwoType,
  licenseFormSchema,
  type licenseFormType,
  mobileFormSchema,
  type mobileFormType,
  otherFormSchema,
  type otherFormType,
} from "./utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import LaptopFormOne from "./laptop-form-one";
import LaptopFormTwo from "./laptop-form-two";
import LicenseOneFormType from "./liscence-one-form";
import MobileForm from "./mobile-form";
import OthersForm from "./others-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmationModal } from "@/app/(root)/workflows/[id]/_components/dropdowns/confirmation-popup";

interface CreateDeviceDialogProps {
  children: React.ReactNode;
  editDevice?: any;
  isEdit?: boolean;
  licenseDeviceType?: boolean;
}

export default function CreateDeviceDialog({
  children,
  editDevice = null,
  isEdit = false,
  licenseDeviceType,
}: CreateDeviceDialogProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [conflictDialog, setConflictDialog] = useState(false);
  const [pendingLicenseData, setPendingLicenseData] = useState<any>(null);
  const [pendingSoftwareAssignment, setPendingSoftwareAssignment] = useState<{
    deviceId: string;
    softwareId: string;
  } | null>(null); // Added state for software assignment flow
  const queryClient = useQueryClient();

  const assetFormOne = useForm<assetFormOneType>({
    resolver: zodResolver(assetFormOneSchema),
    defaultValues: {
      device_type: "",
      attach_asset_to: "",
      device_name: "",
      assigning_to: "",
      device_id: undefined,
    },
  });

  const laptopFormOne = useForm<laptopFormOneType>({
    resolver: zodResolver(laptopFormOneSchema),
    defaultValues: {
      brand: undefined,
      condition: undefined,
      model_name: "",
      os: "",
      processor: undefined,
      ram: undefined,
      storage: undefined,
    },
  });

  const laptopFormTwo = useForm<laptopFormTwoType>({
    resolver: zodResolver(laptopFormTwoSchema),
    defaultValues: {
      asset_physical_location: undefined,
      asset_physical_location_id: undefined,
      serial_no: "",
      asset_type: undefined,
      assigning_till: undefined,
      currently_with: undefined,
      installed_software: undefined,
      installed_software_id: undefined,
      purchased_on: undefined,
      warranty_end_date: undefined,
    },
  });

  const mobileForm = useForm<mobileFormType>({
    resolver: zodResolver(mobileFormSchema),
    defaultValues: {
      brand: undefined,
      condition: undefined,
      model_name: "",
      os: "",
      processor: undefined,
      ram: undefined,
      storage: undefined,
    },
  });

  const licenseForm = useForm<licenseFormType>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      billing_cycle: undefined,
      billing_price: undefined,
      license_keys: "",
      license_name: "",
      pricing_model: "",
      purchased_on: undefined,
      valid_till: undefined,
      license_name_id: undefined,
    },
  });

  const othersForm = useForm<otherFormType>({
    resolver: zodResolver(otherFormSchema),
    defaultValues: {
      asset_physical_location: undefined,
      asset_physical_location_id: undefined,
      asset_type: undefined,
      assigning_till: undefined,
      currently_with: undefined,
      currently_with_id: undefined,
      serial_no: "",
    },
  });

  const assetFormOneDirty = assetFormOne.formState.isDirty;
  const laptopFormOneDirty = laptopFormOne.formState.isDirty;
  const laptopFormTwoDirty = laptopFormTwo.formState.isDirty;
  const licenseFormDirty = licenseForm.formState.isDirty;
  const mobileFormDirty = mobileForm.formState.isDirty;
  const othersFormDirty = othersForm.formState.isDirty;

  const hasChanges =
    assetFormOneDirty ||
    laptopFormOneDirty ||
    laptopFormTwoDirty ||
    licenseFormDirty ||
    mobileFormDirty ||
    othersFormDirty;

  React.useEffect(() => {
    if (isEdit && editDevice && open) {
      setPage(0);

      assetFormOne.reset({
        device_type: editDevice.device_type || "",

        device_name: editDevice.device_name || "",
        assigning_to: editDevice.email || "",
        assigning_to_id: editDevice.userId || "",

        attach_asset_to:
          editDevice.device_type === "license"
            ? editDevice?.deviceDetails[0]?.custom_model
            : editDevice?.attachedAsset?.custom_model,
        attach_asset_to_id:
          editDevice.device_type === "license"
            ? editDevice?.deviceDetails[0]?._id
            : editDevice?.attachedAsset._id,
      });

      if (editDevice.device_type === "license") {
        licenseForm.reset({
          license_name: editDevice.licenseName || "",
          license_name_id: editDevice._id || "",
          license_keys: editDevice.licenseKey || "",
          pricing_model:
            editDevice.pricingModelType === "organization"
              ? "Organization Level"
              : "User Level",
          billing_cycle: editDevice.billingCycle || "",
          billing_price: editDevice.payable || "",
          purchased_on: editDevice.purchased_at
            ? new Date(editDevice.purchased_at)
            : undefined,
          valid_till: editDevice.validity
            ? new Date(editDevice.validity)
            : undefined,
        });
      } else if (editDevice.device_type === "laptop") {
        laptopFormOne.reset({
          brand: editDevice.brand || "",
          condition: editDevice.device_condition || "",
          model_name: editDevice.custom_model || "",
          os: editDevice.os || "",
          processor: editDevice.processor || "",
          ram: editDevice.ram || "",
          storage: editDevice.storage?.[0] || editDevice.storage || "",
        });

        setTimeout(() => {
          laptopFormTwo.reset({
            serial_no: editDevice.serial_no || "",
            asset_type: editDevice.is_temp_assigned ? "Temporary" : "Permanent",
            assigning_till: editDevice.duration
              ? new Date(editDevice.duration)
              : undefined,
            currently_with: editDevice.asset_owner_email || "",
            currently_with_id: editDevice.asset_owner_id || "",
            purchased_on: editDevice.purchased_at
              ? new Date(editDevice.purchased_at)
              : undefined,
            warranty_end_date: editDevice.warranty_expiary_date
              ? new Date(editDevice.warranty_expiary_date)
              : undefined,
            installed_software: editDevice.software?.[0]?.licenseName || null,
            installed_software_id: editDevice.software?.[0]?._id,
            asset_physical_location: editDevice.location || "",
            asset_physical_location_id: editDevice.physicalId || "",
          });
        }, 100);
      } else if (editDevice.device_type === "mobile") {
        mobileForm.reset({
          brand: editDevice.brand || "",
          condition: editDevice.device_condition || "",
          model_name: editDevice.custom_model || "",
          os: editDevice.os || "",
          processor: editDevice.processor || "",
          ram: editDevice.ram || "",
          storage: editDevice.storage[0] || "",
        });
      } else {
        othersForm.reset({
          serial_no: editDevice.serial_no || "",
          asset_type: editDevice.is_temp_assigned ? "Temporary" : "Permanent",
          assigning_till: editDevice.duration
            ? new Date(editDevice.duration)
            : undefined,
          currently_with: editDevice.currentUser?.email || "",
          currently_with_id: editDevice.currentUser?._id || "",
          asset_physical_location: editDevice.location || "",
          asset_physical_location_id: editDevice.physicalId || "",
        });
      }
    }
  }, [isEdit, editDevice, open]);

  React.useEffect(() => {
    if (!open) {
      setPage(0);
      setConflictDialog(false);
      setPendingLicenseData(null);
      setPendingSoftwareAssignment(null); // Clear pending software assignment
      assetFormOne.reset();
      laptopFormOne.reset();
      laptopFormTwo.reset();
      licenseForm.reset();
      othersForm.reset();
      mobileForm.reset();
    }
  }, [open]);

  const assetFormOneValues = assetFormOne.getValues();

  const createAssetMutation = useMutation({
    mutationFn: createDevices,
    onSuccess: (res) => {
      if (res.error) {
        setConflictDialog(true);
        return;
      } else if (res.duplicate) {
        toast.error(res.message);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["fetch-assets"],
          type: "all",
          refetchType: "all",
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["fetch-single-device"],
          type: "all",
          refetchType: "all",
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["licenses"],
          exact: false,
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["async-select", "fetch-unassigned-devices"],
        });
        toast.success(
          isEdit ? "Asset updated successfully" : "Asset created successfully"
        );
        if (pendingSoftwareAssignment) {
          const deviceId = res.data?._id || res._id;
          if (deviceId) {
            assignSoftwareMutation.mutate({
              licenseId: pendingSoftwareAssignment.softwareId,
              deviceId: deviceId,
            });
            setPendingSoftwareAssignment(null);
            return;
          }
        }

        setOpen(false);
      }
    },
    onError: () => {
      toast.error(
        isEdit ? "Failed to update device" : "Failed to create device"
      );
    },
  });

  const assignSoftwareMutation = useMutation({
    mutationFn: ({
      licenseId,
      deviceId,
    }: {
      licenseId: string;
      deviceId: string;
    }) => assignLicensesToDevice(licenseId, deviceId),
    onSuccess: (data) => {
      if (data?.error) {
        setPendingSoftwareAssignment({
          deviceId: data.deviceId || "",
          softwareId: data.licenseId || "",
        });
        setConflictDialog(true);
        return;
      }
      toast.success("Software assigned successfully");
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
      queryClient.invalidateQueries({
        queryKey: ["device-timeline"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
        exact: false,
        refetchType: "all",
      });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to assign software");
    },
  });

  const removeDuplicateMutation = useMutation({
    mutationFn: ({
      userId,
      integrationId,
    }: {
      userId: string;
      integrationId: string;
    }) => removeDuplicateLicense(userId, integrationId),
    onSuccess: () => {
      toast.success("Software removed from user");
      setConflictDialog(false);

      if (pendingLicenseData) {
        // console.log("Retrying license creation after conflict resolution");
        const mutation = isEdit ? updateAssetMutation : createAssetMutation;
        const mutationData = isEdit
          ? { id: editDevice!._id, assetData: pendingLicenseData }
          : pendingLicenseData;

        mutation.mutate(mutationData);
        setPendingLicenseData(null);
      }

      if (pendingSoftwareAssignment) {
        // console.log("Retrying software assignment after conflict resolution");
        assignSoftwareMutation.mutate({
          licenseId: pendingSoftwareAssignment.softwareId,
          deviceId: pendingSoftwareAssignment.deviceId,
        });
        setPendingSoftwareAssignment(null);
      }
    },
    onError: () => {
      toast.error("Failed to remove duplicate license");
      setConflictDialog(false);
      setPendingLicenseData(null);
      setPendingSoftwareAssignment(null);
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: (input: { id: string; assetData: Device }) =>
      updateDevice(input.id, input.assetData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
        exact: false,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });

      setOpen(false);
      toast.success(
        isEdit ? "Device updated successfully" : "Device created successfully"
      );
    },
    onError: () => {
      toast.error(
        isEdit ? "Failed to update device" : "Failed to create device"
      );
    },
  });

  function assetOneFormSubmit(values: assetFormOneType) {
    if (isEdit) {
      setPage(1);
    } else {
      if (values?.device_type !== "license") {
        if (!values?.device_name) {
          assetFormOne?.setError("device_name", {
            message: "Asset name is required",
            type: "validate",
          });
        } else {
          setPage(1);
        }
      } else {
        setPage(1);
      }
    }
    // console.log(values);
  }

  function laptopFormOneSubmit(values: laptopFormOneType) {
    setPage(2);
    // console.log(values);
  }

  function laptopFormTwoSubmit(values: laptopFormTwoType) {
    const laptopFormOneValues = laptopFormOne.getValues();

    const hasSoftwareToAssign =
      values.installed_software && values.installed_software_id;
    if (hasSoftwareToAssign) {
      setPendingSoftwareAssignment({
        deviceId: "",
        softwareId: values.installed_software_id,
      });
    }

    const devicePayload: any = {
      device_name: assetFormOneValues.device_name,
      device_type: assetFormOneValues.device_type,
      ...(laptopFormOneValues.brand && { brand: laptopFormOneValues.brand }),
      ...(laptopFormOneValues.model_name && {
        custom_model: laptopFormOneValues.model_name,
      }),
      ...(laptopFormOneValues.os && { os: laptopFormOneValues.os }),
      ...(laptopFormOneValues.processor && {
        processor: laptopFormOneValues.processor,
      }),
      ...(laptopFormOneValues.ram && { ram: laptopFormOneValues.ram }),
      ...(laptopFormOneValues.storage && {
        storage: laptopFormOneValues.storage,
      }),
      ...(laptopFormOneValues.condition && {
        device_condition: laptopFormOneValues.condition,
      }),
      ...(values.purchased_on && {
        purchased_at: new Date(values.purchased_on).toISOString(),
      }),
      ...(values.warranty_end_date && {
        warranty_expiary_date: new Date(values.warranty_end_date).toISOString(),
      }),
    };

    if (!isEdit && values.serial_no) {
      devicePayload.serial_no = values.serial_no;
    }

    if (assetFormOneValues.assigning_to && assetFormOneValues.assigning_to_id) {
      devicePayload.userId = assetFormOneValues.assigning_to_id;
    } else if (values.currently_with_id) {
      devicePayload.asset_owner = values.currently_with_id;
      if (values.asset_physical_location && values.asset_physical_location_id) {
        devicePayload.physicalId = values.asset_physical_location_id;
      }
    }

    if (values.asset_type === "Temporary") {
      devicePayload.is_temp_assigned = true;
      if (values.assigning_till) {
        devicePayload.duration = new Date(values.assigning_till).toISOString();
      }
    } else if (values.asset_type === "Permanent") {
      devicePayload.is_temp_assigned = false;
    }

    const mutation = isEdit ? updateAssetMutation : createAssetMutation;
    const mutationData = isEdit
      ? { id: editDevice!._id, assetData: devicePayload }
      : devicePayload;

    mutation.mutate(mutationData);
  }

  function licenseFormSubmit(values: licenseFormType) {
    const licensePayload: any = {
      device_type: "license",
      attach_asset: assetFormOneValues.attach_asset_to_id,
      ...(values.license_name && {
        licenseName: values.license_name,
        integrationId: values.license_name_id,
      }),
      ...(values.license_keys && {
        licenseKey: values.license_keys,
      }),
      ...(values.pricing_model && {
        pricingModelType:
          values.pricing_model === "Organization Level"
            ? "organization"
            : "user",
        ...(values.pricing_model === "Organization Level" && {
          isOrganisation: true,
        }),
      }),
      ...(values.billing_cycle && {
        billingCycle: values.billing_cycle,
      }),
      ...(values.billing_price && {
        payable: Number(values.billing_price),
      }),
      ...(values.purchased_on && {
        purchased_at: new Date(values.purchased_on).toISOString(),
      }),
      ...(values.valid_till && {
        validity: new Date(values.valid_till).toISOString(),
      }),
    };

    setPendingLicenseData(licensePayload);

    const mutation = isEdit ? updateAssetMutation : createAssetMutation;
    const mutationData = isEdit
      ? { id: editDevice!._id, assetData: licensePayload }
      : licensePayload;
    // console.log(mutationData);
    mutation.mutate(mutationData);
  }

  function mobileFormSubmit(values: mobileFormType) {
    const mobilePayload: any = {
      device_type: assetFormOneValues.device_type,
      device_name: assetFormOneValues.device_name,
      ...(values.brand && {
        brand: values.brand,
      }),
      ...(values.condition && {
        device_condition: values?.condition,
      }),
      ...(values.model_name && {
        custom_model: values.model_name,
      }),
      ...(values.os && {
        os: values.os,
      }),
      ...(values.ram && {
        ram: values.ram,
      }),
      ...(values.processor && {
        processor: values.processor,
      }),
      ...(values.storage && {
        storage: values.storage,
      }),
    };

    if (assetFormOneValues.assigning_to && assetFormOneValues.assigning_to_id) {
      mobilePayload.userId = assetFormOneValues.assigning_to_id;
    }

    const mutation = isEdit ? updateAssetMutation : createAssetMutation;
    const mutationData = isEdit
      ? { id: editDevice!._id, assetData: mobilePayload }
      : mobilePayload;

    mutation.mutate(mutationData);
  }

  function OtherFormSubmit(values: otherFormType) {
    // console.log("other");
    const othersPayload: any = {
      device_type: assetFormOneValues.device_type,
      device_name: assetFormOneValues.device_name,
      attach_asset: assetFormOneValues.attach_asset_to_id,
    };

    if (!isEdit && values.serial_no) {
      othersPayload.serial_no = values.serial_no;
    }

    if (assetFormOneValues.assigning_to && assetFormOneValues.assigning_to_id) {
      othersPayload.userId = assetFormOneValues.assigning_to_id;
    } else if (values.currently_with_id) {
      othersPayload.asset_owner = values.currently_with_id;
      if (values.asset_physical_location && values.asset_physical_location_id) {
        othersPayload.physicalId = values.asset_physical_location_id;
      }
    }
    if (values.asset_physical_location && values.asset_physical_location_id) {
      othersPayload.physicalId = values.asset_physical_location_id;
    }
    if (values.asset_type === "Temporary") {
      othersPayload.is_temp_assigned = true;
      if (values.assigning_till) {
        othersPayload.duration = new Date(values.assigning_till).toISOString();
      }
    } else if (values.asset_type === "Permanent") {
      othersPayload.is_temp_assigned = false;
    }

    const mutation = isEdit ? updateAssetMutation : createAssetMutation;
    const mutationData = isEdit
      ? { id: editDevice!._id, assetData: othersPayload }
      : othersPayload;

    mutation.mutate(mutationData);
  }

  const assignTo = assetFormOne.watch("assigning_to");
  const handleRemoveDuplicationSubmit = () => {
    const conflictData =
      createAssetMutation?.data?.conflict ||
      assignSoftwareMutation?.data?.conflict;
    if (conflictData) {
      removeDuplicateMutation.mutate({
        userId: conflictData.userId,
        integrationId: conflictData.integrationId,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setPage(0);
          setConflictDialog(false);
          setPendingLicenseData(null);
          setPendingSoftwareAssignment(null);
          assetFormOne.reset();
          licenseForm.reset();
          laptopFormOne.reset();
          laptopFormTwo.reset();
          othersForm.reset();
          mobileForm.reset();
        }
      }}
    >
      <DialogTrigger asChild className="w-fit">
        {children}
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="flex flex-col gap-0 overflow-y-visible rounded-xl p-0 max-w-md [&>button:last-child]:top-3.5"
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className=" px-4 pt-4 text-lg">
            {isEdit
              ? "Edit Asset"
              : page === 0
              ? "Add Asset"
              : page === 1 && assetFormOneValues.device_type === "license"
              ? "License Key"
              : page === 1
              ? "Asset Details"
              : page === 2
              ? "Asset Details"
              : null}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 h-[25.95rem] w-full overflow-y-auto hide-scrollbar">
          {page === 0 && (
            <>
              {!isEdit && assetFormOneValues.device_type !== "license" && (
                <>
                  <BulkUpload
                    sampleData={{
                      model: "XXXX",

                      device_name: "YYYYY",
                      serial_no: "XXXX1234",
                      device_purchase_date: "09/12/2023",
                      ram: "16GB",
                      processor: "Intel Core i5",
                      storage: "256GB",
                      warranty_expiary_date: "21/11/2024",
                      os: "windows",
                      price: 12000,
                      device_type: "laptop",
                      brand: "HP",
                      device_condition: "Fair",
                    }}
                    closeBtn={() => setOpen(false)}
                    requiredKeys={["device_name", "serial_no", "device_type"]}
                    bulkApi={bulkUploadDevices}
                    type="device"
                  />
                  <div className="w-full mt-6 mb-4 text-xs text-[#0000004D] flex gap-2 items-center justify-center font-gilroyMedium">
                    <div className="w-[10%] h-[0.5px] bg-[#0000001A]" />
                    OR
                    <div className="w-[10%] h-[0.5px] bg-[#0000001A]" />
                  </div>
                </>
              )}
              <AssetOneFormType
                isEdit={isEdit}
                assetOneFormSubmit={assetOneFormSubmit}
                assetFormOne={assetFormOne}
                licenseDeviceType={licenseDeviceType}
              />
            </>
          )}
          {conflictDialog && (
            <ConfirmationModal
              skipBtnText="Discard"
              functionToBeExecuted={handleRemoveDuplicationSubmit}
              type="warning"
              open={conflictDialog}
              setOpen={setConflictDialog}
              title="Duplicate Software"
              description="The software is assigned to both the user and the asset. It will be removed from the user."
              successBtnText="Confirm"
            >
              <div
                className={buttonVariants({
                  variant: "outlineTwo",
                  className: "hidden",
                })}
              >
                Duplicate
              </div>
            </ConfirmationModal>
          )}
          {page === 1 ? (
            assetFormOneValues.device_type === "laptop" ? (
              <LaptopFormOne
                laptopFormOneSubmit={laptopFormOneSubmit}
                laptopFormOne={laptopFormOne}
              />
            ) : assetFormOneValues.device_type === "license" ? (
              <LicenseOneFormType
                licenseFormSubmit={licenseFormSubmit}
                setOpen={setOpen}
                isEdit={isEdit}
                licenseForm={licenseForm}
              />
            ) : assetFormOneValues.device_type === "others" ? (
              <OthersForm
                OtherFormSubmit={OtherFormSubmit}
                assignTo={assignTo}
                othersForm={othersForm}
              />
            ) : assetFormOneValues.device_type === "mobile" ? (
              <MobileForm
                mobileFormSubmit={mobileFormSubmit}
                mobileForm={mobileForm}
              />
            ) : assetFormOneValues.device_type === "monitor" ? (
              <OthersForm
                OtherFormSubmit={OtherFormSubmit}
                assignTo={assignTo}
                othersForm={othersForm}
              />
            ) : assetFormOneValues.device_type === "keyboard" ? (
              <OthersForm
                OtherFormSubmit={OtherFormSubmit}
                assignTo={assignTo}
                othersForm={othersForm}
              />
            ) : null
          ) : null}

          {page === 2 && (
            <LaptopFormTwo
              isEdit={isEdit}
              laptopFormTwoSubmit={laptopFormTwoSubmit}
              assignTo={assignTo}
              laptopFormTwo={laptopFormTwo}
            />
          )}
        </div>
        <DialogFooter className=" px-4 pt-5 pb-4 justify-end">
          {page > 0 ? (
            <Button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              variant="outline"
              className="w-full rounded-[5px]"
            >
              Previous
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
              className="w-full rounded-[5px]"
            >
              Cancel
            </Button>
          )}

          <LoadingButton
            className="rounded-[5px]"
            type="submit"
            loading={
              createAssetMutation.isPending ||
              updateAssetMutation.isPending ||
              assignSoftwareMutation.isPending
            }
            disabled={
              createAssetMutation.isPending ||
              updateAssetMutation.isPending ||
              assignSoftwareMutation.isPending
            }
            onClick={(e) => {
              if (isEdit && page === 0) {
                e.preventDefault();
                setPage(1);
                return;
              }

              if (isEdit && page === 1) {
                if (assetFormOneValues.device_type === "laptop") {
                  e.preventDefault();
                  setPage(2);
                  return;
                }
                if (!hasChanges) {
                  e.preventDefault();
                  setOpen(false);
                  return;
                }
              }

              if (isEdit && page === 2 && !hasChanges) {
                e.preventDefault();
                setOpen(false);
              }
            }}
            form={
              page === 0
                ? "asset-form-one"
                : page === 1 && assetFormOneValues.device_type === "laptop"
                ? "laptop-form-one"
                : page === 1 && assetFormOneValues.device_type === "mobile"
                ? "mobile-form"
                : page === 1 &&
                  ["keyboard", "monitor", "others"].includes(
                    assetFormOneValues.device_type
                  )
                ? "other-forms"
                : page === 1 && assetFormOneValues.device_type === "license"
                ? "license-form"
                : page === 2 && "laptop-form-two"
            }
            variant="primary"
          >
            {isEdit
              ? page === 0
                ? "Next"
                : page === 1
                ? assetFormOneValues.device_type === "laptop"
                  ? "Next"
                  : hasChanges
                  ? "Update"
                  : "No Changes"
                : page === 2 && !hasChanges
                ? "No Changes"
                : "Update"
              : page === 0
              ? "Next"
              : page === 1 && assetFormOneValues.device_type === "laptop"
              ? "Next"
              : "Submit"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
