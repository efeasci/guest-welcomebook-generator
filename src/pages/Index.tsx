import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import DashboardHeader from "@/components/listing/DashboardHeader";
import LoadingDashboard from "@/components/listing/LoadingDashboard";
import ListingsGrid from "@/components/listing/ListingsGrid";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [listings, setListings] = useState<Tables<"listings">[]>([]);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!user) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Fetching data for user:', user.id);

        // Fetch user's listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", user.id);

        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
          uiToast({
            title: "Error",
            description: "Failed to fetch listings",
            variant: "destructive",
          });
          return;
        }

        console.log('Fetched listings:', listingsData?.length);
        setListings(listingsData || []);

        // Fetch user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          console.log('Fetched profile:', profileData);
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, uiToast]);

  if (isLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <DashboardHeader 
        profile={profile}
        userEmail={user?.email}
        onAddListing={() => navigate('/edit')}
      />
      <ListingsGrid listings={listings} />
    </div>
  );
}