import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PhotoUploader from "./check-in-photos/PhotoUploader";
import PhotoCarousel from "./check-in-photos/PhotoCarousel";
import { CheckInPhoto } from "./check-in-photos/types";

interface CheckInPhotosManagerProps {
  listingId: string;
}

const CheckInPhotosManager = ({ listingId }: CheckInPhotosManagerProps) => {
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
        <PhotoUploader
          listingId={listingId}
          currentPhotosCount={photos.length}
          onPhotoUploaded={() => queryClient.invalidateQueries({ queryKey: ['check-in-photos', listingId] })}
        />
      </div>

      {photos.length > 0 && (
        <PhotoCarousel
          photos={photos}
          onCaptionChange={handleCaptionChange}
          onDelete={handleDelete}
          onMove={movePhoto}
        />
      )}
    </div>
  );
};

export default CheckInPhotosManager;