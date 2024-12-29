import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PlaceSearch from "./PlaceSearch";

interface AddRecommendationFormProps {
  listingId: string;
  category: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddRecommendationForm = ({ 
  listingId, 
  category, 
  onCancel, 
  onSuccess 
}: AddRecommendationFormProps) => {
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

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    if (selectedPlace && value !== selectedPlace.name && value !== selectedPlace.formatted_address) {
      console.log('Clearing selected place because input changed');
      setSelectedPlace(null);
    }
  };

  const handleSubmit = async () => {
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
      onSuccess();
    } catch (error) {
      console.error('Error adding recommendation:', error);
      toast.error('Failed to add recommendation');
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <PlaceSearch
        value={searchInput}
        onChange={handleSearchInputChange}
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedPlace || !description}
        >
          Add Recommendation
        </Button>
      </div>
    </div>
  );
};

export default AddRecommendationForm;