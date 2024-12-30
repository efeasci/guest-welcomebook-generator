import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Create Beautiful Welcome Guides
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Make your guests feel at home with personalized welcome guides. Share everything they need to know about your property in one beautiful place.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/edit")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}