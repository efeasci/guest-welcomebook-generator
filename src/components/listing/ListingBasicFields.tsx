import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ListingBasicFieldsProps {
  formData: {
    title: string;
    address: string;
    airbnb_link: string;
    image_url: string;
  };
  onChange: (field: string, value: string) => void;
  onAirbnbSync?: (data: any) => void;
}

const ListingBasicFields = ({ formData, onChange, onAirbnbSync }: ListingBasicFieldsProps) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAirbnbSync = async () => {
    if (!formData.airbnb_link) {
      toast.error("Please enter an Airbnb listing URL first");
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch(
        "https://erfmwrjrkcgachhlvxwn.functions.supabase.co/fetch-airbnb-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ airbnbUrl: formData.airbnb_link }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Airbnb data");
      }

      const data = await response.json();
      onAirbnbSync?.(data);
      toast.success("Successfully synced Airbnb listing data");
    } catch (error) {
      console.error("Error syncing Airbnb data:", error);
      toast.error("Failed to sync Airbnb listing data");
    } finally {
      setIsSyncing(false);
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
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onChange("address", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="airbnb_link" className="text-sm font-medium">
          Airbnb Link
        </label>
        <div className="flex gap-2">
          <Input
            id="airbnb_link"
            value={formData.airbnb_link}
            onChange={(e) => onChange("airbnb_link", e.target.value)}
            placeholder="Enter Airbnb listing URL"
          />
          <Button 
            onClick={handleAirbnbSync} 
            disabled={isSyncing || !formData.airbnb_link}
            type="button"
          >
            {isSyncing ? "Syncing..." : "Sync"}
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