import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import TitleSection from "@/components/welcome/TitleSection";
import LocationSection from "@/components/welcome/LocationSection";
import DirectionsSection from "@/components/welcome/DirectionsSection";
import CheckInSection from "@/components/welcome/CheckInSection";
import CheckInPhotosSection from "@/components/welcome/CheckInPhotosSection";
import WifiSection from "@/components/welcome/WifiSection";
import RulesSection from "@/components/welcome/RulesSection";
import LeaveSection from "@/components/welcome/LeaveSection";
import HostSection from "@/components/welcome/HostSection";
import RecommendationsSection from "@/components/welcome/RecommendationsSection";

interface WelcomeCardProps {
  listing: {
    id: string;
    title: string;
    address: string;
    image_url: string;
    directions: string;
    check_in: string;
    check_out: string;
    check_in_method: string;
    check_in_instructions: string;
    wifi_network: string;
    wifi_password: string;
    house_rules: string[];
    before_you_leave: string[];
    host_name: string;
    host_about: string;
    host_email: string;
    host_phone: string;
  };
  randomPlaceholder: string;
  getGoogleMapsUrl: (address: string) => string;
  getDirectionsUrl: (address: string) => string;
}

const WelcomeCard = ({ listing, randomPlaceholder, getGoogleMapsUrl, getDirectionsUrl }: WelcomeCardProps) => {
  return (
    <Card className="max-w-2xl mx-auto shadow-xl overflow-hidden">
      <TitleSection
        title={listing.title}
        address={listing.address}
        imageUrl={listing.image_url}
        randomPlaceholder={randomPlaceholder}
        getGoogleMapsUrl={getGoogleMapsUrl}
      />

      <CardContent className="space-y-8">
        <LocationSection
          address={listing.address}
          getDirectionsUrl={getDirectionsUrl}
        />

        <DirectionsSection directions={listing.directions} />

        <CheckInSection
          checkIn={listing.check_in}
          checkOut={listing.check_out}
          checkInMethod={listing.check_in_method}
          checkInInstructions={listing.check_in_instructions}
        />

        <CheckInPhotosSection listingId={listing.id} />

        <WifiSection
          wifiNetwork={listing.wifi_network}
          wifiPassword={listing.wifi_password}
        />

        <RulesSection rules={listing.house_rules} />

        <LeaveSection instructions={listing.before_you_leave} />

        <RecommendationsSection listingId={listing.id} />

        <HostSection
          name={listing.host_name}
          about={listing.host_about}
          email={listing.host_email}
          phone={listing.host_phone}
        />
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;