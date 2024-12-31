import { Tables } from "@/integrations/supabase/types";
import ListingCard from "./ListingCard";
import { useNavigate } from "react-router-dom";

interface ListingsGridProps {
  listings: Tables<"listings">[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onEdit={(listing) => navigate(`/edit/${listing.id}`)}
        />
      ))}
    </div>
  );
}