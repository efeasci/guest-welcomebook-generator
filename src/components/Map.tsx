import React, { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface MapProps {
  address: string;
  className?: string;
}

const Map = ({ address, className = "" }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
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
            createMap();
          };
        } else {
          console.log('Google Maps already loaded');
          createMap();
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    const createMap = () => {
      if (!mapRef.current) return;

      // Initialize the map
      map.current = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: { lat: 0, lng: 0 },
      });

      // Initialize the geocoder
      const geocoder = new window.google.maps.Geocoder();

      // Geocode the address
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          
          map.current?.setCenter(location);

          if (marker.current) {
            marker.current.setMap(null);
          }

          marker.current = new window.google.maps.Marker({
            map: map.current,
            position: location,
          });
        }
      });
    };

    initMap();

    return () => {
      if (marker.current) {
        marker.current.setMap(null);
      }
    };
  }, [address]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default Map;