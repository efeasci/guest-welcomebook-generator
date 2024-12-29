import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

interface RecommendationsSectionProps {
  address: string;
}

const RecommendationsSection = ({ address }: RecommendationsSectionProps) => {
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [hasAnyRecommendations, setHasAnyRecommendations] = useState(false);

  const fetchRecommendations = async (category: string) => {
    if (recommendations[category]?.length > 0) return;
    
    setLoading(prev => ({ ...prev, [category]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { address, category }
      });

      if (error) throw error;

      setRecommendations(prev => {
        const newRecs = {
          ...prev,
          [category]: data.recommendations
        };
        
        const hasRecs = Object.values(newRecs).some(recs => recs && recs.length > 0);
        setHasAnyRecommendations(hasRecs);
        
        return newRecs;
      });
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  useEffect(() => {
    const hasRecs = Object.values(recommendations).some(recs => recs && recs.length > 0);
    setHasAnyRecommendations(hasRecs);
  }, []);

  if (!hasAnyRecommendations && !Object.values(loading).some(isLoading => isLoading)) {
    return null;
  }

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
            recommendations={recommendations[category] || []}
            loading={loading[category] || false}
            onFetch={fetchRecommendations}
          />
        ))}
      </Accordion>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </section>
  );
};

export default RecommendationsSection;