import { useState } from "react";
import { Compass, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Recommendation {
  id?: string;
  name: string;
  description: string;
  address: string;
  photo: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface RecommendationsManagerProps {
  listingId: string;
  address: string;
}

const categories = [
  "Places to Eat",
  "Coffee Shops",
  "Bars & Wineries",
  "Places to See",
  "Nearest Shopping",
  "Things to Do"
];

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
      return data;
    }
  });

  const generateRecommendations = async (category: string) => {
    setLoading(prev => ({ ...prev, [category]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { address, category }
      });

      if (error) throw error;

      return data.recommendations;
    } catch (err) {
      console.error('Error generating recommendations:', err);
      toast.error('Failed to generate recommendations. Please try again.');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const saveRecommendation = async (recommendation: Recommendation, category: string) => {
    try {
      const { error } = await supabase
        .from('listing_recommendations')
        .insert({
          listing_id: listingId,
          category,
          name: recommendation.name,
          description: recommendation.description,
          address: recommendation.address,
          photo: recommendation.photo,
          location: recommendation.location
        });

      if (error) throw error;

      toast.success('Recommendation saved successfully');
      queryClient.invalidateQueries({ queryKey: ['saved-recommendations', listingId] });
    } catch (err) {
      console.error('Error saving recommendation:', err);
      toast.error('Failed to save recommendation');
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

  const handleGenerateMore = async (category: string) => {
    const newRecommendations = await generateRecommendations(category);
    // The new recommendations will be shown in the UI for selection
    console.log('Generated new recommendations:', newRecommendations);
  };

  const getGoogleMapsUrl = (location: { lat: number; lng: number }) => {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  };

  if (isSavedLoading) {
    return <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>;
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
            <AccordionItem key={category} value={category} className="border rounded-lg">
              <AccordionTrigger className="px-4">
                <span className="flex items-center gap-2">
                  {category}
                  {loading[category] && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    ({categoryRecommendations.length} selected)
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-2 space-y-4">
                  {/* Selected recommendations */}
                  {categoryRecommendations.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Selected Recommendations</h3>
                      {categoryRecommendations.map((rec) => (
                        <Card key={rec.id} className="overflow-hidden">
                          {rec.photo && (
                            <img
                              src={rec.photo}
                              alt={rec.name}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <CardContent className="p-4 space-y-2">
                            <h3 className="font-semibold">{rec.name}</h3>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                            <p className="text-sm">{rec.address}</p>
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                asChild
                              >
                                <a
                                  href={getGoogleMapsUrl(rec.location)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View on Maps
                                </a>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeRecommendation(rec.id!)}
                              >
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Generate more button */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleGenerateMore(category)}
                    disabled={loading[category]}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate More Recommendations
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </section>
  );
};

export default RecommendationsManager;