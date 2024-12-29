import { useParams } from "react-router-dom";
import { Wifi, Clock, MapPin, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  // Get a random placeholder image
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-xl overflow-hidden">
          <div className="w-full h-48 relative">
            <img 
              src={`https://source.unsplash.com/${randomPlaceholder}`}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Welcome to {listing.title}
            </CardTitle>
            <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" /> {listing.address}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {listing.wifi_password && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" /> WiFi Information
                </h2>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="font-mono text-lg">{listing.wifi_password}</p>
                </div>
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Check-in/out Times
              </h2>
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
            </section>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;