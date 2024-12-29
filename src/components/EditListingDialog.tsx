import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import ListingBasicFields from "./listing/ListingBasicFields";
import ListingCheckInFields from "./listing/ListingCheckInFields";
import ListingRulesFields from "./listing/ListingRulesFields";

interface EditListingDialogProps {
  listing: {
    id: string;
    title: string;
    address: string;
    wifi_password: string | null;
    check_in: string;
    check_out: string;
    house_rules: string[] | null;
    airbnb_link?: string | null;
    image_url?: string | null;
    check_in_method?: string | null;
    before_you_leave?: string[] | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditListingDialog = ({ listing, open, onOpenChange, onSuccess }: EditListingDialogProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: listing.title,
    address: listing.address,
    wifi_password: listing.wifi_password || "",
    check_in: listing.check_in,
    check_out: listing.check_out,
    house_rules: listing.house_rules?.join("\n") || "",
    airbnb_link: listing.airbnb_link || "",
    image_url: listing.image_url || "",
    check_in_method: listing.check_in_method || "",
    before_you_leave: listing.before_you_leave?.join("\n") || "",
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAirbnbSync = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      address: data.address || prev.address,
      image_url: data.image_url || prev.image_url,
      check_in: data.check_in || prev.check_in,
      check_out: data.check_out || prev.check_out,
      house_rules: data.house_rules?.join("\n") || prev.house_rules,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting edit form:", formData);

    try {
      const { error } = await supabase
        .from("listings")
        .update({
          ...formData,
          house_rules: formData.house_rules.split("\n").filter(rule => rule.trim()),
          before_you_leave: formData.before_you_leave.split("\n").filter(rule => rule.trim()),
          updated_at: new Date().toISOString(),
        })
        .eq("id", listing.id);

      if (error) throw error;

      toast.success("Listing updated successfully");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ListingBasicFields 
            formData={formData} 
            onChange={handleFieldChange} 
            onAirbnbSync={handleAirbnbSync}
          />
          <ListingCheckInFields formData={formData} onChange={handleFieldChange} />
          <ListingRulesFields formData={formData} onChange={handleFieldChange} />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingDialog;