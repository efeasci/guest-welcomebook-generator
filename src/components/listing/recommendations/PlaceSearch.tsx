import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
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
    const setupAutocomplete = () => {
      if (!searchInputRef.current) return;

      console.log('Setting up autocomplete...');
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['establishment'], // Only allow establishment searches
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('Place selected:', place);

        if (place && (place.formatted_address || place.name)) {
          const placeAddress = place.formatted_address || place.name || '';
          console.log('Updating with place:', placeAddress);
          onChange(placeAddress);
          onPlaceSelect(place);
        }
      });

      // Handle mousedown on pac-container to prevent it from being closed
      const handleMousedown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.pac-container')) {
          e.preventDefault();
          console.log('Prevented default mousedown on pac-container');
        }
      };

      // Handle click on pac-item
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
          
          if (searchInputRef.current) {
            searchInputRef.current.value = fullText;
            onChange(fullText);
            
            setTimeout(() => {
              if (autocomplete) {
                google.maps.event.trigger(autocomplete, 'place_changed');
              }
            }, 50);
          }
        }
      };

      document.addEventListener('mousedown', handleMousedown, true);
      document.addEventListener('click', handleClick, true);

      setAutocomplete(autocomplete);

      return () => {
        document.removeEventListener('mousedown', handleMousedown, true);
        document.removeEventListener('click', handleClick, true);
        if (autocomplete) {
          google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    };

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

    initAutocomplete();

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onChange, onPlaceSelect]);

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