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

      // Handle place selection
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

      // Add click handlers for the suggestions
      const addClickHandlers = () => {
        const pacContainer = document.querySelector('.pac-container');
        if (pacContainer && !pacContainer.hasAttribute('data-click-handler')) {
          pacContainer.setAttribute('data-click-handler', 'true');
          
          // Prevent the input from losing focus when clicking suggestions
          pacContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
          });

          // Handle clicks on suggestions
          pacContainer.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const pacItem = target.closest('.pac-item');
            if (pacItem) {
              const placeText = Array.from(pacItem.childNodes)
                .map(node => (node as HTMLElement).textContent || '')
                .join(' ')
                .trim();

              if (searchInputRef.current) {
                searchInputRef.current.value = placeText;
                // Trigger the place_changed event
                google.maps.event.trigger(autocomplete, 'place_changed');
              }
            }
          });
        }
      };

      // Create an observer to watch for the pac-container being added to the DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            addClickHandlers();
          }
        });
      });

      // Start observing the document body for the pac-container
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setAutocomplete(autocomplete);
    };

    initAutocomplete();

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
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