"use client";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { SelectDropdown } from "@/components/dropdown/select-dropdown";
import { GetAvatar } from "@/components/get-avatar";
import { AsyncSelect } from "@/components/ui/async-select";
import { Device, updateDevice } from "@/server/deviceActions";
import { fetchUsers, User } from "@/server/userActions";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormField } from "../../settings/_components/form-field";
import { toast } from "sonner";

const AssignAssetsForm = ({
  closeBtn,
  device,
}: {
  closeBtn: (boo: boolean) => void;
  device?: Device;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    assetType: "",
    assignTill: "",
  });

  const [user, setUser] = useState<User>();

  const validateFn = () => {
    setError("");
    if (!user?._id) {
      setError("User is required");
      return;
    }

    if (!formData.assetType) {
      setError("Asset type is required");
      return;
    }

    if (formData.assetType === "Temporary" && !formData.assignTill) {
      setError("Assigning Till date is required for temporary assets");
      return;
    }

    return true;
  };
  const querClient = useQueryClient();
  const handleSubmit = async () => {
    if (!validateFn()) {
      return;
    }

    if (user?._id) {
      setLoading(true);

      const res = await updateDevice(device?._id ?? "error", {
        userId: user?._id,
        duration: formData.assignTill,
        is_temp_assigned: formData.assetType === "Temporary" ? true : false,
      });
      querClient.invalidateQueries({
        queryKey: ["fetch-assets"],
        exact: false,
        refetchType: "all",
      });

      querClient.invalidateQueries({
        queryKey: ["fetch-single-device"],
        exact: false,
        refetchType: "all",
      });

      querClient.invalidateQueries({
        queryKey: ["user-timeline"],
        type: "all",
        refetchType: "all",
        exact: false,
      });

      toast.success("Asset assigned successfully");

      setLoading(false);
    }
    closeBtn(false);
  };

  return (
    <div className="flex flex-col h-full  w-full justify-between items-start px-3 space-y-4 gap-1 pb-2">
      <div className="w-full h-full space-y-4">
        <h1 className="font-gilroySemiBold text-xl w-full">Assigning to</h1>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-gilroyMedium">
            Select User<span className="text-red-500">*</span>
          </label>
          <AsyncSelect<User>
            fetcher={fetchUsers}
            preload
            queryKey="fetch-users"
            fixInputClear={false}
            renderOption={(user) => (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="font-gilroyMedium">{user?.first_name}</div>
                  <div className="text-xs font-gilroyRegular text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
              </div>
            )}
            filterFn={(user, query) =>
              user?.first_name?.toLowerCase()?.includes(query?.toLowerCase()) ||
              user?.email?.toLowerCase()?.includes(query?.toLowerCase())
            }
            getOptionValue={(user) => user?.email}
            getDisplayValue={() => (
              <div className="flex items-center gap-2 text-left w-full">
                <div className="flex flex-col leading-tight">
                  <div className="font-gilroyMedium">{user?.email ?? ""}</div>
                </div>
              </div>
            )}
            notFound={
              <div className="py-6 text-center font-gilroyMedium text-sm">
                No users found
              </div>
            }
            label="Select User"
            placeholder="Choose"
            value={user?.email || "null"}
            onChange={(selected: User | null) =>
              setUser({
                _id: selected?._id,
                first_name: selected?.first_name,
                email: selected?.email,
                employment_type: selected?.employment_type,
                designation: selected?.designation,
              })
            }
            width="100%"
          />
          {error?.length > 0 && (
            <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-[13px] font-gilroyMedium">
              Asset Type<span className="text-red-500">*</span>
            </label>
            <SelectDropdown
              value={formData.assetType}
              options={[
                { label: "Permanent", value: "Permanent" },
                { label: "Temporary", value: "Temporary" },
              ]}
              onSelect={(option: any) => {
                setFormData((prev) => ({ ...prev, assetType: option.value }));
              }}
              label=""
              // disabled={intData && true}
              seperator={false}
              placeholder="Choose"
            />
          </div>

          {formData?.assetType === "Temporary" && (
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[13px] font-gilroyMedium">
                Assigning Till<span className="text-red-500">*</span>
              </label>
              <FormField
                className="border border-input placeholder:text-gray-400"
                label=""
                id="assigningTill"
                name="assigningTill"
                value={formData.assignTill}
                type="date"
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    assignTill: e.target.value,
                  }));
                }}
                // error={errors?.purchaseDate}
                placeholder="DD/MM/YYYY"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 w-full  ">
        <Button
          variant="outlineTwo"
          className="w-full"
          onClick={() => {
            closeBtn(false);
          }}
        >
          Cancel
        </Button>

        <LoadingButton
          variant="primary"
          className="w-full"
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          loading={loading}
        >
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default AssignAssetsForm;
