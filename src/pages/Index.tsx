import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import ListingCard from "@/components/listing/ListingCard";
import DashboardHeader from "@/components/listing/DashboardHeader";

const placeholderImages = [
  'photo-1649972904349-6e44c42644a7',
  'photo-1488590528505-98d2b5aba04b',
  'photo-1518770660439-4636190af475',
  'photo-1461749280684-dccba630e2f6',
  'photo-1486312338219-ce68d2c6f44d',
  'photo-1581091226825-a6a2a5aee158',
  'photo-1485827404703-89b55fcc595e',
  'photo-1526374965328-7f61d4dc18c5'
];

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [listings, setListings] = useState<Tables<"listings">[]>([]);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user's listings
      const fetchListings = async () => {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching listings:", error);
          uiToast({
            title: "Error",
            description: "Failed to fetch listings",
            variant: "destructive",
          });
        } else {
          setListings(data);
        }
      };

      // Fetch user's profile
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      };

      fetchListings();
      fetchProfile();
    }
  }, [user, uiToast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      uiToast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      setListings(listings.filter(listing => listing.id !== listingId));
      toast("Listing deleted successfully");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader 
        profile={profile}
        userEmail={user?.email}
        onAddListing={() => navigate('/edit')}
        onSignOut={handleSignOut}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing, index) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            placeholderImage={placeholderImages[index % placeholderImages.length]}
            onEdit={(listing) => navigate(`/edit/${listing.id}`)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}