import { useState } from "react";
import { Plus, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Recommendation } from "./types";
import RecommendationList from "./RecommendationList";
import AddRecommendationForm from "./AddRecommendationForm";

interface CategorySectionProps {
  category: string;
  listingId: string;
  address: string;
  recommendations: Recommendation[];
  onRemoveRecommendation: (id: string) => Promise<void>;
  onRecommendationAdded?: () => void;
}

const CategorySection = ({
  category,
  listingId,
  address,
  recommendations,
  onRemoveRecommendation,
  onRecommendationAdded
}: CategorySectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRecommendations = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating recommendations for category:', category);
      
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { 
          listingId, 
          address,
          category,
        }
      });

      if (error) throw error;

      console.log('Generated recommendations response:', data);
      
      if (data.recommendations?.length > 0) {
        console.log('New recommendations generated:', data.recommendations.length);
        // Trigger the parent component to refresh recommendations
        onRecommendationAdded?.();
        toast.success(`Generated ${data.recommendations.length} recommendations for ${category}`);
      } else {
        toast.error(`No recommendations found for ${category}`);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error(`Failed to generate recommendations for ${category}`);
    } finally {
      setIsGenerating(false);
    }
  };

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
          <RecommendationList
            recommendations={recommendations}
            onRemove={onRemoveRecommendation}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsAdding(true)}
              disabled={isAdding || isGenerating}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recommendation
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleGenerateRecommendations}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>

          {isAdding && (
            <AddRecommendationForm
              listingId={listingId}
              category={category}
              onCancel={() => setIsAdding(false)}
              onSuccess={() => {
                setIsAdding(false);
                onRecommendationAdded?.();
              }}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategorySection;