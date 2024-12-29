import { Textarea } from "@/components/ui/textarea";

interface ListingRulesFieldsProps {
  formData: {
    house_rules: string[] | string;
    before_you_leave: string[] | string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingRulesFields = ({ formData, onChange }: ListingRulesFieldsProps) => {
  // Convert arrays to strings for display
  const rulesText = Array.isArray(formData.house_rules) 
    ? formData.house_rules.join('\n')
    : formData.house_rules || '';

  const beforeLeaveText = Array.isArray(formData.before_you_leave)
    ? formData.before_you_leave.join('\n')
    : formData.before_you_leave || '';

  return (
    <>
      <div>
        <label htmlFor="rules" className="text-sm font-medium">
          House Rules (one per line)
        </label>
        <Textarea
          id="rules"
          value={rulesText}
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
          value={beforeLeaveText}
          onChange={(e) => onChange("before_you_leave", e.target.value)}
          rows={4}
          placeholder="Enter checkout instructions"
        />
      </div>
    </>
  );
};

export default ListingRulesFields;