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
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {photos.map((photo) => (
              <CarouselItem key={photo.id}>
                <div className="space-y-2">
                  <div className="aspect-[3/2] w-full">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || 'Check-in photo'}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  {photo.caption && (
                    <p className="text-sm text-center text-muted-foreground">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-12 lg:-left-16 bg-black/50 hover:bg-black/70 text-white !flex" />
          <CarouselNext className="absolute -right-12 lg:-right-16 bg-black/50 hover:bg-black/70 text-white !flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default CheckInPhotosSection;