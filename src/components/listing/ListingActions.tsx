import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import ShareListingButton from "../ShareListingButton";
import DeleteListingButton from "./DeleteListingButton";

interface ListingActionsProps {
  listing: {
    id: string;
    title: string;
  };
  onEdit: (listing: { id: string }) => void;
  welcomePageUrl: string;
}

const ListingActions = ({ listing, onEdit, welcomePageUrl }: ListingActionsProps) => {
  return (
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
      <DeleteListingButton listingId={listing.id} />
    </div>
  );
};

export default ListingActions;