import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Create Beautiful Welcome Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Make your guests feel at home with personalized welcome guides. Share everything they need to know about your property in one beautiful place.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/edit")}
            >
              Get Started
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <FeatureCard
              title="Easy to Create"
              description="Create beautiful welcome guides in minutes with our intuitive editor."
              icon="✨"
            />
            <FeatureCard
              title="Share Instantly"
              description="Share your guide with guests instantly via a unique link."
              icon="🔗"
            />
            <FeatureCard
              title="Always Updated"
              description="Keep your guide up to date with the latest information."
              icon="🔄"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}