import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, SemiProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import EditListing from "./pages/EditListing";
import TopNav from "./components/TopNav";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper>
            <TopNav />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/welcome/:id"
                element={<Welcome />}
              />
              <Route
                path="/edit/:id?"
                element={
                  <SemiProtectedRoute>
                    <EditListing />
                  </SemiProtectedRoute>
                }
              />
            </Routes>
          </AuthWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;