import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import RecommendationCard from "./RecommendationCard";
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
  loading,
  onGenerateMore,
  onRemoveRecommendation,
}: CategorySectionProps) => {
  return (
    <AccordionItem value={category} className="border rounded-lg">
      <AccordionTrigger className="px-4">
        <span className="flex items-center gap-2">
          {category}
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <span className="text-sm text-muted-foreground">
            ({recommendations.length} selected)
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-4 py-2 space-y-4">
          {/* Selected recommendations */}
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

          {/* Generate more button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onGenerateMore(category)}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate More Recommendations
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategorySection;