import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

export const useListingForm = (id?: string, initialData: ListingFormData) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [newListingId, setNewListingId] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting form data:", formData);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const listingData = {
        ...formData,
        user_id: user.id,
        house_rules: Array.isArray(formData.house_rules) 
          ? formData.house_rules 
          : typeof formData.house_rules === 'string'
            ? formData.house_rules.split('\n').filter(rule => rule.trim())
            : [],
        before_you_leave: Array.isArray(formData.before_you_leave)
          ? formData.before_you_leave
          : typeof formData.before_you_leave === 'string'
            ? formData.before_you_leave.split('\n').filter(instruction => instruction.trim())
            : []
      };

      console.log("Prepared listing data:", listingData);

      const { data, error } = id
        ? await supabase
            .from("listings")
            .update(listingData)
            .eq("id", id)
            .select()
            .single()
        : await supabase
            .from("listings")
            .insert(listingData)
            .select()
            .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast.success(id ? "Listing updated successfully" : "Listing created successfully");
      
      if (data) {
        if (!id) {
          setNewListingId(data.id);
        }
        navigate(id ? "/" : `/welcome/${data.id}`);
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error(id ? "Failed to update listing" : "Failed to create listing");
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