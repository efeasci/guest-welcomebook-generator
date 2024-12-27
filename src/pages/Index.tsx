import { useState } from "react";
import { Plus, Share2, Wifi, Clock, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  address: string;
  wifiPassword: string;
  checkIn: string;
  checkOut: string;
  houseRules: string[];
}

const Index = () => {
  const [listings, setListings] = useState<Listing[]>([
    {
      id: "1",
      title: "Cozy Downtown Apartment",
      address: "123 Main St, City",
      wifiPassword: "guest123",
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      houseRules: ["No smoking", "No parties", "Quiet hours 10 PM - 8 AM"],
    },
  ]);

  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/welcome/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Welcome page link copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Listings</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-xl">{listing.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare(listing.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{listing.address}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span className="text-sm">WiFi Password: {listing.wifiPassword}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Check-in: {listing.checkIn} | Check-out: {listing.checkOut}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-primary" />
                  <span className="text-sm">{listing.houseRules.length} House Rules</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;