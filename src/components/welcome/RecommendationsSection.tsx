import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion } from "@/components/ui/accordion";
import CategorySection from "./recommendations/CategorySection";
import type { Recommendation } from "./recommendations/types";
import { useQuery } from "@tanstack/react-query";

const categories = [
  "Places to Eat",
  "Coffee Shops",
  "Bars & Wineries",
  "Places to See",
  "Nearest Shopping",
  "Things to Do"
];

interface RecommendationsSectionProps {
  listingId: string;
}

const RecommendationsSection = ({ listingId }: RecommendationsSectionProps) => {
  const [hasAnyRecommendations, setHasAnyRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', listingId],
    queryFn: async () => {
      console.log('Fetching recommendations for listing:', listingId);
      const { data, error } = await supabase
        .from('listing_recommendations')
        .select('*')
        .eq('listing_id', listingId);

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }

      // Transform the data to ensure location is properly typed
      const transformedData = data.map(rec => ({
        ...rec,
        location: rec.location as { lat: number; lng: number }
      }));

      console.log('Fetched recommendations:', transformedData);
      return transformedData as Recommendation[];
    },
  });

  useEffect(() => {
    if (recommendations) {
      const hasRecs = recommendations.length > 0;
      console.log('Setting hasAnyRecommendations:', hasRecs);
      setHasAnyRecommendations(hasRecs);
    }
  }, [recommendations]);

  if (!hasAnyRecommendations && !isLoading) {
    return null;
  }

  const getRecommendationsByCategory = (category: string) => {
    return recommendations?.filter(rec => rec.category === category) || [];
  };

  // Dummy onFetch function since we don't need to fetch on demand in the welcome page
  const handleFetch = (category: string) => {
    console.log('Category opened:', category);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Compass className="h-5 w-5 text-primary" /> Local Recommendations
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            recommendations={getRecommendationsByCategory(category)}
            loading={false}
            onFetch={handleFetch}
          />
        ))}
      </Accordion>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </section>
  );
};

export default RecommendationsSection;