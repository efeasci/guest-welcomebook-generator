import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Plus, LayoutDashboard } from "lucide-react";

const TopNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-semibold text-lg cursor-pointer" onClick={() => navigate("/")}>
          Welcome Wizard
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                onClick={() => navigate("/edit")}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Listing
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
              <Button
                onClick={() => navigate("/edit")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;