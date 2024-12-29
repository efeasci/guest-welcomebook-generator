import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Trash } from "lucide-react";
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
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [editingInstructionIndex, setEditingInstructionIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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

  const handleDeleteRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    onChange("house_rules", updatedRules.join("\n"));
  };

  const handleDeleteInstruction = (index: number) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    onChange("before_you_leave", updatedInstructions.join("\n"));
  };

  const startEditingRule = (index: number, text: string) => {
    setEditingRuleIndex(index);
    setEditText(text);
  };

  const startEditingInstruction = (index: number, text: string) => {
    setEditingInstructionIndex(index);
    setEditText(text);
  };

  const handleEditRule = () => {
    if (editingRuleIndex !== null && editText.trim()) {
      const updatedRules = [...rules];
      updatedRules[editingRuleIndex] = editText.trim();
      onChange("house_rules", updatedRules.join("\n"));
      setEditingRuleIndex(null);
      setEditText("");
    }
  };

  const handleEditInstruction = () => {
    if (editingInstructionIndex !== null && editText.trim()) {
      const updatedInstructions = [...instructions];
      updatedInstructions[editingInstructionIndex] = editText.trim();
      onChange("before_you_leave", updatedInstructions.join("\n"));
      setEditingInstructionIndex(null);
      setEditText("");
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
                {editingRuleIndex === index ? (
                  <>
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleEditRule()}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditRule}
                      size="sm"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{rule}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditingRule(index, rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
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
                {editingInstructionIndex === index ? (
                  <>
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleEditInstruction()}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditInstruction}
                      size="sm"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{instruction}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditingInstruction(index, instruction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInstruction(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListingRulesFields;