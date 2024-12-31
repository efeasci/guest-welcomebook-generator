import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Link as LinkIcon, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import ShareListingButton from "../ShareListingButton";

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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(listing)}
            className="flex-1"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <Link to={`/welcome/${listing.id}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
          <ShareListingButton 
            welcomePageUrl={welcomePageUrl}
            listingTitle={listing.title}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;