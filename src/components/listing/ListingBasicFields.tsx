import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddressAutocomplete from "../AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";

interface ListingBasicFieldsProps {
  formData: {
    title: string;
    address: string;
    image_url: string;
    airbnb_link?: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingBasicFields = ({ formData, onChange }: ListingBasicFieldsProps) => {
  const handleCrawlAirbnb = async () => {
    if (!formData.airbnb_link) {
      toast.error("Please enter an Airbnb listing URL");
      return;
    }

    try {
      console.log("Fetching Airbnb data for URL:", formData.airbnb_link);
      const { data, error } = await supabase.functions.invoke('fetch-airbnb-data', {
        body: { airbnbUrl: formData.airbnb_link }
      });

      if (error) throw error;

      console.log("Received Airbnb data:", data);
      
      // Update form fields with crawled data
      if (data.title) onChange("title", data.title);
      if (data.image_url) onChange("image_url", data.image_url);
      if (data.check_in) onChange("check_in", data.check_in);
      if (data.check_out) onChange("check_out", data.check_out);
      if (data.house_rules) onChange("house_rules", data.house_rules.join("\n"));
      
      toast.success("Successfully imported Airbnb listing data");
    } catch (error) {
      console.error("Error fetching Airbnb data:", error);
      toast.error("Failed to import Airbnb listing data");
    }
  };

  return (
    <>
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <AddressAutocomplete
          value={formData.address}
          onChange={(address) => onChange("address", address)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="airbnb_link" className="text-sm font-medium">
          Airbnb Listing URL
        </label>
        <div className="flex gap-2">
          <Input
            id="airbnb_link"
            value={formData.airbnb_link || ""}
            onChange={(e) => onChange("airbnb_link", e.target.value)}
            placeholder="https://www.airbnb.com/rooms/..."
            className="flex-1"
          />
          <Button 
            onClick={handleCrawlAirbnb}
            type="button"
            variant="outline"
          >
            Import Data
          </Button>
        </div>
      </div>
      <div>
        <label htmlFor="image_url" className="text-sm font-medium">
          Image URL
        </label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => onChange("image_url", e.target.value)}
          placeholder="Enter image URL"
        />
      </div>
    </>
  );
};

export default ListingBasicFields;