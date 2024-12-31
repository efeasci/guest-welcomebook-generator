import { useAuth } from "@/contexts/AuthContext";
import Logo from "./nav/Logo";
import UserActions from "./nav/UserActions";
import GuestActions from "./nav/GuestActions";

const TopNav = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          {user ? <UserActions /> : <GuestActions />}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;