import { MapPin } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface TitleSectionProps {
  title: string;
  address: string;
  imageUrl: string;
  randomPlaceholder: string;
  getGoogleMapsUrl: (address: string) => string;
}

const TitleSection = ({ title, address, imageUrl, randomPlaceholder, getGoogleMapsUrl }: TitleSectionProps) => {
  return (
    <>
      <div className="w-full h-48 relative">
        <img 
          src={imageUrl || `https://source.unsplash.com/${randomPlaceholder}`}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Welcome to {title}
        </CardTitle>
        <a 
          href={getGoogleMapsUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2"
        >
          <MapPin className="h-4 w-4" /> {address}
        </a>
      </CardHeader>
    </>
  );
};

export default TitleSection;