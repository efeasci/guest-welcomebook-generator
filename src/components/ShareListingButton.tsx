import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareListingButtonProps {
  welcomePageUrl: string;
  listingTitle: string;
}

const ShareListingButton = ({ welcomePageUrl, listingTitle }: ShareListingButtonProps) => {
  const handleShare = async () => {
    console.log("Sharing listing:", welcomePageUrl);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Welcome to ${listingTitle}`,
          url: welcomePageUrl,
        });
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(welcomePageUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to clipboard copy if share fails
      try {
        await navigator.clipboard.writeText(welcomePageUrl);
        toast.success("Link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError);
        toast.error("Failed to share");
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="flex-1"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
};

export default ShareListingButton;