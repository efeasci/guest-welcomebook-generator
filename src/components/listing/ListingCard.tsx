import { Card, CardContent } from "@/components/ui/card";
import ListingActions from "./ListingActions";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    address: string;
    image_url?: string;
  };
  onEdit: (listing: { id: string }) => void;
  onPreview?: () => void;
}

const ListingCard = ({ listing, onEdit, onPreview }: ListingCardProps) => {
  const welcomePageUrl = `${window.location.origin}/welcome/${listing.id}`;

  console.log("Generated welcome page URL:", welcomePageUrl);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={listing.image_url || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{listing.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{listing.address}</p>
        <ListingActions 
          listing={listing}
          onEdit={onEdit}
          welcomePageUrl={welcomePageUrl}
        />
      </CardContent>
    </Card>
  );
};

export default ListingCard;