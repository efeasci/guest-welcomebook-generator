import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  name: string;
  description: string;
  address: string;
  photo: string;
  location: {
    lat: number;
    lng: number;
  };
}

const RecommendationCard = ({ name, description, address, photo, location }: RecommendationCardProps) => {
  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <Card className="overflow-hidden">
      {photo && (
        <img
          src={photo}
          alt={name}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm">{address}</p>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          asChild
        >
          <a
            href={getGoogleMapsUrl(name + " " + address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Maps
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;