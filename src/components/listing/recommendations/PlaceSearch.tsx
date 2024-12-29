import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface PlaceSearchProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  value: string;
  onChange: (value: string) => void;
}

const PlaceSearch = ({ onPlaceSelect, value, onChange }: PlaceSearchProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        const { data: { api_key }, error } = await supabase.functions.invoke('get-google-maps-key');
        if (error) throw error;

        if (!window.google) {
          console.log('Loading Google Maps script...');
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);

          script.onload = () => {
            console.log('Google Maps script loaded');
            initPlacesAutocomplete();
          };
        } else {
          console.log('Google Maps already loaded');
          initPlacesAutocomplete();
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    const initPlacesAutocomplete = () => {
      if (!searchInputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['establishment'],
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'photos']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('Selected place:', place);
        
        if (!place.geometry) {
          console.log('No geometry for selected place');
          return;
        }

        if (place.name) {
          onChange(place.name);
        }
        
        onPlaceSelect(place);
      });

      // Enhanced click handling for suggestions in dialog
      const handleSuggestionClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const pacItem = target.closest('.pac-item');
        
        if (pacItem) {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('Suggestion clicked in dialog:', pacItem);
          
          const mainText = pacItem.querySelector('.pac-item-query')?.textContent || '';
          const secondaryText = pacItem.textContent?.replace(mainText, '').trim() || '';
          const fullText = `${mainText} ${secondaryText}`.trim();
          
          console.log('Selected text in dialog:', fullText);

          if (searchInputRef.current) {
            searchInputRef.current.value = fullText;
            onChange(fullText);

            // Force the place selection with a small delay
            requestAnimationFrame(() => {
              google.maps.event.trigger(autocomplete, 'place_changed');
            });
          }
        }
      };

      // Setup enhanced event delegation for dialog context
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.pac-container')) {
          handleSuggestionClick(e);
        }
      }, true);

      // Prevent focus loss in dialog
      document.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('.pac-container')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);

      setAutocomplete(autocomplete);
    };

    // Initialize with a small delay to ensure dialog is mounted
    const timeoutId = setTimeout(initAutocomplete, 100);

    return () => {
      clearTimeout(timeoutId);
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
      // Clean up global event listeners
      document.removeEventListener('click', handleSuggestionClick, true);
    };
  }, [onPlaceSelect, onChange]);

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

export default PlaceSearch;