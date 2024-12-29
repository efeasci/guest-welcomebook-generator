import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CheckInPhotosSectionProps {
  listingId: string;
}

const CheckInPhotosSection = ({ listingId }: CheckInPhotosSectionProps) => {
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['check-in-photos', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('check_in_photos')
        .select('*')
        .eq('listing_id', listingId)
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return null;
  if (photos.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Camera className="h-5 w-5 text-primary" /> Check-in Photos
      </h2>
      <Carousel className="w-full">
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem key={photo.id}>
              <div className="space-y-2">
                <img
                  src={photo.photo_url}
                  alt={photo.caption || 'Check-in photo'}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {photo.caption && (
                  <p className="text-sm text-center text-muted-foreground">
                    {photo.caption}
                  </p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default CheckInPhotosSection;