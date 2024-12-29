import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PlaceSearch from "./PlaceSearch";

interface AddRecommendationDialogProps {
  category: string;
  listingId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddRecommendationDialog = ({ 
  category, 
  listingId,
  isOpen, 
  onOpenChange,
  onSuccess 
}: AddRecommendationDialogProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

  const handleAddRecommendation = async () => {
    if (!selectedPlace) {
      toast.error('Please select a place from the suggestions');
      return;
    }

    try {
      const location = selectedPlace.geometry?.location;
      const newRecommendation = {
        listing_id: listingId,
        name: selectedPlace.name || '',
        description: description,
        address: selectedPlace.formatted_address || '',
        photo: selectedPlace.photos?.[0]?.getUrl(),
        location: {
          lat: location?.lat(),
          lng: location?.lng()
        },
        category: category
      };

      console.log('Adding recommendation:', newRecommendation);

      const { error } = await supabase
        .from('listing_recommendations')
        .insert([newRecommendation]);

      if (error) throw error;

      toast.success('Recommendation added successfully');
      onOpenChange(false);
      setSearchInput("");
      setDescription("");
      setSelectedPlace(null);
      onSuccess?.();
    } catch (error) {
      console.error('Error adding recommendation:', error);
      toast.error('Failed to add recommendation');
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    console.log('Selected place in dialog:', place);
    setSelectedPlace(place);
    if (place.name) {
      setSearchInput(place.name);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Recommendation</DialogTitle>
          <DialogDescription>
            Search for a place and add your personal recommendation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
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
  );
};

export default AddRecommendationDialog;