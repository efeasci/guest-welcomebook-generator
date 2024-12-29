import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ShareListingButtonProps {
  listingId: string;
}

const ShareListingButton = ({ listingId }: ShareListingButtonProps) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/welcome/${listingId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this listing",
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast("Link copied to clipboard!");
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      className="ml-2"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};

export default ShareListingButton;