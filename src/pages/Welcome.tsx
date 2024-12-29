import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TitleSection from "@/components/welcome/TitleSection";
import LocationSection from "@/components/welcome/LocationSection";
import DirectionsSection from "@/components/welcome/DirectionsSection";
import CheckInSection from "@/components/welcome/CheckInSection";
import WifiSection from "@/components/welcome/WifiSection";
import RulesSection from "@/components/welcome/RulesSection";
import LeaveSection from "@/components/welcome/LeaveSection";
import HostSection from "@/components/welcome/HostSection";

const Welcome = () => {
  const { id } = useParams();
  
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!listing) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Listing not found</div>;
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
        <Card className="max-w-2xl mx-auto shadow-xl overflow-hidden">
          {/* Image and Title */}
          <TitleSection
            title={listing.title}
            address={listing.address}
            imageUrl={listing.image_url}
            randomPlaceholder={randomPlaceholder}
            getGoogleMapsUrl={getGoogleMapsUrl}
          />

          <CardContent className="space-y-8">
            {/* Location with Map */}
            <LocationSection
              address={listing.address}
              getDirectionsUrl={getDirectionsUrl}
            />

            {/* Directions */}
            <DirectionsSection directions={listing.directions} />

            {/* Check-in Information */}
            <CheckInSection
              checkIn={listing.check_in}
              checkOut={listing.check_out}
              checkInMethod={listing.check_in_method}
              checkInInstructions={listing.check_in_instructions}
            />

            {/* WiFi Information */}
            <WifiSection
              wifiNetwork={listing.wifi_network}
              wifiPassword={listing.wifi_password}
            />

            {/* House Rules */}
            <RulesSection rules={listing.house_rules} />

            {/* Before You Leave */}
            <LeaveSection instructions={listing.before_you_leave} />

            {/* Host Information */}
            <HostSection
              name={listing.host_name}
              about={listing.host_about}
              email={listing.host_email}
              phone={listing.host_phone}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;