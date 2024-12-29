import { DoorClosed } from "lucide-react";

interface LeaveSectionProps {
  instructions: string[];
}

const LeaveSection = ({ instructions }: LeaveSectionProps) => {
  if (!instructions?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <DoorClosed className="h-5 w-5 text-primary" /> Before You Leave
      </h2>
      <ul className="list-disc list-inside space-y-2">
        {instructions.map((instruction, index) => (
          <li key={index} className="text-gray-700">{instruction}</li>
        ))}
      </ul>
    </section>
  );
};

export default LeaveSection;