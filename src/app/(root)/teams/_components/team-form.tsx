"use client";

import { Button, LoadingButton } from "@/components/buttons/Button";
import { Input } from "@/components/inputs/Input";
import { AsyncSelect } from "@/components/ui/async-select";
import { useAlert } from "@/hooks/useAlert";
import { cn } from "@/lib/utils";
import { createTeam, updateTeam } from "@/server/teamActions";
import { fetchUsers, User } from "@/server/userActions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const TeamForm = ({
  closeBtn,
  manager,
  isEditForm,
  id,
  setBack,
  title,
}: {
  closeBtn: (value: boolean) => void;

  setBack?: () => void;
  manager?: any;
  isEditForm?: boolean;
  id?: string;
  title?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");

  const { showAlert } = useAlert();

  const queryClient = useQueryClient();
  useEffect(() => {
    if (isEditForm) {
      setUser(manager?.[0] || null);
      setFormData({
        title: title || "",
        user: manager?.[0]?._id || "",
      });
    } else {
      setUser(null);
      setFormData({ title: "", user: "" });
    }
  }, [isEditForm, manager, title]);
  // Local state for form data
  const [formData, setFormData] = useState({
    title: "",

    user: "",
  });

  const [errors, setErrors] = useState({
    title: "",

    user: "",
  });

  // Function to handle form submission
  const handleSubmit = async () => {
    // Manual validation
    const newErrors = {
      title: formData.title ? "" : "Team name is required",

      user: user?._id ? "" : "Reporting manager is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    if (isEditForm) {
      setLoading(true);
      try {
        // @ts-ignore
        await updateTeam(id!, {
          title: formData.title!,

          userId: user?._id,
        });

        setLoading(false);
        queryClient.invalidateQueries({
          queryKey: ["teams"],
          exact: false,
          type: "all",
          refetchType: "all",
        });
        toast.success("Team updated successfully !");
        // router.refresh();
        closeBtn(false);
      } catch (error: any) {
        closeBtn(false);
        showAlert({
          title: "Can't update team",
          description: "Error updating team !",
          isFailure: true,
          key: "update-team-failure",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await createTeam(
          formData?.title,

          user?._id
        );

        showAlert({
          title: "WOHOOO!! 🎉",
          description: "Team created successfully !",
          isFailure: false,
          key: "create-team-success",
        });
        setLoading(false);
        setBack && setBack();
        closeBtn(false);
        queryClient.invalidateQueries({
          queryKey: ["teams"],
          exact: false,
          type: "all",
          refetchType: "all",
        });
      } catch (error: any) {
        closeBtn(false);
        showAlert({
          title: "Can't create team",
          description: "Error creating team !",
          isFailure: true,
          key: "create-team-failure",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="p-4  w-full hide-scrollbar overflow-y-auto ">
        <div className="flex flex-col ">
          <h3 className="text-lg font-gilroySemiBold w-full text-start">
            {isEditForm ? "Edit Team" : "Create new team"}
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col w-full gap-4"
          >
            <div className="">
              <label
                htmlFor="team-name"
                className="text-[13px] font-gilroyMedium"
              >
                Team Name
              </label>
              <Input
                id="team-name"
                className={cn(
                  errors.title
                    ? "border-destructive/80 font-gilroyMedium  focus-visible:border-destructive/80 focus-visible:ring-destructive/0 h-10"
                    : "h-10"
                )}
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter"
                type="text"
              />
              {errors.title && (
                <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="w-full ">
              <label
                htmlFor="manager"
                className="text-[13px] font-gilroyMedium"
              >
                Reporting Manager
              </label>
              <AsyncSelect<User>
                fetcher={fetchUsers}
                queryKey="fetch-users"
                preload
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
                filterFn={(user, query) =>
                  user?.first_name
                    ?.toLowerCase()
                    ?.includes(query?.toLowerCase()) ||
                  user?.email?.toLowerCase()?.includes(query?.toLowerCase())
                }
                getOptionValue={(user) => user?.email}
                getDisplayValue={(selected) => (
                  <div className="flex items-center gap-2 text-left w-full">
                    <div className="flex flex-col leading-tight">
                      <div className="text-xs text-muted-foreground">
                        {selected?.email}
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
                placeholder="Choose a Manager.."
                value={user || null}
                onChange={(selected: User | null) => {
                  setUser({
                    _id: selected?._id,
                    first_name: selected?.first_name,
                    email: selected?.email,
                    employment_type: selected?.employment_type,
                    designation: selected?.designation,
                  });
                }}
                width="100%"
                triggerClassName="border border-black "
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                className="w-1/2 rounded-[5px]"
                variant="outlineTwo"
                onClick={() => {
                  setBack ? setBack() : closeBtn(false);
                }}
              >
                Cancel
              </Button>

              <LoadingButton
                loading={loading}
                variant="primary"
                className="w-1/2 rounded-[5px]"
                type="submit"
              >
                {isEditForm ? "Save" : "Submit"}
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
