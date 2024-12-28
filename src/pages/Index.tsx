import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import AddListingDialog from "@/components/AddListingDialog";
import EditListingDialog from "@/components/EditListingDialog";
import { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Tables<"listings">[]>([]);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
          toast({
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
  }, [user, toast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome{profile?.username ? `, ${profile.username}` : ''}</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Listing</Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <AddListingDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="p-6">
            <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
            <p className="text-gray-600 mb-4">{listing.address}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Check-in: {listing.check_in}</p>
                <p className="text-sm">Check-out: {listing.check_out}</p>
              </div>
              <EditListingDialog
                listing={listing}
                onSuccess={() => {
                  toast({
                    title: "Success",
                    description: "Listing updated successfully",
                  });
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}