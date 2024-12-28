import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditListingDialogProps {
  listing: {
    id: string;
    title: string;
    address: string;
    wifi_password: string | null;
    check_in: string;
    check_out: string;
    house_rules: string[] | null;
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting edit form:", formData);

    try {
      const { error } = await supabase
        .from("listings")
        .update({
          ...formData,
          house_rules: formData.house_rules.split("\n").filter(rule => rule.trim()),
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
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="wifi" className="text-sm font-medium">
              WiFi Password
            </label>
            <Input
              id="wifi"
              value={formData.wifi_password}
              onChange={(e) => setFormData({ ...formData, wifi_password: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="check_in" className="text-sm font-medium">
              Check-in Time
            </label>
            <Input
              id="check_in"
              type="time"
              value={formData.check_in}
              onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="check_out" className="text-sm font-medium">
              Check-out Time
            </label>
            <Input
              id="check_out"
              type="time"
              value={formData.check_out}
              onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="rules" className="text-sm font-medium">
              House Rules (one per line)
            </label>
            <Textarea
              id="rules"
              value={formData.house_rules}
              onChange={(e) => setFormData({ ...formData, house_rules: e.target.value })}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingDialog;