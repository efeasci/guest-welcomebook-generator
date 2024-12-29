import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface Recommendation {
  name: string;
  description: string;
  address: string;
  photo: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface RecommendationsSectionProps {
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

const RecommendationsSection = ({ address }: RecommendationsSectionProps) => {
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (category: string) => {
    if (recommendations[category]?.length > 0) return;
    
    setLoading(prev => ({ ...prev, [category]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { address, category }
      });

      if (error) throw error;

      setRecommendations(prev => ({
        ...prev,
        [category]: data.recommendations
      }));
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const getGoogleMapsUrl = (location: { lat: number; lng: number }) => {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Compass className="h-5 w-5 text-primary" /> Local Recommendations
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {categories.map((category) => (
          <AccordionItem key={category} value={category} className="border rounded-lg">
            <AccordionTrigger className="px-4" onClick={() => fetchRecommendations(category)}>
              <span className="flex items-center gap-2">
                {category}
                {loading[category] && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 py-2 space-y-4">
                {recommendations[category]?.map((rec, index) => (
                  <Card key={index} className="overflow-hidden">
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
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </section>
  );
};

export default RecommendationsSection;