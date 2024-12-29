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
    let clickHandler: ((e: MouseEvent) => void) | null = null;
    let mouseDownHandler: ((e: MouseEvent) => void) | null = null;

    const initAutocomplete = async () => {
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
            console.log('Google Maps script loaded');
            setupAutocomplete();
          };
        } else {
          console.log('Google Maps already loaded');
          setupAutocomplete();
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    const setupAutocomplete = () => {
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

      // Handle suggestion clicks in dialog context
      clickHandler = (e: MouseEvent) => {
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

            requestAnimationFrame(() => {
              google.maps.event.trigger(autocomplete, 'place_changed');
            });
          }
        }
      };

      // Prevent focus loss in dialog
      mouseDownHandler = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('.pac-container')) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      // Setup event listeners
      document.addEventListener('click', clickHandler, true);
      document.addEventListener('mousedown', mouseDownHandler, true);

      setAutocomplete(autocomplete);
    };

    // Initialize with a small delay to ensure dialog is mounted
    const timeoutId = setTimeout(initAutocomplete, 100);

    return () => {
      clearTimeout(timeoutId);
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
      // Clean up event listeners
      if (clickHandler) {
        document.removeEventListener('click', clickHandler, true);
      }
      if (mouseDownHandler) {
        document.removeEventListener('mousedown', mouseDownHandler, true);
      }
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