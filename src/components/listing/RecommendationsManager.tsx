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

const RecommendationsManager = ({ listingId }: RecommendationsManagerProps) => {
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

  // Updated to return a Promise
  const handleGenerateMore = async (category: string): Promise<void> => {
    return Promise.resolve();
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
              recommendations={categoryRecommendations}
              loading={loading[category] || false}
              onGenerateMore={handleGenerateMore}
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