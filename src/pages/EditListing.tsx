import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditListingForm from "@/components/listing/EditListingForm";

export default function EditListing() {
  const { id } = useParams();

  const { isLoading, data: listing } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!listing) {
    return <div className="flex items-center justify-center min-h-screen">Listing not found</div>;
  }

  const initialData = {
    ...listing,
    house_rules: listing.house_rules || [],
    before_you_leave: listing.before_you_leave || [],
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <EditListingForm id={listing.id} initialData={initialData} />
    </div>
  );
}