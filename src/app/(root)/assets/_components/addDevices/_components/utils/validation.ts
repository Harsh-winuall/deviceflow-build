import z from "zod";

export const assetFormOneSchema = z.object({
  device_type: z.string().min(1, "Device Type is required"),
  device_name: z.string().optional(),
  device_id: z.string().optional(),
  assigning_to: z.string().optional(),
  assigning_to_id: z.string().optional(),
  attach_asset_to: z.string().optional(),
  attach_asset_to_id: z.string().optional(),
});

export type assetFormOneType = z.infer<typeof assetFormOneSchema>;

export const licenseFormSchema = z
  .object({
    license_name: z.string().min(1, "License Name is required"),
    license_name_id: z.string().optional(),
    license_keys: z.string().min(1, "License keys are required"),
    pricing_model: z.string().min(1, "Pricing Model is required"),
    billing_cycle: z.string().optional(),
    billing_price: z.number(),

    purchased_on: z
      .date()
      .optional()
      .refine((date) => !date || date <= new Date(), {
        message: "Purchase date cannot be in the future",
      }),

    valid_till: z.date().optional(),
  })
  // cross-field validation
  .refine(
    (data) =>
      !data.purchased_on || // no purchase date → skip check
      !data.valid_till || // no valid till → skip check
      data.valid_till >= data.purchased_on, // both exist → compare
    {
      message: "Validity date cannot be before purchase date",
      path: ["valid_till"], // show error under "valid_till" field
    }
  );

export type licenseFormType = z.infer<typeof licenseFormSchema>;

export const laptopFormOneSchema = z.object({
  os: z.string().min(1, "Field is required"),
  brand: z.string().optional(),
  model_name: z.string().min(1, "Field is required"),
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  condition: z.string().optional(),
});

export type laptopFormOneType = z.infer<typeof laptopFormOneSchema>;

export const laptopFormTwoSchema = z
  .object({
    serial_no: z.string().min(1, "Serial number is required"),
    asset_type: z.string().min(1, "Device type is required"),
    assigning_till: z.date().optional(),
    purchased_on: z
      .date()
      .optional()
      .refine((date) => !date || date <= new Date(), {
        message: "Purchase date cannot be in the future",
      }),

    warranty_end_date: z.date().optional(),

    currently_with: z.string().optional(),
    currently_with_id: z.string().optional(),
    installed_software: z.string().optional(),
    installed_software_id: z.string().optional(),
    asset_physical_location: z.string().optional(),
    asset_physical_location_id: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.purchased_on ||
      !data.warranty_end_date ||
      data.warranty_end_date >= data.purchased_on,
    {
      message: "Warranty date cannot be before purchase date",
      path: ["warranty_end_date"], // attach error to warranty_end_date field
    }
  );
export type laptopFormTwoType = z.infer<typeof laptopFormTwoSchema>;

export const mobileFormSchema = z.object({
  os: z.string().min(1, "OS is required"),
  brand: z.string().min(1, "Brand is required"),
  model_name: z.string().min(1, "Model Name is required"),
  processor: z.string().optional(),
  ram: z.string().min(1, "Ram is required"),
  storage: z.string().optional(),
  condition: z.string().optional(),
});

export type mobileFormType = z.infer<typeof mobileFormSchema>;

export const otherFormSchema = z.object({
  serial_no: z.string().min(1, "Serial number is required"),
  asset_type: z.string().min(1, "Field is required"),
  assigning_till: z.date().optional(),
  currently_with: z.string().optional(),
  currently_with_id: z.string().optional(),

  asset_physical_location: z.string().optional(),
  asset_physical_location_id: z.string().optional(),
});
export type otherFormType = z.infer<typeof otherFormSchema>;
