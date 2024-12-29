import { useParams } from "react-router-dom";
import { 
  Wifi, 
  Clock, 
  MapPin, 
  Book, 
  DoorClosed, 
  Navigation2, 
  Info,
  Mail,
  Phone,
  User,
  Key
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Map from "@/components/Map";

const Welcome = () => {
  const { id } = useParams();
  
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!listing) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Listing not found</div>;
  }

  const placeholders = [
    'photo-1649972904349-6e44c42644a7',
    'photo-1488590528505-98d2b5aba04b',
    'photo-1518770660439-4636190af475',
    'photo-1461749280684-dccba630e2f6',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1581091226825-a6a2a5aee158',
    'photo-1485827404703-89b55fcc595e',
    'photo-1526374965328-7f61d4dc18c5'
  ];
  
  const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-xl overflow-hidden">
          {/* Image and Title Section */}
          <div className="w-full h-48 relative">
            <img 
              src={listing.image_url || `https://source.unsplash.com/${randomPlaceholder}`}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Welcome to {listing.title}
            </CardTitle>
            <a 
              href={getGoogleMapsUrl(listing.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="h-4 w-4" /> {listing.address}
            </a>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Location Section */}
            <section className="space-y-4">
              <div className="h-64 w-full">
                <Map address={listing.address} className="h-full" />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a
                    href={getDirectionsUrl(listing.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Navigation2 className="h-4 w-4" />
                    Get Directions
                  </a>
                </Button>
              </div>
            </section>

            {/* Host Information Section */}
            {(listing.host_name || listing.host_about || listing.host_email || listing.host_phone) && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Your Host
                </h2>
                <div className="bg-secondary/50 p-4 rounded-lg space-y-4">
                  {listing.host_name && (
                    <div>
                      <p className="font-semibold">Name</p>
                      <p>{listing.host_name}</p>
                    </div>
                  )}
                  {listing.host_about && (
                    <div>
                      <p className="font-semibold">About</p>
                      <p>{listing.host_about}</p>
                    </div>
                  )}
                  {listing.host_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${listing.host_email}`} className="text-primary hover:underline">
                        {listing.host_email}
                      </a>
                    </div>
                  )}
                  {listing.host_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${listing.host_phone}`} className="text-primary hover:underline">
                        {listing.host_phone}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Check-in Information Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" /> Check-in Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="font-semibold">Check-in</p>
                    <p>{listing.check_in}</p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="font-semibold">Check-out</p>
                    <p>{listing.check_out}</p>
                  </div>
                </div>
                {listing.check_in_method && (
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold">Check-in Method</p>
                    <p>{listing.check_in_method}</p>
                  </div>
                )}
                {listing.check_in_instructions && (
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold">Check-in Instructions</p>
                    <p className="whitespace-pre-wrap">{listing.check_in_instructions}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Directions Section */}
            {listing.directions && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" /> Directions
                </h2>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{listing.directions}</p>
                </div>
              </section>
            )}

            {/* WiFi Information Section */}
            {(listing.wifi_network || listing.wifi_password) && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" /> WiFi Information
                </h2>
                <div className="bg-secondary p-4 rounded-lg space-y-2">
                  {listing.wifi_network && (
                    <div>
                      <p className="text-sm text-muted-foreground">Network Name</p>
                      <p className="font-mono text-lg">{listing.wifi_network}</p>
                    </div>
                  )}
                  {listing.wifi_password && (
                    <div>
                      <p className="text-sm text-muted-foreground">Password</p>
                      <p className="font-mono text-lg">{listing.wifi_password}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* House Rules Section */}
            {listing.house_rules && listing.house_rules.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Book className="h-5 w-5 text-primary" /> House Rules
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {listing.house_rules.map((rule, index) => (
                    <li key={index} className="text-gray-700">{rule}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Before You Leave Section */}
            {listing.before_you_leave && listing.before_you_leave.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <DoorClosed className="h-5 w-5 text-primary" /> Before You Leave
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {listing.before_you_leave.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ul>
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;