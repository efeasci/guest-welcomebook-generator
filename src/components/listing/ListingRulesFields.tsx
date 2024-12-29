import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface ListingRulesFieldsProps {
  formData: {
    house_rules: string[] | string;
    before_you_leave: string[] | string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingRulesFields = ({ formData, onChange }: ListingRulesFieldsProps) => {
  const [newRule, setNewRule] = useState("");
  const [newInstruction, setNewInstruction] = useState("");

  const rules = Array.isArray(formData.house_rules) 
    ? formData.house_rules 
    : (formData.house_rules || "").split("\n").filter(rule => rule.trim());

  const instructions = Array.isArray(formData.before_you_leave)
    ? formData.before_you_leave
    : (formData.before_you_leave || "").split("\n").filter(instruction => instruction.trim());

  const handleAddRule = () => {
    if (newRule.trim()) {
      const updatedRules = [...rules, newRule.trim()];
      onChange("house_rules", updatedRules.join("\n"));
      setNewRule("");
    }
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      const updatedInstructions = [...instructions, newInstruction.trim()];
      onChange("before_you_leave", updatedInstructions.join("\n"));
      setNewInstruction("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">House Rules</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add a new house rule"
              onKeyPress={(e) => e.key === "Enter" && handleAddRule()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRule}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="flex-1">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Before You Leave</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="Add a new checkout instruction"
              onKeyPress={(e) => e.key === "Enter" && handleAddInstruction()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddInstruction}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="flex-1">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListingRulesFields;