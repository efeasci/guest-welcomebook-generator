import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

interface DashboardHeaderProps {
  profile: Tables<"profiles"> | null;
  userEmail?: string;
  onAddListing: () => void;
  onSignOut: () => void;
}

export default function DashboardHeader({ profile, userEmail, onAddListing, onSignOut }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome{profile?.username ? `, ${profile.username}` : ''}</h1>
        <p className="text-gray-600">{userEmail}</p>
      </div>
      <div className="flex gap-4">
        <Button onClick={onAddListing}>Add Listing</Button>
        <Button variant="outline" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}