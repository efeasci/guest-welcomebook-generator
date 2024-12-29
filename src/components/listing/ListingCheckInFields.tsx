import { Input } from "@/components/ui/input";

interface ListingCheckInFieldsProps {
  formData: {
    check_in: string;
    check_out: string;
    check_in_method: string;
    wifi_password: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingCheckInFields = ({ formData, onChange }: ListingCheckInFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="check_in_method" className="text-sm font-medium">
          Check-in Method
        </label>
        <Input
          id="check_in_method"
          value={formData.check_in_method}
          onChange={(e) => onChange("check_in_method", e.target.value)}
          placeholder="Enter check-in instructions"
        />
      </div>
      <div>
        <label htmlFor="wifi" className="text-sm font-medium">
          WiFi Password
        </label>
        <Input
          id="wifi"
          value={formData.wifi_password}
          onChange={(e) => onChange("wifi_password", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="check_in" className="text-sm font-medium">
          Check-in Time
        </label>
        <Input
          id="check_in"
          type="time"
          value={formData.check_in}
          onChange={(e) => onChange("check_in", e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="check_out" className="text-sm font-medium">
          Check-out Time
        </label>
        <Input
          id="check_out"
          type="time"
          value={formData.check_out}
          onChange={(e) => onChange("check_out", e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default ListingCheckInFields;