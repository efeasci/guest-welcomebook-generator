import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditListingForm from "@/components/listing/EditListingForm";
import { useAuth } from "@/App";
import { toast } from "sonner";

export default function EditListing() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isLoading, data: listing } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleAnonymousSubmit = () => {
    toast.error("Please create an account to save your listing", {
      action: {
        label: "Sign Up",
        onClick: () => navigate("/login"),
      },
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Provide default values for all required fields
  const initialData = listing || {
    title: "",
    address: "",
    wifi_password: "",
    wifi_network: "",
    check_in: "14:00",
    check_out: "11:00",
    check_in_method: "",
    check_in_instructions: "",
    house_rules: [],
    before_you_leave: [],
    airbnb_link: "",
    image_url: "",
    directions: "",
    host_name: "",
    host_about: "",
    host_email: "",
    host_phone: "",
    user_id: user?.id,
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl pt-24">
      <h1 className="text-2xl font-bold mb-6">{id ? "Edit Listing" : "Add New Listing"}</h1>
      <EditListingForm 
        id={id} 
        initialData={initialData} 
        onAnonymousSubmit={handleAnonymousSubmit}
      />
    </div>
  );
}