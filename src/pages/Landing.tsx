import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Users, Layout } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Create Stunning Welcome Pages for your guests in Minutes!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Elevate your hosting experience with beautiful, customizable welcome pages that delight your guests
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/edit")}
            className="gap-2"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Welcome Wizard?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless Guest Onboarding</h3>
              <p className="text-muted-foreground">
                Create beautiful welcome pages with all the information your guests need
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Boost Superhost Status</h3>
              <p className="text-muted-foreground">
                Improve your ratings with professional and organized guest information
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Happy Guests</h3>
              <p className="text-muted-foreground">
                Provide a stress-free check-in experience for your guests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Guest Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of hosts who are delighting their guests with Welcome Wizard
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/edit")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}