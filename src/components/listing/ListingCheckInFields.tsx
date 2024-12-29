import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ListingCheckInFieldsProps {
  formData: {
    check_in: string;
    check_out: string;
    check_in_method: string;
    check_in_instructions: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingCheckInFields = ({ formData, onChange }: ListingCheckInFieldsProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Check In / Check Out Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="check_in_method" className="text-sm font-medium">
            Check-in Method
          </label>
          <Input
            id="check_in_method"
            value={formData.check_in_method}
            onChange={(e) => onChange("check_in_method", e.target.value)}
            placeholder="Enter check-in method"
          />
        </div>
        <div>
          <label htmlFor="check_in_instructions" className="text-sm font-medium">
            Check-in Instructions
          </label>
          <Textarea
            id="check_in_instructions"
            value={formData.check_in_instructions}
            onChange={(e) => onChange("check_in_instructions", e.target.value)}
            placeholder="Enter detailed check-in instructions"
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
      </div>
    </div>
  );
};

export default ListingCheckInFields;