import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, placeId?: string) => void;
  className?: string;
}

const AddressAutocomplete = ({ value, onChange, className }: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
            if (inputRef.current) {
              const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['address'],
              });

              autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.formatted_address) {
                  console.log('Selected address:', place.formatted_address);
                  onChange(place.formatted_address, place.place_id);
                }
              });

              setAutocomplete(autocomplete);
            }
          };
        } else if (inputRef.current) {
          console.log('Google Maps already loaded');
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
              console.log('Selected address:', place.formatted_address);
              onChange(place.formatted_address, place.place_id);
            }
          });

          setAutocomplete(autocomplete);
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    initAutocomplete();

    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input value changed:', e.target.value);
    onChange(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleInputChange}
      className={className}
      placeholder="Enter address"
    />
  );
};

export default AddressAutocomplete;