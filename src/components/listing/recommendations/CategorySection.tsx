import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import RecommendationCard from "./RecommendationCard";
import AddRecommendationDialog from "./AddRecommendationDialog";
import type { Recommendation } from "./types";

interface CategorySectionProps {
  category: string;
  recommendations: Recommendation[];
  loading: boolean;
  onGenerateMore: (category: string) => Promise<void>;
  onRemoveRecommendation: (id: string) => Promise<void>;
}

const CategorySection = ({
  category,
  recommendations,
  onRemoveRecommendation,
}: CategorySectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <AccordionItem value={category} className="border rounded-lg">
      <AccordionTrigger className="px-4">
        <span className="flex items-center gap-2">
          {category}
          <span className="text-sm text-muted-foreground">
            ({recommendations.length} selected)
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-4 py-2 space-y-4">
          {recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Selected Recommendations</h3>
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  {...rec}
                  onRemove={onRemoveRecommendation}
                />
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Recommendation
          </Button>

          <AddRecommendationDialog
            category={category}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategorySection;