import {
  addNewLocations,
  Location,
  updateSingleLocation,
} from "@/server/settingActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, LoadingButton } from "../buttons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const schema = z.object({
  label: z.string().min(1, "Label is Required"),
  location: z.string().min(1, "Location is Required"),
  address_type: z.string().min(1, "Address type is Required"),
});

type LocationForm = z.infer<typeof schema>;

function AddNewLocation({
  children,
  isEdit,
  locationData,
}: {
  children?: React.ReactNode;
  isEdit?: boolean;
  locationData?: Location;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<LocationForm>({
    defaultValues: isEdit
      ? {
          label: locationData.label,
          location: locationData.location,
          address_type: locationData.address_type,
        }
      : {
          label: "",
          location: "",
          address_type: undefined,
        },
    resolver: zodResolver(schema),
  });

  const addLocationMutation = useMutation({
    mutationFn: isEdit ? updateSingleLocation : addNewLocations,
    onSuccess: () => {
      toast.success(
        isEdit ? "Location updated successfully" : "Location added successfully"
      );
      queryClient.invalidateQueries({
        queryKey: ["all-locations"],
        refetchType: "all",
        exact: false,
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error(
        isEdit ? "Failed to update location" : "Unable to add location"
      );
    },
  });

  const handleSubmit = (data: LocationForm) => {
    if (isEdit) {
      addLocationMutation.mutate({
        locationId: locationData?._id,
        ...data, // Use updated values from form
      });
    } else {
      addLocationMutation.mutate(data);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="rounded-lg max-w-md p-4 min-h-[35vh]">
          <DialogTitle className="   text-start">
            {isEdit ? "Update Location" : "Add New Location"}
          </DialogTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Shelf No: 1, Room No: 5, 6th Floor"
                      />
                    </FormControl>
                    <FormMessage className="invisible" />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 items-center w-full">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="w-1/2 ">
                      <FormLabel>Label*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Home, Office" />
                      </FormControl>
                      <FormMessage className="invisible" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address_type"
                  render={({ field }) => (
                    <FormItem className="w-1/2 ">
                      <FormLabel>Address Type*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="font-gilroyMedium w-full text-xs justify-between">
                            <SelectValue placeholder="Select Address Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="font-gilroyMedium md:text-[13px]">
                          <SelectItem
                            value="default"
                            className="md:text-[13px]"
                          >
                            Default Address
                          </SelectItem>
                          <SelectItem
                            value="secondary"
                            className="md:text-[13px]"
                          >
                            Secondary Address
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="invisible" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-1/2 text-[13px]"
                    variant="outlineTwo"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <LoadingButton
                  type="submit"
                  variant="primary"
                  className="w-1/2 text-[13px]"
                >
                  {isEdit ? "Update" : "Done"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddNewLocation;
