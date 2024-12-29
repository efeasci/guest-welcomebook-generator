import { Info } from "lucide-react";

interface DirectionsSectionProps {
  directions: string;
}

const DirectionsSection = ({ directions }: DirectionsSectionProps) => {
  if (!directions) return null;
  
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Info className="h-5 w-5 text-primary" /> Directions
      </h2>
      <div className="bg-secondary/50 p-4 rounded-lg">
        <p className="whitespace-pre-wrap">{directions}</p>
      </div>
    </section>
  );
};

export default DirectionsSection;