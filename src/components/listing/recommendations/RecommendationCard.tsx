import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RecommendationCardProps {
  id?: string;
  name: string;
  description: string;
  address: string;
  photo: string | null;
  location: {
    lat: number;
    lng: number;
  };
  onRemove?: (id: string) => void;
}

const RecommendationCard = ({
  id,
  name,
  description,
  address,
  photo,
  location,
  onRemove,
}: RecommendationCardProps) => {
  const getGoogleMapsUrl = (location: { lat: number; lng: number }) => {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
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
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            asChild
          >
            <a
              href={getGoogleMapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Maps
            </a>
          </Button>
          {onRemove && id && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(id)}
            >
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;