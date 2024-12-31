import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeCard from "./welcome/WelcomeCard";

const Welcome = () => {
  const { id } = useParams();
  
  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      console.log("Fetching listing with ID:", id);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching listing:", error);
        throw error;
      }
      
      console.log("Fetched listing:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading welcome page...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Page Not Found</h2>
          <p className="text-gray-600">
            The welcome page you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const placeholders = [
    'photo-1649972904349-6e44c42644a7',
    'photo-1488590528505-98d2b5aba04b',
    'photo-1518770660439-4636190af475',
    'photo-1461749280684-dccba630e2f6',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1581091226825-a6a2a5aee158',
    'photo-1485827404703-89b55fcc595e',
    'photo-1526374965328-7f61d4dc18c5'
  ];
  
  const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <WelcomeCard
          listing={listing}
          randomPlaceholder={randomPlaceholder}
          getGoogleMapsUrl={getGoogleMapsUrl}
          getDirectionsUrl={getDirectionsUrl}
        />
      </div>
    </div>
  );
};

export default Welcome;