import { useState } from "react";
import { Plus, Share2, Wifi, Clock, Book, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditListingDialog } from "@/components/EditListingDialog";
import { AddListingDialog } from "@/components/AddListingDialog";

interface Listing {
  id: string;
  title: string;
  address: string;
  wifi_password: string | null;
  check_in: string;
  check_out: string;
  house_rules: string[] | null;
}

const Index = () => {
  const queryClient = useQueryClient();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch listings
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log('Fetching listings...');
      const { data, error } = await supabase
        .from('listings')
        .select('*');
      
      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      console.log('Fetched listings:', data);
      return data as Listing[];
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting listing:', id);
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting listing:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast.success('Listing deleted successfully');
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast.error('Failed to delete listing');
    }
  });

  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/welcome/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Welcome page link copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Listings</h1>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-xl">{listing.title}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(listing.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingListing(listing)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{listing.address}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    WiFi Password: {listing.wifi_password || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Check-in: {listing.check_in} | Check-out: {listing.check_out}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {listing.house_rules?.length || 0} House Rules
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingListing && (
        <EditListingDialog
          listing={editingListing}
          open={!!editingListing}
          onOpenChange={(open) => !open && setEditingListing(null)}
        />
      )}

      <AddListingDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default Index;
