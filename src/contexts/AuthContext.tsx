import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => {
  return useContext(AuthContext);
};