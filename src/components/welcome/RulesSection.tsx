import { Book } from "lucide-react";

interface RulesSectionProps {
  rules: string[];
}

const RulesSection = ({ rules }: RulesSectionProps) => {
  if (!rules?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Book className="h-5 w-5 text-primary" /> House Rules
      </h2>
      <ul className="list-disc list-inside space-y-2">
        {rules.map((rule, index) => (
          <li key={index} className="text-gray-700">{rule}</li>
        ))}
      </ul>
    </section>
  );
};

export default RulesSection;