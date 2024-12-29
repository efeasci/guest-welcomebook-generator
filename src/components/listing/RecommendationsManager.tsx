import { useState } from "react";
import { Compass } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Accordion } from "@/components/ui/accordion";
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
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch saved recommendations
  const { data: savedRecommendations, isLoading: isSavedLoading } = useQuery({
    queryKey: ['saved-recommendations', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listing_recommendations')
        .select('*')
        .eq('listing_id', listingId);
      
      if (error) throw error;
      return data.map(rec => ({
        ...rec,
        location: rec.location as { lat: number; lng: number }
      }));
    }
  });

  const generateRecommendations = async (category: string) => {
    setLoading(prev => ({ ...prev, [category]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { address, category }
      });

      if (error) throw error;

      // Save the generated recommendations automatically
      const recommendationsToSave = data.recommendations.map((rec: Recommendation) => ({
        ...rec,
        listing_id: listingId,
        category
      }));

      const { error: saveError } = await supabase
        .from('listing_recommendations')
        .insert(recommendationsToSave);

      if (saveError) throw saveError;

      queryClient.invalidateQueries({ queryKey: ['saved-recommendations', listingId] });
      toast.success('New recommendations generated and saved');
    } catch (err) {
      console.error('Error generating recommendations:', err);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const removeRecommendation = async (recommendationId: string) => {
    try {
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

  if (isSavedLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Compass className="h-5 w-5 text-primary" /> Local Recommendations
      </h2>
      <p className="text-sm text-muted-foreground">
        Generate and select recommendations to show to your guests. You can generate more recommendations
        if you don't find what you're looking for.
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
              recommendations={categoryRecommendations}
              loading={loading[category] || false}
              onGenerateMore={generateRecommendations}
              onRemoveRecommendation={removeRecommendation}
            />
          );
        })}
      </Accordion>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </section>
  );
};

export default RecommendationsManager;