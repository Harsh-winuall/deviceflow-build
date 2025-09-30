import { UseFormReturn } from "react-hook-form";

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
import { fetchUsers, User } from "@/server/userActions";
import { otherFormType } from "./utils/validation";
import { Address } from "@/server/addressActions";
import { getAllLocation } from "@/server/deviceActions";

function OthersForm({
  othersForm,

  assignTo,
  OtherFormSubmit,
}: {
  othersForm: UseFormReturn<
    {
      serial_no?: string;
      asset_type?: string;
      assigning_till?: Date;
      currently_with?: string;
      currently_with_id?: string;
      asset_physical_location?: string;
      asset_physical_location_id?: string;
    },
    any,
    {
      serial_no?: string;
      asset_type?: string;
      assigning_till?: Date;
      currently_with?: string;
      currently_with_id?: string;
      asset_physical_location?: string;
      asset_physical_location_id?: string;
    }
  >;

  assignTo: string;
  OtherFormSubmit: (values: otherFormType) => void;
}) {
  const assetType = othersForm.watch("asset_type");
  return (
    <Form {...othersForm} key={"other-forms"}>
      <form
        onSubmit={othersForm.handleSubmit(OtherFormSubmit)}
        id="other-forms"
        className="flex flex-col w-full"
      >
        <div className="flex flex-col gap-4">
          <FormField
            name="serial_no"
            control={othersForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter"
                    type="text"
                    className="md:text-[13px] placeholder:text-sm font-gilroyMedium"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4 mt-1">
            <div className="flex-1">
              <FormField
                control={othersForm.control}
                name="asset_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="font-gilroyMedium md:text-[13px] justify-between">
                          <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-gilroyMedium md:text-[13px]">
                        <SelectItem
                          value="Temporary"
                          className="md:text-[13px]"
                        >
                          Temporary
                        </SelectItem>
                        <SelectItem
                          value="Permanent"
                          className="md:text-[13px]"
                        >
                          Permanent
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {assetType === "Temporary" && (
              <div className="flex-1">
                <FormField
                  control={othersForm.control}
                  name="assigning_till"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigning Till </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          displayFormat={{ hour24: "dd/MM/yyyy" }}
                          value={field.value}
                          onChange={field.onChange}
                          granularity="day"
                          className="md:text-[13px]"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {!assignTo && (
            <FormField
              control={othersForm.control}
              name="currently_with"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Currently with (Optional)</FormLabel>
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
                      label="Assigning To (Optional)"
                      placeholder="Choose"
                      value={field.value || null}
                      onChange={(selected: User | null) => {
                        field.onChange(selected?.email);
                        othersForm.setValue("currently_with", selected?.email);
                        othersForm.setValue("currently_with_id", selected?._id);
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
          )}

          {!assignTo && (
            <FormField
              control={othersForm.control}
              name="asset_physical_location"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Asset Physical Location (Optional)</FormLabel>
                  <FormControl>
                    <AsyncSelect<Address>
                      fetcher={getAllLocation}
                      queryKey="fetch-all-locations"
                      preload
                      renderOption={(location) => (
                        <div className="flex flex-col">
                          <div className="font-gilroyMedium">
                            {location?.location}
                          </div>
                          <div className="text-xs font-gilroyRegular text-muted-foreground">
                            {location?.address_type}
                          </div>
                        </div>
                      )}
                      filterFn={(location, query) =>
                        location?.location
                          ?.toLowerCase()
                          ?.includes(query?.toLowerCase()) ||
                        location?.address_type
                          ?.toLowerCase()
                          ?.includes(query?.toLowerCase())
                      }
                      getOptionValue={(location) => location?._id} // use unique _id instead
                      getDisplayValue={(location) => (
                        <div className="flex flex-col leading-tight">
                          <div className="font-gilroyMedium">{field.value}</div>
                        </div>
                      )}
                      notFound={
                        <div className="py-6 text-center font-gilroyMedium text-sm">
                          No location found
                        </div>
                      }
                      label="Choose"
                      placeholder="Choose"
                      value={field.value || null} // now field.value is the whole object
                      onChange={(selected) => {
                        field.onChange(selected);
                        othersForm.setValue(
                          "asset_physical_location",
                          selected.location
                        );
                        othersForm.setValue(
                          "asset_physical_location_id",
                          selected?._id
                        );
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
          )}
        </div>
      </form>
    </Form>
  );
}

export default OthersForm;
