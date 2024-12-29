import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ListingBasicFields from "./ListingBasicFields";
import ListingCheckInFields from "./ListingCheckInFields";
import ListingRulesFields from "./ListingRulesFields";

interface EditListingFormProps {
  id?: string;
  initialData: {
    title: string;
    address: string;
    airbnb_link: string;
    wifi_password: string;
    check_in: string;
    check_out: string;
    check_in_method: string;
    house_rules: string[];
    before_you_leave: string[];
    image_url: string;
    user_id?: string;
  };
}

const EditListingForm = ({ id, initialData }: EditListingFormProps) => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${id || 'new'}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (field === "house_rules" || field === "before_you_leave") {
      const arrayValue = value.split("\n").filter((item: string) => item.trim());
      setFormData(prev => ({ ...prev, [field]: arrayValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAirbnbSync = async (data: any) => {
    try {
      setFormData(prev => ({ 
        ...prev, 
        ...data,
        image_url: data.image_url || prev.image_url,
        house_rules: Array.isArray(data.house_rules) ? data.house_rules : [],
        before_you_leave: Array.isArray(data.before_you_leave) ? data.before_you_leave : [],
      }));
      
      toast.success("Listing updated with Airbnb data");
    } catch (error) {
      console.error("Error updating listing with Airbnb data:", error);
      toast.error("Failed to update listing with Airbnb data");
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const listingData = {
        ...formData,
        user_id: user.id,
        house_rules: formData.house_rules.filter(rule => rule.trim()),
        before_you_leave: formData.before_you_leave.filter(rule => rule.trim()),
      };

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

      if (error) throw error;

      toast.success(id ? "Listing updated successfully" : "Listing created successfully");
      
      if (data) {
        navigate(id ? "/" : `/welcome/${data.id}`);
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error(id ? "Failed to update listing" : "Failed to create listing");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Listing Image</h2>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button 
                variant="outline" 
                disabled={isUploading}
                className="cursor-pointer"
                asChild
              >
                <span>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload listing image"}
                </span>
              </Button>
            </label>
          </div>
        </div>
        
        {formData.image_url && (
          <div className="w-full h-48 relative">
            <img
              src={formData.image_url}
              alt={formData.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <ListingBasicFields
        formData={formData}
        onChange={handleChange}
        onAirbnbSync={handleAirbnbSync}
      />
      
      <ListingCheckInFields
        formData={formData}
        onChange={handleChange}
      />
      
      <ListingRulesFields
        formData={formData}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {id ? "Save Changes" : "Create Listing"}
        </Button>
      </div>
    </div>
  );
};

export default EditListingForm;