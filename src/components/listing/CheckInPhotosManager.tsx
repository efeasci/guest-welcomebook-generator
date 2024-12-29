import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, GripVertical, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CheckInPhoto {
  id: string;
  photo_url: string;
  caption: string;
  display_order: number;
}

interface CheckInPhotosManagerProps {
  listingId: string;
}

const CheckInPhotosManager = ({ listingId }: CheckInPhotosManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['check-in-photos', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('check_in_photos')
        .select('*')
        .eq('listing_id', listingId)
        .order('display_order');

      if (error) throw error;
      return data as CheckInPhoto[];
    },
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (photos.length >= 5) {
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
          display_order: photos.length,
          caption: ''
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['check-in-photos', listingId] });
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCaptionChange = async (photoId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('check_in_photos')
        .update({ caption })
        .eq('id', photoId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['check-in-photos', listingId] });
    } catch (error) {
      console.error("Error updating caption:", error);
      toast.error("Failed to update caption");
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('check_in_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['check-in-photos', listingId] });
      toast.success("Photo deleted successfully");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  const movePhoto = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= photos.length) return;

    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);

    try {
      // Create updates with all required fields
      const updates = newPhotos.map((photo, index) => ({
        id: photo.id,
        listing_id: listingId,
        photo_url: photo.photo_url,
        caption: photo.caption,
        display_order: index
      }));

      const { error } = await supabase
        .from('check_in_photos')
        .upsert(updates);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['check-in-photos', listingId] });
    } catch (error) {
      console.error("Error reordering photos:", error);
      toast.error("Failed to reorder photos");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Check-in Photos</h3>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="check-in-photo-upload"
            disabled={isUploading || photos.length >= 5}
          />
          <label htmlFor="check-in-photo-upload">
            <Button
              variant="outline"
              disabled={isUploading || photos.length >= 5}
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
      </div>

      {photos.length > 0 && (
        <Carousel className="w-full">
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem key={photo.id} className="basis-1/2 lg:basis-1/3">
                <div className="relative group">
                  <img
                    src={photo.photo_url}
                    alt={`Check-in photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => movePhoto(index, index - 1)}
                        >
                          ←
                        </Button>
                      )}
                      {index < photos.length - 1 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => movePhoto(index, index + 1)}
                        >
                          →
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(photo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Input
                    value={photo.caption || ''}
                    onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                    placeholder="Add a caption..."
                    className="mt-2"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};

export default CheckInPhotosManager;