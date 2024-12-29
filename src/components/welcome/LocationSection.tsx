import { Button } from "@/components/ui/button";
import { Navigation2 } from "lucide-react";
import Map from "@/components/Map";

interface LocationSectionProps {
  address: string;
  getDirectionsUrl: (address: string) => string;
}

const LocationSection = ({ address, getDirectionsUrl }: LocationSectionProps) => {
  return (
    <section className="space-y-4">
      <div className="h-64 w-full">
        <Map address={address} className="h-full" />
      </div>
      <div className="flex justify-center">
        <Button
          variant="secondary"
          asChild
          className="w-full sm:w-auto"
        >
          <a
            href={getDirectionsUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <Navigation2 className="h-4 w-4" />
            Get Directions
          </a>
        </Button>
      </div>
    </section>
  );
};

export default LocationSection;