import { AsyncSelect } from "@/components/ui/async-select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Device, fetchDevices } from "@/server/deviceActions";
import { fetchTeams, Team } from "@/server/teamActions";
import { fetchUsers, User } from "@/server/userActions";
import { UseFormReturn } from "react-hook-form";
import { UserFormTwoType } from "./validations";

export const NewUserFormTwo = ({
  userFormTwo,
  userFormTwoSubmit,
  error,
}: {
  userFormTwo: UseFormReturn<
    {
      designation?: string;
      emp_id?: string;
      onboarding_date?: Date;
      employment_type?: string;
      reporting_manager?: string;
      reporting_manager_id?: string;
      asset?: string;
      asset_id?: string;
      team?: string;
      team_id?: string;
    },
    any,
    {
      designation?: string;
      emp_id?: string;
      onboarding_date?: Date;
      employment_type?: string;
      reporting_manager?: string;
      reporting_manager_id?: string;
      asset?: string;
      asset_id?: string;
      team?: string;
      team_id?: string;
    }
  >;
  userFormTwoSubmit: (values: UserFormTwoType) => void;
  error: string;
}) => {
  return (
    <Form {...userFormTwo} key={"user-form-two"}>
      <form
        id="user-form-2"
        onSubmit={userFormTwo.handleSubmit(userFormTwoSubmit)}
        className="w-full flex flex-col gap-1"
      >
        <FormField
          control={userFormTwo.control}
          name="emp_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your employee id"
                  className="md:text-[13px] placeholder:text-sm"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={userFormTwo.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px]">
                Designation
                <span className="text-red-500 text-sm">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your designation"
                  className="md:text-[13px] placeholder:text-sm"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={userFormTwo.control}
              name="employment_type"
              render={({ field }) => (
                <FormItem className="font-gilroyMedium">
                  <FormLabel>
                    Employment Type
                    <span className="text-red-500 text-sm">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="justify-between text-[13px] gap-x-0.5 px-3">
                        <SelectValue placeholder="Select Employment Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-[13px] font-gilroyMedium">
                      <SelectItem
                        value="Full Time"
                        className=" text-[13px] rounded"
                      >
                        Full Time
                      </SelectItem>
                      <SelectItem
                        value="Internship"
                        className=" text-[13px] rounded"
                      >
                        Internship
                      </SelectItem>
                      <SelectItem
                        value="Part Time"
                        className=" text-[13px] rounded"
                      >
                        Part Time
                      </SelectItem>
                      <SelectItem
                        value="Contract"
                        className=" text-[13px] rounded"
                      >
                        Contract
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={userFormTwo.control}
              name="onboarding_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joined On</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      displayFormat={{ hour24: "dd/MM/yyyy" }}
                      value={field.value}
                      onChange={field.onChange}
                      granularity="day"
                      className="text-[13px]"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={userFormTwo.control}
          name="reporting_manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reporting Manager</FormLabel>
              <FormControl>
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
                  getDisplayValue={(user) => (
                    <div className="flex items-center gap-2 text-left w-full">
                      <div className="flex flex-col leading-tight">
                        <div className="font-gilroyMedium">{field?.value}</div>
                      </div>
                    </div>
                  )}
                  notFound={
                    <div className="py-6 text-center font-gilroyMedium text-sm">
                      No users found
                    </div>
                  }
                  label="User"
                  placeholder="Add Reporting Manager"
                  value={field.value || null}
                  onChange={(selected: User | null) => {
                    field.onChange(selected?.email);
                    userFormTwo.setValue("reporting_manager_id", selected?._id);
                  }}
                  className="text-[13px]"
                  triggerClassName="text-[13px]"
                  width="100%"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={userFormTwo.control}
          name="asset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Asset</FormLabel>
              <FormControl>
                <AsyncSelect<Device>
                  fetcher={fetchDevices}
                  queryKey="fetch-devices"
                  preload
                  renderOption={(asset) => (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="font-gilroyMedium">
                          {asset?.custom_model}
                        </div>
                        <div className="text-xs font-gilroyRegular text-muted-foreground">
                          {asset?.serial_no}
                        </div>
                      </div>
                    </div>
                  )}
                  filterFn={(device, query) =>
                    device?.custom_model
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase()) ||
                    device?.device_name
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase())
                  }
                  getOptionValue={(asset) => asset?.custom_model}
                  getDisplayValue={() => (
                    <div className="flex items-center gap-2 text-left w-full">
                      <div className="flex flex-col leading-tight">
                        <div className="font-gilroyMedium">{field?.value}</div>
                      </div>
                    </div>
                  )}
                  notFound={
                    <div className="py-6 text-center font-gilroyMedium text-sm">
                      No Assets found
                    </div>
                  }
                  label="Assets"
                  placeholder="Search Assets"
                  value={field?.value || null}
                  onChange={(selected: Device) => {
                    field.onChange(selected?.custom_model);
                    userFormTwo.setValue("asset_id", selected?._id);
                  }}
                  triggerClassName="text-[13px]"
                  width="100%"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={userFormTwo.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign team</FormLabel>
              <FormControl>
                <AsyncSelect<Team>
                  fetcher={fetchTeams}
                  queryKey="fetch-teams"
                  preload
                  renderOption={(team) => (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="font-gilroyMedium">{team?.title}</div>
                        <div className="text-xs font-gilroyRegular text-muted-foreground">
                          {team?.description}
                        </div>
                      </div>
                    </div>
                  )}
                  filterFn={(team, query) =>
                    team?.title
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase()) ||
                    team?.description
                      ?.toLowerCase()
                      ?.includes(query?.toLowerCase())
                  }
                  getOptionValue={(team) => team?.title}
                  getDisplayValue={(team) => (
                    <div className="flex items-center gap-2 text-left w-full">
                      <div className="flex flex-col leading-tight">
                        <div className="font-gilroyMedium">{field?.value}</div>
                      </div>
                    </div>
                  )}
                  notFound={
                    <div className="py-6 text-center font-gilroyMedium text-sm">
                      No teams found
                    </div>
                  }
                  label="Team"
                  placeholder="Search Teams"
                  value={field?.value || null}
                  onChange={(selected: Team) => {
                    field.onChange(selected?.title);
                    userFormTwo.setValue("team_id", selected?._id);
                  }}
                  width="100%"
                  triggerClassName="text-[13px]"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            "text-xs text-destructive/80 font-gilroyMedium",
            !error && "invisible"
          )}
        >
          {error}
        </div>
      </form>
    </Form>
  );
};
