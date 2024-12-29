import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RecommendationCard from "./RecommendationCard";
import type { Recommendation } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CategorySectionProps {
  category: string;
  recommendations: Recommendation[];
  loading: boolean;
  onGenerateMore: (category: string) => Promise<void>;
  onRemoveRecommendation: (id: string) => Promise<void>;
}

interface PlaceResult {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  photos?: Array<{
    getUrl: () => string;
  }>;
}

const CategorySection = ({
  category,
  recommendations,
  loading,
  onRemoveRecommendation,
}: CategorySectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        const { data: { api_key }, error } = await supabase.functions.invoke('get-google-maps-key');
        if (error) throw error;

        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);

          script.onload = () => {
            initPlacesAutocomplete();
          };
        } else {
          initPlacesAutocomplete();
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        toast.error('Failed to load Google Maps');
      }
    };

    const initPlacesAutocomplete = () => {
      if (!searchInputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['establishment'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.name && place.formatted_address) {
          setSelectedPlace(place as PlaceResult);
          setSearchInput(place.name);
        }
      });

      setAutocomplete(autocomplete);
    };

    if (isDialogOpen) {
      initAutocomplete();
    }

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isDialogOpen]);

  const handleAddRecommendation = async () => {
    if (!selectedPlace) {
      toast.error('Please select a place from the suggestions');
      return;
    }

    try {
      const newRecommendation = {
        name: selectedPlace.name,
        description: description,
        address: selectedPlace.formatted_address,
        photo: selectedPlace.photos?.[0]?.getUrl(),
        location: {
          lat: selectedPlace.geometry.location.lat(),
          lng: selectedPlace.geometry.location.lng()
        },
        category: category
      };

      const { error } = await supabase
        .from('listing_recommendations')
        .insert([newRecommendation]);

      if (error) throw error;

      toast.success('Recommendation added successfully');
      setIsDialogOpen(false);
      setSearchInput("");
      setDescription("");
      setSelectedPlace(null);
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
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recommendation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Recommendation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Place</label>
                  <Input
                    ref={searchInputRef}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for a place..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                  />
                </div>
                <Button 
                  onClick={handleAddRecommendation}
                  disabled={!selectedPlace || !description}
                  className="w-full"
                >
                  Add Recommendation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategorySection;