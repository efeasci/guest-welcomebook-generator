import { Loader2 } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import RecommendationCard from "./RecommendationCard";
import type { Recommendation } from "./types";

interface CategorySectionProps {
  category: string;
  recommendations: Recommendation[];
  loading: boolean;
  onFetch: (category: string) => void;
}

const CategorySection = ({
  category,
  recommendations,
  loading,
  onFetch,
}: CategorySectionProps) => {
  return (
    <AccordionItem value={category} className="border rounded-lg">
      <AccordionTrigger className="px-4" onClick={() => onFetch(category)}>
        <span className="flex items-center gap-2">
          {category}
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-4 py-2 space-y-4">
          {recommendations?.map((rec, index) => (
            <RecommendationCard key={index} {...rec} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategorySection;