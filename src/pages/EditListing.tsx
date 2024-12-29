import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditListingForm from "@/components/listing/EditListingForm";
import { useAuth } from "@/App";

export default function EditListing() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isLoading, data: listing } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!id) return null; // Return null for new listings
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

  // For new listings, provide default values
  const initialData = listing || {
    title: "",
    address: "",
    wifi_password: "",
    check_in: "14:00",
    check_out: "11:00",
    house_rules: [],
    before_you_leave: [],
    airbnb_link: "",
    image_url: "",
    check_in_method: "",
    user_id: user?.id,
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? "Edit Listing" : "Add New Listing"}</h1>
      <EditListingForm id={id} initialData={initialData} />
    </div>
  );
}