"use client";
import { GetAvatar } from "@/components/get-avatar";
import TabBar from "@/components/TabBar/tabbar";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { userActivityLog } from "@/server/activityActions";
import {
  fetchUsers,
  NewUserResponse,
  updateUser,
  User,
} from "@/server/userActions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert02Icon,
  Calendar03Icon,
  Call02Icon,
  CheeseCake02Icon,
  PencilEdit01Icon,
  Mail01Icon,
  Tag01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Dropdown from "../../assets/[id]/_components/accordian";
import UserTicketsTable from "./_components/user-table-data";
import UserTimelineTable from "./_components/user-timeline-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Button } from "@/components/buttons/Button";
import { AltIntegration } from "../../integrations/_components/icons";
import { designations } from "../_components/helper/utils";
import { AsyncSelect } from "@/components/ui/async-select";

const editUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().min(10).optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  dob: z.date().optional(),
  reporting_manager: z.string().optional(),
  reporting_manager_id: z.string().optional(),
  designation: z.string().optional(),
});

function UserMain({ user }: { user: NewUserResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const sections = [
    {
      key: "subscriptions",
      show: user?.subscriptions?.filter((item) => item?.price > 0)?.length > 0,
    },
    {
      key: "devices",
      show: user?.devices?.length > 0,
    },
    {
      key: "about",
      show: true,
    },
    {
      key: "teams",
      show: !!user?.team,
    },
  ];

  const { data: userTimeLineData, status } = useQuery({
    queryKey: ["user-timeline", user?._id],
    queryFn: () => userActivityLog(user?._id),
    enabled: !!user?._id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const openTicketsCount = useMemo(() => {
    return (
      user?.tickets?.filter(
        (ticket) => ticket?.status?.toLowerCase() === "open"
      ).length || 0
    );
  }, [user?.tickets]);

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: "timeline",
        label: "Activity log",
        content: <UserTimelineTable data={userTimeLineData} />,
      },
      {
        id: "tickets",
        label: "Tickets",
        content: <UserTicketsTable data={user?.tickets} />,
        ...(openTicketsCount > 0 ? { number: openTicketsCount } : {}),
      },
    ];

    return baseTabs;
  }, [userTimeLineData, user?.tickets, openTicketsCount]);

  const firstVisibleSection = sections.find((s) => s.show)?.key;

  const editUserMutation = useMutation({
    mutationFn: (input: { id: string; user: User }) =>
      updateUser(input.id, input.user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-user-by-id", user?._id],
        type: "all",
      });
      setIsEditing(false);
      toast.success("User details updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const form = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      dob: user?.date_of_birth ? new Date(user?.date_of_birth) : undefined,
      name: user?.first_name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      gender: user?.gender ?? "",
      reporting_manager: user?.reporting_manager?.first_name ?? "",
      reporting_manager_id: user?.reporting_manager?._id ?? "",
      designation: user?.designation ?? "",
    },
  });

  const { control, register, watch, getValues, formState, reset } = form;

  const handleEditSaveClick = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the validation errors before saving.");
      return;
    }

    const newData = getValues();
    const originalData = {
      email: user?.email ?? "",
      designation: user?.designation,
      phone: user?.phone ?? "",
      name: user?.first_name ?? "",
      gender: user?.gender ?? "",
      reporting_manager: user?.reporting_manager?.first_name ?? "",
      reporting_manager_id: user?.reporting_manager?._id ?? "",
      dob: user?.date_of_birth ? new Date(user.date_of_birth) : undefined,
    };

    // Compare original and new values
    const hasChanges = Object.keys(originalData).some((key) => {
      const newVal = newData[key];
      const oldVal = originalData[key];
      return newVal instanceof Date && oldVal instanceof Date
        ? newVal.getTime() !== oldVal.getTime()
        : newVal !== oldVal;
    });

    if (hasChanges) {
      editUserMutation.mutate({
        id: user._id,
        user: {
          email: newData.email,
          first_name: newData.name,
          designation: newData.designation,
          phone: newData.phone,
          gender: newData.gender,
          date_of_birth: newData?.dob ? new Date(newData?.dob) : null,
          reporting_manager: newData.reporting_manager_id,
        },
      });
    } else {
      toast.info("No changes made");
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        email: user.email ?? "",
        name: user.first_name ?? "",
        phone: user.phone ?? "",
        designation: user?.designation ?? "",
        reporting_manager: user?.reporting_manager?.first_name ?? "",
        reporting_manager_id: user?.reporting_manager?._id ?? "",
        gender: user.gender ?? "Male",
        dob: user.date_of_birth ? new Date(user.date_of_birth) : "", // required format for <input type="date">
      });
    }
  }, [user, reset]);

  return (
    <div className="rounded-[10px] flex h-[80vh] my-4 border border-[#0000001A] bg-white overflow-hidden ">
      {/* {JSON.stringify(user)} */}
      <div className="w-[40%] h-full hide-scrollbar border border-r border-l-0 border-t-0 border-b-0 border-[rgba(0, 0, 0, 0.05)] overflow-y-auto">
        <div className="p-6 flex flex-col gap-6 mb-6">
          <div className="flex  gap-3 items-center">
            <GetAvatar name={user?.first_name} size={60} />
            <div className="flex flex-col gap-0.5">
              <h1 className="font-gilroySemiBold text-lg">
                {user?.first_name ?? "-"}{" "}
                {user?.deleted_at === null ? (
                  <Badge className="bg-[#ECFDF3] text-[#027A48]">Active</Badge>
                ) : (
                  <Badge className="bg-[#FFEFEF] text-[#FF0000]">
                    Inactive
                  </Badge>
                )}
              </h1>
              <h3 className="capitalize text-[15px] text-gray-600 font-gilroyMedium">
                {user?.designation ?? "-"}
              </h3>
            </div>
          </div>
          <div className="">
            <div className="flex gap-3">
              {user?.onboarding_date ? (
                <h1 className="text-[15px] text-black items-center text-nowrap font-gilroyMedium flex gap-2">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    className="text-[#808080] size-4"
                  />
                  Joined on
                  <span className="pl-[1px]">
                    {user?.onboarding_date
                      ? new Date(user.onboarding_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not available"}
                  </span>
                </h1>
              ) : null}

              {user?.employment_type ? (
                <h1 className="text-[15px] text-black  items-center font-gilroyMedium flex gap-2">
                  <HugeiconsIcon
                    icon={Tag01Icon}
                    className="text-[#808080] size-4"
                  />{" "}
                  {user?.employment_type ?? "-"}
                </h1>
              ) : null}
            </div>
            <h1 className="text-[15px] text-gray-600 mt-3  items-center font-gilroyMedium flex gap-2">
              <HugeiconsIcon
                icon={User03Icon}
                className="text-[#808080] size-4"
              />
              Reporting Manager:{" "}
              <span className="text-black capitalize">
                {user?.reporting_manager?.first_name ?? "Not available"}
              </span>
            </h1>
          </div>

          {/* Subscriptions */}
          {user?.subscriptions?.filter((item) => item?.platform)?.length >
            0 && (
            <Dropdown
              onFirst={firstVisibleSection === "subscriptions"}
              title="Subscriptions"
              headerClassName="bg-[#F6F6F6]"
              contentClassName="h-full"
            >
              <div className="flex flex-col gap-3 w-full min-h-0 h-full max-h-[12rem] overflow-y-auto hide-scrollbar mb-1">
                {user?.subscriptions
                  ?.filter((item) => item?.platform)
                  ?.map((item) => (
                    <Link
                      href={`/integrations/installed/${item?.platform}`}
                      key={item?.id}
                    >
                      <div className="border-gray-200 border hover:border-black p-3 flex justify-between items-center rounded-md">
                        <div className="flex gap-2 items-center">
                          {/* <img
                            src={item?.image}
                            alt={item?.platform}
                            className="size-10 rounded"
                          /> */}
                          {item?.image ? (
                            <img
                              src={item.image ?? ""}
                              className=" rounded size-10 "
                              alt={item?.platform}
                            />
                          ) : (
                            <div className="bg-[#D4E9FF80] rounded-[16px] flex justify-center items-center p-1.5">
                              <AltIntegration className={"size-10"} />
                            </div>
                          )}
                          <div>
                            <h1 className="text-[15px] font-gilroyMedium">
                              {item?.platform}
                            </h1>
                            {/* <h3 className="text-gray-600 text-xs font-gilroyMedium line-clamp-1">
                              {item?.description}
                            </h3> */}
                          </div>
                        </div>

                        {item?.perSeat === false ? (
                          <Badge className="w-fit ring-1 text-sm ring-green-800 rounded cursor-pointer font-gilroyMedium text-green-900 bg-white">
                            Central
                          </Badge>
                        ) : (
                          <span className="w-fit px-2 ring-1 text-sm ring-green-800 rounded py-0.5 cursor-pointer font-gilroyMedium text-green-900 bg-white">
                            ₹
                            {Array.isArray(item?.pricePerSeat)
                              ? formatNumber(
                                  parseInt(
                                    item.pricePerSeat[0]?.pricePerSeat || "0"
                                  )
                                )
                              : formatNumber(item?.pricePerSeat ?? 0)}
                            /month
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            </Dropdown>
          )}

          {/* Assigned Assets */}
          {user?.devices?.length > 0 && (
            <Dropdown
              onFirst={firstVisibleSection === "devices"}
              title="Assigned Assets"
              headerClassName="bg-[#F6F6F6]"
            >
              <div className="flex flex-col gap-2 mb-1">
                {user?.devices?.map((item) => (
                  <Link href={`/assets/${item?._id}`} key={item?._id}>
                    <div className="flex flex-col gap-3 w-full mb-1 cursor-pointer">
                      <div className="border-gray-200 hover:border-black  border p-3 flex justify-between items-center rounded-md">
                        <div className="flex gap-2">
                          <GetAvatar
                            name={item?.device_name || item?.custom_model}
                            size={40}
                            isDeviceAvatar
                          />
                          <div>
                            <h1 className="text-[15px] font-gilroyMedium">
                              {item?.device_name || item?.custom_model}
                            </h1>
                            <h3 className="text-gray-600 text-xs font-gilroyMedium">
                              {[
                                item?.serial_no?.trim(),
                                item?.ram?.trim(),
                                Array.isArray(item?.storage) &&
                                item?.storage.length > 0
                                  ? item?.storage.join(" / ")
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(" | ")}
                            </h3>
                          </div>
                        </div>

                        {item.issues?.length > 0 && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/tickets");
                            }}
                            className="font-gilroySemiBold flex items-center justify-center gap-1 text-xs rounded-sm h-fit hover:bg-gray-100 hover:rounded-md p-1 text-[#FF0000]"
                          >
                            <HugeiconsIcon
                              icon={Alert02Icon}
                              className="text-[#FF0000] size-5"
                            />
                            {item.issues.length}{" "}
                            {item.issues.length === 1 ? "issue" : "issues"}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Dropdown>
          )}

          <div className={`rounded-lg overflow-hidden`}>
            <div
              className={`flex justify-between items-center px-3 py-3 h-11 transition-colors bg-[#F6F6F6] rounded-lg `}
            >
              <div className="flex items-center select-none gap-2">
                <h3 className="font-gilroyMedium text-sm text-black leading-[18.952px]">
                  {"About"}
                </h3>

                {!isEditing && (
                  <HugeiconsIcon
                    icon={PencilEdit01Icon}
                    className="size-4 text-[#0051FF] cursor-pointer"
                    onClick={() => {
                      if (!isAboutOpen) {
                        setIsAboutOpen(true);
                      }
                      setIsEditing((prev) => !prev);
                    }}
                  />
                )}
              </div>
              {isEditing && (
                <div className="flex gap-1 select-none items-center">
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="p-0.5 px-1 rounded border h-fit w-fit text-black text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleEditSaveClick()}
                    className="p-0.5 px-1 rounded bg-[#008910] text-white border h-fit w-fit text-xs"
                  >
                    Save
                  </Button>
                </div>
              )}

              {!isEditing &&
                (isAboutOpen ? (
                  <ChevronUp
                    className="w-5 h-5 text-[#BFBFBF] cursor-pointer"
                    onClick={() => setIsAboutOpen((prev) => !prev)}
                  />
                ) : (
                  <ChevronDown
                    className="w-5 h-5 text-[#BFBFBF] cursor-pointer"
                    onClick={() => setIsAboutOpen((prev) => !prev)}
                  />
                ))}
            </div>

            <div
              className={`transition-all duration-300 linear overflow-hidden ${
                isAboutOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <FormProvider {...form}>
                <div className={`mt-3 bg-white `}>
                  <div className="space-y-3 mt-5 font-gilroyMedium">
                    {isEditing && (
                      <>
                        <div className="flex  items-center pl-3">
                          <div className="flex gap-3">
                            <HugeiconsIcon
                              icon={Mail01Icon}
                              className="text-[#a09f9f] size-4"
                            />
                            <span className="text-[#a09f9f] min-w-28 text-sm">
                              Name:
                            </span>
                          </div>
                          <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                              <input
                                name="name"
                                type="text"
                                className={cn(
                                  "text-sm font-gilroyMedium text-[13px] w-56 rounded px-1.5 py-0.5 focus:outline-none",
                                  isEditing
                                    ? "border text-[13px]"
                                    : "border-transparent",
                                  formState.errors.name &&
                                    "border-destructive/80"
                                )}
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <div className="flex  items-center pl-3">
                          <div className="flex gap-3">
                            <HugeiconsIcon
                              icon={Mail01Icon}
                              className="text-[#a09f9f] size-4"
                            />
                            <span className="text-[#a09f9f] min-w-28 text-sm">
                              Designation:
                            </span>
                          </div>
                          <Controller
                            name="designation"
                            control={control}
                            render={({ field }) => (
                              <input
                                name="designation"
                                type="text"
                                className={cn(
                                  "text-sm font-gilroyMedium text-[13px] w-56 rounded px-1.5 py-0.5 focus:outline-none",
                                  isEditing
                                    ? "border text-[13px]"
                                    : "border-transparent",
                                  formState.errors.designation &&
                                    "border-destructive/80"
                                )}
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <div className="flex items-center pl-3">
                          <div className="flex gap-3">
                            <HugeiconsIcon
                              icon={User03Icon}
                              className="text-[#a09f9f] size-4"
                            />
                            <span className="text-[#a09f9f] min-w-28 text-sm">
                              Manager:
                            </span>
                          </div>
                          <Controller
                            name="reporting_manager"
                            control={control}
                            render={({ field }) => (
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
                                  user?.email
                                    ?.toLowerCase()
                                    ?.includes(query?.toLowerCase())
                                }
                                getOptionValue={(user) => user?.email}
                                getDisplayValue={(user) => (
                                  <div className="flex items-center gap-2 text-left w-full">
                                    <div className="flex flex-col leading-tight">
                                      <div className="font-gilroyMedium">
                                        {field?.value}
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
                                placeholder={
                                  user?.reporting_manager?.first_name
                                }
                                value={field.value || null}
                                onChange={(selected: User | null) => {
                                  field.onChange(selected?.email);
                                  form.setValue(
                                    "reporting_manager_id",
                                    selected?._id
                                  );
                                }}
                                className="text-[13px] p-0 "
                                triggerClassName="text-[13px] w-80 hover:bg-transparent hover:text-black text-black px-1 py-0.5 h-[25px] rounded"
                              />
                            )}
                          />
                        </div>
                      </>
                    )}
                    <div className="flex  items-center pl-3">
                      <div className="flex gap-3">
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          className="text-[#a09f9f] size-4"
                        />
                        <span className="text-[#a09f9f] min-w-28 text-sm">
                          Email:
                        </span>
                      </div>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <input
                            name="email"
                            type="text"
                            readOnly={true}
                            className={cn(
                              "text-sm font-gilroyMedium text-[13px] w-56 rounded px-1.5 py-0.5 focus:outline-none",
                              isEditing
                                ? " text-[13px]"
                                : " border-transparent",
                              formState.errors.email && "border-destructive/80"
                            )}
                            {...field}
                          />
                        )}
                      />
                    </div>

                    <div className="flex  items-center pl-3">
                      <div className="flex gap-3">
                        <HugeiconsIcon
                          icon={Call02Icon}
                          className="text-[#a09f9f] size-4"
                        />
                        <span className="text-[#a09f9f] min-w-28 text-sm">
                          Phone:
                        </span>
                      </div>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            readOnly={!isEditing}
                            className={cn(
                              "text-sm font-gilroyMedium text-[13px]  rounded px-1.5 py-0.5 focus:outline-none",
                              isEditing
                                ? "border text-[13px]"
                                : "border border-transparent",
                              formState.errors.phone && "border-destructive/80"
                            )}
                            value={field.value}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const phoneRegex = /^[0-9]{0,10}$/;

                              if (phoneRegex.test(inputValue)) {
                                field.onChange(inputValue);
                              }
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="flex items-center pl-3">
                      <div className="flex gap-3">
                        {" "}
                        <HugeiconsIcon
                          icon={User03Icon}
                          className="text-[#a09f9f] size-4"
                        />
                        <span className="text-[#a09f9f] min-w-28 text-sm">
                          Gender:
                        </span>
                      </div>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              showArrow={isEditing}
                              className={cn(
                                "m-0 h-fit rounded text-[13px] [&_svg]:size-3 disabled:text-black px-1.5 py-0.5 w-fit",
                                isEditing
                                  ? "border"
                                  : "border border-transparent pointer-events-none",
                                formState.errors.gender &&
                                  "border-destructive/80"
                              )}
                            >
                              <SelectValue className="disabled:text-black" />
                            </SelectTrigger>
                            <SelectContent className="p-0 m-0 w-fit min-w-0 max-w-fit font-gilroyMedium">
                              <SelectItem
                                value="Male"
                                className="p-0.5 px-1 rounded text-[13px]"
                              >
                                Male
                              </SelectItem>
                              <SelectItem
                                value="Female"
                                className="p-0.5 px-1 rounded  text-[13px]"
                              >
                                Female
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="flex items-center pl-3">
                      <div className="flex gap-3">
                        <HugeiconsIcon
                          icon={CheeseCake02Icon}
                          className="text-[#a09f9f] size-4"
                        />
                        <span className="text-[#a09f9f] min-w-28 text-sm">
                          DOB:
                        </span>
                      </div>
                      <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            showIcon={false}
                            displayFormat={{ hour24: "dd/MM/yyyy" }}
                            value={field.value}
                            onChange={field.onChange}
                            granularity="day"
                            className={cn(
                              "md:text-[13px] h-fit px-1.5  py-0.5 rounded m-0 w-fit min-w-0",
                              isEditing
                                ? "border"
                                : "border border-transparent pointer-events-none",
                              formState.errors.dob && "border-destructive/80"
                            )}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </FormProvider>
            </div>
          </div>

          {user?.team && (
            <Dropdown
              onFirst={firstVisibleSection === "teams"}
              title="Teams"
              headerClassName="bg-[#F6F6F6]"
            >
              <div className="flex flex-col gap-3 w-full mb-4">
                <Link href={`/teams/${user?.team?._id}`}>
                  <div className="border-gray-200 hover:border-black cursor-pointer border p-3 flex justify-between items-center rounded-md">
                    <div className="flex gap-2">
                      <GetAvatar name={user?.team?.title} />
                      <div>
                        <h1 className="text-[15px] font-gilroyMedium">
                          {user?.team?.title}
                        </h1>
                        <h3 className="text-gray-600 text-xs font-gilroyMedium">
                          {user?.team?.userCount}{" "}
                          <span className="pl-1">
                            {user?.team?.userCount === 1 ? "member" : "members"}
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="w-[60%] h-full overflow-y-auto ">
        <h1 className="font-gilroySemiBold text-lg px-6 pt-6 pb-2">Overview</h1>
        <TabBar
          tabs={tabs}
          status={status}
          defaultActiveTab="timeline"
          className="mb-6"
          tabClassName="px-3 text-sm"
          activeTabClassName="font-gilroySemiBold"
        />
      </div>
    </div>
  );
}

export default memo(UserMain);
