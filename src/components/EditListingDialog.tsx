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
    wifi_network: string | null;
    check_in: string;
    check_out: string;
    house_rules: string[] | null;
    image_url?: string | null;
    check_in_method?: string | null;
    check_in_instructions?: string | null;
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
    wifi_network: listing.wifi_network || "",
    check_in: listing.check_in,
    check_out: listing.check_out,
    house_rules: listing.house_rules?.join("\n") || "",
    image_url: listing.image_url || "",
    check_in_method: listing.check_in_method || "",
    check_in_instructions: listing.check_in_instructions || "",
    before_you_leave: listing.before_you_leave?.join("\n") || "",
  });

  const handleFieldChange = (field: string, value: string) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      if (error) {
        console.error("Error updating listing:", error);
        throw error;
      }

      toast.success("Listing updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
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