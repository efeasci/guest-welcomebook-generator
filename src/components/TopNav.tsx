import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isDashboard = location.pathname === '/dashboard';

  const handleSignOut = async () => {
    try {
      console.log("Signing out from TopNav...");
      // First check if we have a session
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.log("No active session found, redirecting to login...");
        navigate('/login');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        });
      } else {
        console.log("Successfully signed out");
        toast({
          title: "Success",
          description: "You have been signed out",
        });
        navigate('/login');
      }
    } catch (error) {
      console.error("Error in sign out:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-semibold text-lg cursor-pointer" onClick={() => navigate("/")}>
          Welcome Wizard
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {!isDashboard && (
                <Button
                  onClick={() => navigate("/edit")}
                >
                  New Listing
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
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
                onClick={() => navigate("/login")}
              >
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