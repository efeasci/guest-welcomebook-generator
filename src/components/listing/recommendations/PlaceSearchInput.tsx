import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

interface PlaceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

const PlaceSearchInput = ({ value, onChange, onPlaceSelect }: PlaceSearchInputProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
      types: ['establishment'],
    });

    // Handle place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('Place selected from autocomplete:', place);
      if (place && (place.formatted_address || place.name)) {
        onPlaceSelect(place);
      }
    });

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onPlaceSelect]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Search Place</label>
      <Input
        ref={searchInputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a place..."
        className="w-full"
      />
    </div>
  );
};

export default PlaceSearchInput;