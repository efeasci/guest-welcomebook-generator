import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CheckInPhoto } from "./types";

interface PhotoCarouselProps {
  photos: CheckInPhoto[];
  onCaptionChange: (photoId: string, caption: string) => void;
  onDelete: (photoId: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const PhotoCarousel = ({ photos, onCaptionChange, onDelete, onMove }: PhotoCarouselProps) => {
  return (
    <Carousel className="w-full relative">
      <CarouselContent>
        {photos.map((photo, index) => (
          <CarouselItem key={photo.id} className="basis-1/2 lg:basis-1/3">
            <div className="relative group">
              <div className="aspect-[3/2] w-full">
                <img
                  src={photo.photo_url}
                  alt={`Check-in photo ${index + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex gap-2">
                  {index > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onMove(index, index - 1)}
                    >
                      ←
                    </Button>
                  )}
                  {index < photos.length - 1 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onMove(index, index + 1)}
                    >
                      →
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(photo.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div 
                className="mt-2 relative group cursor-text" 
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) {
                    input.focus();
                    e.stopPropagation();
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const input = e.currentTarget.querySelector('input');
                    if (input) input.focus();
                  }
                  e.stopPropagation();
                }}
              >
                <Input
                  value={photo.caption || ''}
                  onChange={(e) => onCaptionChange(photo.id, e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full transition-colors hover:border-primary focus-visible:ring-1"
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute -left-12 lg:-left-16 bg-black/70 hover:bg-black/90 text-white !flex h-12 w-12">
        <ChevronLeft className="h-8 w-8" />
      </CarouselPrevious>
      <CarouselNext className="absolute -right-12 lg:-right-16 bg-black/70 hover:bg-black/90 text-white !flex h-12 w-12">
        <ChevronRight className="h-8 w-8" />
      </CarouselNext>
    </Carousel>
  );
};

export default PhotoCarousel;