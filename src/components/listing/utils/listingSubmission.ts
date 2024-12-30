import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const submitListing = async (listingData: any, id?: string) => {
  console.log("Submitting listing data:", listingData);

  if (id) {
    const { error } = await supabase
      .from("listings")
      .update(listingData)
      .eq("id", id);

    if (error) throw error;
    
    toast.success("Listing updated successfully");
    return null;
  } else {
    const { data, error } = await supabase
      .from("listings")
      .insert(listingData)
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      console.log("New listing created:", data);
      toast.success("Listing created successfully");
      return data.id;
    }
    return null;
  }
};