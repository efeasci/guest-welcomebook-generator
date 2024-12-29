import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

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
  is_generated?: boolean;
  onRemove?: (id: string) => void;
}

const RecommendationCard = ({
  id,
  name,
  description,
  address,
  photo,
  location,
  is_generated,
  onRemove,
}: RecommendationCardProps) => {
  const getGoogleMapsUrl = (name: string, address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`;
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
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">{name}</h3>
          {is_generated && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Generated
            </Badge>
          )}
        </div>
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
              href={getGoogleMapsUrl(name, address)}
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