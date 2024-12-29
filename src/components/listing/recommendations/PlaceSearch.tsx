import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PlaceSearchInput from "./PlaceSearchInput";
import { addCustomStyles } from "./PlaceSearchStyles";

interface PlaceSearchProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  value: string;
  onChange: (value: string) => void;
}

const PlaceSearch = ({ onPlaceSelect, value, onChange }: PlaceSearchProps) => {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        const { data: { api_key }, error } = await supabase.functions.invoke('get-google-maps-key');
        if (error) {
          console.error('Error fetching Google Maps API key:', error);
          return;
        }

        if (!window.google) {
          console.log('Loading Google Maps script...');
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    initGoogleMaps();
  }, []);

  useEffect(() => {
    // Add custom styles for the autocomplete dropdown
    const removeStyles = addCustomStyles();
    
    // Handle click events on pac-items
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pacItem = target.closest('.pac-item');
      
      if (pacItem) {
        e.preventDefault();
        e.stopPropagation();
        
        const mainText = pacItem.querySelector('.pac-item-query')?.textContent || '';
        const secondaryText = pacItem.textContent?.replace(mainText, '').trim() || '';
        const fullText = `${mainText} ${secondaryText}`.trim();
        
        console.log('Pac item clicked, full text:', fullText);
        onChange(fullText);

        // Create a simplified place result
        const place: google.maps.places.PlaceResult = {
          name: mainText,
          formatted_address: fullText,
        };
        
        setSelectedPlace(place);
        onPlaceSelect(place);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      removeStyles();
      document.removeEventListener('click', handleClick, true);
    };
  }, [onChange, onPlaceSelect]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    console.log('Place selected:', place);
    setSelectedPlace(place);
    onPlaceSelect(place);
    if (place.formatted_address) {
      onChange(place.formatted_address);
    } else if (place.name) {
      onChange(place.name);
    }
  };

  return (
    <PlaceSearchInput
      value={value}
      onChange={onChange}
      onPlaceSelect={handlePlaceSelect}
    />
  );
};

export default PlaceSearch;