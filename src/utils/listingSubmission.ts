import { supabase } from "@/integrations/supabase/client"
import type { ListingFormValues } from "@/schemas/listingSchema"

export const submitListing = async (values: ListingFormValues, userId: string) => {
  console.log("Submitting new listing:", values)
  
  const listingData = {
    title: values.title,
    address: values.address,
    wifi_password: values.wifi_password || null,
    check_in: values.check_in,
    check_out: values.check_out,
    house_rules: values.house_rules ? values.house_rules.split('\n').filter(rule => rule.trim()) : [],
    user_id: userId,
  }

  const { data, error } = await supabase
    .from("listings")
    .insert(listingData)
    .select()
    .single()

  if (error) throw error
  return data
}