import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RecommendationCard from "./RecommendationCard";
import PlaceSearch from "./PlaceSearch";
import type { Recommendation } from "./types";

interface CategorySectionProps {
  category: string;
  listingId: string;
  recommendations: Recommendation[];
  onRemoveRecommendation: (id: string) => Promise<void>;
  onRecommendationAdded?: () => void;
}

const CategorySection = ({
  category,
  listingId,
  recommendations,
  onRemoveRecommendation,
  onRecommendationAdded
}: CategorySectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    console.log('Selected place:', place);
    setSelectedPlace(place);
    if (place.name) {
      setSearchInput(place.name);
    }
  };

  const handleAddRecommendation = async () => {
    if (!selectedPlace || !selectedPlace.geometry?.location) {
      toast.error('Please select a valid place from the suggestions');
      return;
    }

    try {
      const location = selectedPlace.geometry.location;
      const newRecommendation = {
        listing_id: listingId,
        name: selectedPlace.name || '',
        description: description,
        address: selectedPlace.formatted_address || '',
        photo: selectedPlace.photos?.[0]?.getUrl(),
        location: {
          lat: location.lat(),
          lng: location.lng()
        },
        category: category
      };

      console.log('Adding recommendation:', newRecommendation);

      const { error } = await supabase
        .from('listing_recommendations')
        .insert([newRecommendation]);

      if (error) throw error;

      toast.success('Recommendation added successfully');
      setIsAdding(false);
      setSearchInput("");
      setDescription("");
      setSelectedPlace(null);
      onRecommendationAdded?.();
    } catch (error) {
      console.error('Error adding recommendation:', error);
      toast.error('Failed to add recommendation');
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

          {!isAdding ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recommendation
            </Button>
          ) : (
            <div className="space-y-4 border rounded-lg p-4">
              <PlaceSearch
                value={searchInput}
                onChange={setSearchInput}
                onPlaceSelect={handlePlaceSelect}
              />
              {selectedPlace && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedPlace.name} ({selectedPlace.formatted_address})
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add your personal recommendation..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setSearchInput("");
                    setDescription("");
                    setSelectedPlace(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddRecommendation}
                  disabled={!selectedPlace || !description}
                >
                  Add Recommendation
                </Button>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategorySection;