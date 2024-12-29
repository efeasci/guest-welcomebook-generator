import { Input } from "@/components/ui/input";

interface ListingBasicFieldsProps {
  formData: {
    title: string;
    address: string;
    airbnb_link: string;
    image_url: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingBasicFields = ({ formData, onChange }: ListingBasicFieldsProps) => {
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
      <div>
        <label htmlFor="airbnb_link" className="text-sm font-medium">
          Airbnb Link
        </label>
        <Input
          id="airbnb_link"
          value={formData.airbnb_link}
          onChange={(e) => onChange("airbnb_link", e.target.value)}
          placeholder="Enter Airbnb listing URL"
        />
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