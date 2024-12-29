import { Textarea } from "@/components/ui/textarea";

interface ListingRulesFieldsProps {
  formData: {
    house_rules: string;
    before_you_leave: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingRulesFields = ({ formData, onChange }: ListingRulesFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="rules" className="text-sm font-medium">
          House Rules (one per line)
        </label>
        <Textarea
          id="rules"
          value={formData.house_rules}
          onChange={(e) => onChange("house_rules", e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <label htmlFor="before_you_leave" className="text-sm font-medium">
          Before You Leave (one per line)
        </label>
        <Textarea
          id="before_you_leave"
          value={formData.before_you_leave}
          onChange={(e) => onChange("before_you_leave", e.target.value)}
          rows={4}
          placeholder="Enter checkout instructions"
        />
      </div>
    </>
  );
};

export default ListingRulesFields;