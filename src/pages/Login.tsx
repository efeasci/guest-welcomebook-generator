import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const draftListing = location.state?.draftListing;

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      if (draftListing) {
        // If there's a draft listing, navigate to edit page
        navigate("/edit", { state: { draftListing } });
      } else {
        navigate("/");
      }
    }

    // Listen for auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        navigate("/");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in successfully");
        if (draftListing) {
          // If there's a draft listing, navigate to edit page
          navigate("/edit", { state: { draftListing } });
        } else {
          navigate("/");
        }
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, navigate, toast, draftListing]);

  const redirectUrl = window.location.origin + window.location.pathname;
  console.log("Redirect URL:", redirectUrl);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {location.state?.message || "Welcome"}
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#666666',
                }
              }
            }
          }}
          providers={["google"]}
          redirectTo={redirectUrl}
        />
      </div>
    </div>
  );
}