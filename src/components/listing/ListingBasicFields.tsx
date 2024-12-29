import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AddressAutocomplete from "../AddressAutocomplete";

interface ListingBasicFieldsProps {
  formData: {
    title: string;
    address: string;
    directions?: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingBasicFields = ({ formData, onChange }: ListingBasicFieldsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
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
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Location</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(address) => onChange("address", address)}
            />
          </div>
          <div>
            <label htmlFor="directions" className="text-sm font-medium">
              Directions
            </label>
            <Textarea
              id="directions"
              value={formData.directions || ""}
              onChange={(e) => onChange("directions", e.target.value)}
              placeholder="Enter any specific directions or instructions to find the property..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingBasicFields;