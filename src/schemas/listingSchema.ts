import { z } from "zod"

export const listingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  wifi_password: z.string().optional(),
  check_in: z.string().min(1, "Check-in time is required"),
  check_out: z.string().min(1, "Check-out time is required"),
  house_rules: z.string().optional(),
})

export type ListingFormValues = z.infer<typeof listingFormSchema>