import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import ListingBasicFields from "@/components/listing/ListingBasicFields";
import ListingCheckInFields from "@/components/listing/ListingCheckInFields";
import ListingRulesFields from "@/components/listing/ListingRulesFields";

interface ListingFormData {
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
}

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    address: "",
    airbnb_link: "",
    wifi_password: "",
    check_in: "",
    check_out: "",
    check_in_method: "",
    house_rules: [],
    before_you_leave: [],
    image_url: "",
  });

  const { isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          house_rules: data.house_rules || [],
          before_you_leave: data.before_you_leave || [],
        });
      }
      return data;
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      // Update the listing with the new image URL
      const { error: updateError } = await supabase
        .from("listings")
        .update({ image_url: publicUrl })
        .eq("id", id);

      if (updateError) throw updateError;

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
      // Convert newline-separated string to array
      const arrayValue = value.split("\n").filter((item: string) => item.trim());
      setFormData(prev => ({ ...prev, [field]: arrayValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAirbnbSync = async (data: any) => {
    try {
      const updateData = {
        ...data,
        image_url: data.image_url || formData.image_url,
        house_rules: Array.isArray(data.house_rules) ? data.house_rules : [],
      };

      const { error: updateError } = await supabase
        .from("listings")
        .update(updateData)
        .eq("id", id);

      if (updateError) throw updateError;

      setFormData(prev => ({ 
        ...prev, 
        ...updateData,
      }));
      
      toast.success("Listing updated with Airbnb data");
    } catch (error) {
      console.error("Error updating listing with Airbnb data:", error);
      toast.error("Failed to update listing with Airbnb data");
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({
          ...formData,
          house_rules: formData.house_rules.filter(rule => rule.trim()),
          before_you_leave: formData.before_you_leave.filter(rule => rule.trim()),
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Listing updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      
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
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}