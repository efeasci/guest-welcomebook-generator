import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UserActions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isDashboard = location.pathname === '/dashboard';

  const handleSignOut = async () => {
    try {
      console.log("Signing out from UserActions...");
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
  );
};

export default UserActions;