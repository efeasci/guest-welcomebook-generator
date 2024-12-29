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
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

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

          script.onload = () => {
            setAutocompleteService(new google.maps.places.AutocompleteService());
            // Create a dummy div for PlacesService (required but not visible)
            const mapDiv = document.createElement('div');
            const map = new google.maps.Map(mapDiv);
            setPlacesService(new google.maps.places.PlacesService(map));
          };
        } else {
          setAutocompleteService(new google.maps.places.AutocompleteService());
          const mapDiv = document.createElement('div');
          const map = new google.maps.Map(mapDiv);
          setPlacesService(new google.maps.places.PlacesService(map));
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
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pacItem = target.closest('.pac-item');
      
      if (pacItem && placesService) {
        e.preventDefault();
        e.stopPropagation();
        
        const mainText = pacItem.querySelector('.pac-item-query')?.textContent || '';
        const secondaryText = pacItem.textContent?.replace(mainText, '').trim() || '';
        const fullText = `${mainText} ${secondaryText}`.trim();
        
        console.log('Pac item clicked, full text:', fullText);
        onChange(fullText);

        // Get place details using Places Service
        const request = {
          query: fullText,
          fields: ['name', 'geometry', 'formatted_address', 'photos']
        };

        placesService.findPlaceFromQuery(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const place = results[0];
            console.log('Place details retrieved:', place);
            onPlaceSelect(place);
          }
        });
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      removeStyles();
      document.removeEventListener('click', handleClick, true);
    };
  }, [onChange, onPlaceSelect, placesService]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    console.log('Place selected:', place);
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