import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { transformListingData } from "./utils/listingDataTransform";
import { submitListing } from "./utils/listingSubmission";

interface ListingFormData {
  title: string;
  address: string;
  wifi_password: string;
  wifi_network: string;
  check_in: string;
  check_in_instructions: string;
  check_in_method: string;
  check_out: string;
  house_rules: string[] | string;
  before_you_leave: string[] | string;
  image_url: string;
  directions: string;
  host_name: string;
  host_about: string;
  host_email: string;
  host_phone: string;
  user_id?: string;
}

const DEFAULT_LISTING_IMAGE = "/lovable-uploads/d84dafa0-a313-48d6-8f0e-49bf9a103ba9.png";

export const useListingForm = (initialData: ListingFormData, id?: string) => {
  const [formData, setFormData] = useState({
    ...initialData,
    image_url: initialData.image_url || DEFAULT_LISTING_IMAGE
  });
  const [newListingId, setNewListingId] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const listingData = transformListingData(formData, user.id);
      const newId = await submitListing(listingData, id);
      
      if (newId) {
        setNewListingId(newId);
        return newId;
      }
      
      return id;
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error(id ? "Failed to update listing" : "Failed to create listing");
      return null;
    }
  };

  const currentListingId = id || newListingId;

  return {
    formData,
    handleChange,
    handleSubmit,
    currentListingId
  };
};