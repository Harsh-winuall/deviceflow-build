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
import { UseFormReturn } from "react-hook-form";
import { UserFormOneType } from "./validations";

export const NewUserFormOne = ({
  userFormOne,
  userFormOneSubmit,
}: {
  userFormOne: UseFormReturn<
    {
      first_name?: string;
      email?: string;
      phone?: string;
      dob?: Date;
      gender?: string;
    },
    any,
    {
      first_name?: string;
      email?: string;
      phone?: string;
      dob?: Date;
      gender?: string;
    }
  >;
  userFormOneSubmit: (values: UserFormOneType) => void;
}) => {
  return (
    <Form {...userFormOne} key={"user-form-onee"}>
      <form
        id="user-form-1"
        onSubmit={userFormOne.handleSubmit(userFormOneSubmit)}
        className="w-full flex flex-col gap-0"
      >
        <FormField
          control={userFormOne.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Full Name
                <span className="text-red-500 text-sm">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  type="text"
                  className="md:text-[13px] placeholder:text-sm font-gilroyMedium"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={userFormOne.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
                <span className="text-red-500 text-sm">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="md:text-[13px] placeholder:text-sm font-gilroyMedium"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={userFormOne.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Contact Number
                <span className="text-red-500 text-sm">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your contact number"
                  type="text"
                  maxLength={10}
                  className="md:text-[13px] placeholder:text-sm font-gilroyMedium"
                  value={field.value}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const phoneRegex = /^[0-9]{0,10}$/;

                    if (phoneRegex.test(inputValue)) {
                      field.onChange(inputValue);
                    }
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-6">
            <FormField
              control={userFormOne.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
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

          <div className="col-span-6">
            <FormField
              control={userFormOne.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="font-gilroyMedium md:text-[13px] justify-between">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-gilroyMedium md:text-[13px]">
                      <SelectItem value="Male" className="md:text-[13px]">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="md:text-[13px]">
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
