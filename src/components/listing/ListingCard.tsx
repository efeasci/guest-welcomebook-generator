import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Trash2 } from "lucide-react";
import ShareListingButton from "@/components/ShareListingButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ListingCardProps {
  listing: Tables<"listings">;
  placeholderImage: string;
  onEdit: (listing: Tables<"listings">) => void;
  onDelete: (listingId: string) => void;
}

export default function ListingCard({ listing, placeholderImage, onEdit, onDelete }: ListingCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="w-full h-48 relative">
        {listing.image_url ? (
          <img 
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={`https://source.unsplash.com/${placeholderImage}`}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
        <p className="text-gray-600 mb-4">{listing.address}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Check-in: {listing.check_in}</p>
            <p className="text-sm">Check-out: {listing.check_out}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => onEdit(listing)}
            >
              Edit
            </Button>
            <ShareListingButton listingId={listing.id} />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(listing.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}