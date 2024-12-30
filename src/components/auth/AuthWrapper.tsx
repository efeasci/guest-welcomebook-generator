import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      console.log("Initial session check:", session?.user ? "User found" : "No user");
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing state and redirecting");
        setUser(null);
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        navigate('/login', { replace: true });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("User signed in or token refreshed");
        setUser(session?.user ?? null);
        navigate('/', { replace: true });
      } else if (event === 'USER_UPDATED') {
        console.log("User profile updated");
        setUser(session?.user ?? null);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};