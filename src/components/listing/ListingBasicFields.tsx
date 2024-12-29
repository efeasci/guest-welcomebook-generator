import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddressAutocomplete from "../AddressAutocomplete";

interface ListingBasicFieldsProps {
  formData: {
    title: string;
    address: string;
    image_url: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingBasicFields = ({ formData, onChange }: ListingBasicFieldsProps) => {
  const handleAirbnbConnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('airbnb-auth', {
        body: { redirectUrl: window.location.origin }
      });

      if (error) throw error;
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error initiating Airbnb connection:", error);
      toast.error("Failed to connect to Airbnb");
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
        <Button 
          onClick={handleAirbnbConnect}
          type="button"
          variant="outline"
          className="w-full"
        >
          Connect with Airbnb
        </Button>
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