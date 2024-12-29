import { useState } from "react";
import { Compass, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import CategorySection from "./recommendations/CategorySection";
import type { Recommendation } from "./recommendations/types";

const categories = [
  "Places to Eat",
  "Coffee Shops",
  "Bars & Wineries",
  "Places to See",
  "Nearest Shopping",
  "Things to Do"
];

interface RecommendationsManagerProps {
  listingId: string;
  address: string;
}

const RecommendationsManager = ({ listingId, address }: RecommendationsManagerProps) => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch saved recommendations
  const { data: savedRecommendations, isLoading: isSavedLoading } = useQuery({
    queryKey: ['saved-recommendations', listingId],
    queryFn: async () => {
      console.log('Fetching recommendations for listing:', listingId);
      const { data, error } = await supabase
        .from('listing_recommendations')
        .select('*')
        .eq('listing_id', listingId);
      
      if (error) throw error;
      console.log('Fetched recommendations:', data);
      return data.map(rec => ({
        ...rec,
        location: rec.location as { lat: number; lng: number }
      }));
    }
  });

  const handleGenerateRecommendations = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating recommendations for address:', address);
      
      const response = await fetch('/api/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, address })
      });

      if (!response.ok) throw new Error('Failed to generate recommendations');

      toast.success('Recommendations generated successfully');
      queryClient.invalidateQueries({ queryKey: ['saved-recommendations', listingId] });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeRecommendation = async (recommendationId: string) => {
    try {
      console.log('Removing recommendation:', recommendationId);
      const { error } = await supabase
        .from('listing_recommendations')
        .delete()
        .eq('id', recommendationId);

      if (error) throw error;

      toast.success('Recommendation removed successfully');
      queryClient.invalidateQueries({ queryKey: ['saved-recommendations', listingId] });
    } catch (err) {
      console.error('Error removing recommendation:', err);
      toast.error('Failed to remove recommendation');
    }
  };

  const handleRecommendationAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['saved-recommendations', listingId] });
  };

  if (isSavedLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" /> Local Recommendations
        </h2>
        <Button
          variant="outline"
          onClick={handleGenerateRecommendations}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Recommendations'}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Add and manage recommendations to show to your guests.
      </p>
      
      <Accordion type="single" collapsible className="w-full space-y-2">
        {categories.map((category) => {
          const categoryRecommendations = savedRecommendations?.filter(
            rec => rec.category === category
          ) || [];

          return (
            <CategorySection
              key={category}
              category={category}
              listingId={listingId}
              recommendations={categoryRecommendations}
              onRemoveRecommendation={removeRecommendation}
              onRecommendationAdded={handleRecommendationAdded}
            />
          );
        })}
      </Accordion>
    </section>
  );
};

export default RecommendationsManager;