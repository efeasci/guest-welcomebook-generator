import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PlaceSearch from "./PlaceSearch";

interface AddRecommendationDialogProps {
  category: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRecommendationDialog = ({ category, isOpen, onOpenChange }: AddRecommendationDialogProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

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
          lat: selectedPlace.geometry?.location?.lat(),
          lng: selectedPlace.geometry?.location?.lng()
        },
        category: category
      };

      const { error } = await supabase
        .from('listing_recommendations')
        .insert([newRecommendation]);

      if (error) throw error;

      toast.success('Recommendation added successfully');
      onOpenChange(false);
      setSearchInput("");
      setDescription("");
      setSelectedPlace(null);
    } catch (error) {
      console.error('Error adding recommendation:', error);
      toast.error('Failed to add recommendation');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Recommendation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <PlaceSearch
            value={searchInput}
            onChange={setSearchInput}
            onPlaceSelect={setSelectedPlace}
          />
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
  );
};

export default AddRecommendationDialog;