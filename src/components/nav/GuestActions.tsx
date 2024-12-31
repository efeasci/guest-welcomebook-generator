import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const GuestActions = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default GuestActions;