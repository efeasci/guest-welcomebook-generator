import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TopNav from "./components/TopNav";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import EditListing from "./pages/EditListing";
import { AuthWrapper } from "./components/auth/AuthWrapper";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <TopNav />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome/:id" element={<Welcome />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AuthWrapper>
                    <Landing />
                  </AuthWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/new"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/:id/edit"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;