import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadSectionProps {
  id?: string;
  imageUrl: string;
  onImageUpload: (url: string) => void;
}

const ImageUploadSection = ({ id, imageUrl, onImageUpload }: ImageUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${id || 'new'}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Listing Image</h2>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button 
              variant="outline" 
              disabled={isUploading}
              className="cursor-pointer"
              asChild
            >
              <span>
                <ImagePlus className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload listing image"}
              </span>
            </Button>
          </label>
        </div>
      </div>
      
      {imageUrl && (
        <div className="w-full h-48 relative">
          <img
            src={imageUrl}
            alt="Listing"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;