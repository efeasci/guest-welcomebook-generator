import { useParams } from "react-router-dom";
import { Wifi, Clock, MapPin, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Welcome = () => {
  const { id } = useParams();
  
  // In a real app, we would fetch this data based on the ID
  const listing = {
    id: "1",
    title: "Cozy Downtown Apartment",
    address: "123 Main St, City",
    wifiPassword: "guest123",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    houseRules: ["No smoking", "No parties", "Quiet hours 10 PM - 8 AM"],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Welcome to {listing.title}
            </CardTitle>
            <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" /> {listing.address}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" /> WiFi Information
              </h2>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="font-mono text-lg">{listing.wifiPassword}</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Check-in/out Times
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="font-semibold">Check-in</p>
                  <p>{listing.checkIn}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="font-semibold">Check-out</p>
                  <p>{listing.checkOut}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" /> House Rules
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {listing.houseRules.map((rule, index) => (
                  <li key={index} className="text-gray-700">{rule}</li>
                ))}
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;