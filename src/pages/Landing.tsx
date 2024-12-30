import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cloud, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Cloud,
    title: "Smart Welcome Guides",
    description: "Create intelligent welcome guides for your properties"
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Automated recommendations and content generation"
  },
  {
    icon: Activity,
    title: "Real-time Updates",
    description: "Keep your guests informed with live updates"
  },
  {
    icon: Star,
    title: "Guest Experience",
    description: "Enhance guest satisfaction with detailed guides"
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    features: ["1 Property", "Basic Welcome Guide", "Guest Support", "Photo Upload"],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    price: "$29/mo",
    features: ["10 Properties", "AI Recommendations", "Priority Support", "Analytics Dashboard"],
    buttonText: "Try Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited Properties", "Custom Branding", "API Access", "Dedicated Support"],
    buttonText: "Contact Sales",
    popular: false
  }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute inset-0 bg-[size:20px_20px] blur-[100px] animate-[move_8s_linear_infinite]
            bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-500 to-purple-600 animate-fade-in">
          Welcome Wizard Platform
        </h1>
        <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-100">
          Create intelligent welcome guides for your properties with AI-powered recommendations
        </p>
        <div className="flex gap-4 justify-center animate-fade-in delay-200">
          <Button size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={feature.title} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm
              hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card key={plan.name} className={`border-0 shadow-lg animate-fade-in
              ${plan.popular ? 'bg-blue-500/10 ring-2 ring-blue-500' : 'bg-card/50'} 
              backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-bold">{plan.price}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}