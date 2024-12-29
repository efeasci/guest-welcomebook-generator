import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhotoUploaderProps {
  listingId: string;
  currentPhotosCount: number;
  onPhotoUploaded: () => void;
}

const PhotoUploader = ({ listingId, currentPhotosCount, onPhotoUploaded }: PhotoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (currentPhotosCount >= 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${listingId}/check-in/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('check_in_photos')
        .insert({
          listing_id: listingId,
          photo_url: publicUrl,
          display_order: currentPhotosCount,
          caption: ''
        });

      if (dbError) throw dbError;

      onPhotoUploaded();
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        id="check-in-photo-upload"
        disabled={isUploading || currentPhotosCount >= 5}
      />
      <label htmlFor="check-in-photo-upload">
        <Button
          variant="outline"
          disabled={isUploading || currentPhotosCount >= 5}
          className="cursor-pointer"
          asChild
        >
          <span>
            <ImagePlus className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Add Photo"}
          </span>
        </Button>
      </label>
    </div>
  );
};

export default PhotoUploader;