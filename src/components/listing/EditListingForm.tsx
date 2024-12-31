import { Button } from "@/components/ui/button";
import ListingBasicFields from "./ListingBasicFields";
import ListingCheckInFields from "./ListingCheckInFields";
import ListingWifiFields from "./ListingWifiFields";
import ListingRulesFields from "./ListingRulesFields";
import ListingHostFields from "./ListingHostFields";
import ImageUploadSection from "./ImageUploadSection";
import RecommendationsManager from "./RecommendationsManager";
import CheckInPhotosManager from "./CheckInPhotosManager";
import { useListingForm } from "./useListingForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface EditListingFormProps {
  initialData: {
    title: string;
    address: string;
    wifi_password: string;
    wifi_network: string;
    check_in: string;
    check_in_instructions: string;
    check_in_method: string;
    check_out: string;
    house_rules: string[] | string;
    before_you_leave: string[] | string;
    image_url: string;
    directions: string;
    host_name: string;
    host_about: string;
    host_email: string;
    host_phone: string;
    user_id?: string;
  };
  id?: string;
  onAnonymousSubmit?: (formData: any) => void;
  onSuccess?: (listingId: string) => void;
}

const EditListingForm = ({ initialData, id, onAnonymousSubmit, onSuccess }: EditListingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, handleChange, handleSubmit, currentListingId } = useListingForm(initialData, id);

  const onSubmit = async () => {
    if (!user && onAnonymousSubmit) {
      onAnonymousSubmit(formData);
      return;
    }
    const listingId = await handleSubmit();
    if (listingId && onSuccess) {
      onSuccess(listingId);
    }
  };

  return (
    <div className="space-y-8">
      <ImageUploadSection
        id={currentListingId}
        imageUrl={formData.image_url}
        onImageUpload={(url) => handleChange("image_url", url)}
      />

      <ListingBasicFields
        formData={formData}
        onChange={handleChange}
      />
      
      <ListingCheckInFields
        formData={formData}
        onChange={handleChange}
      />

      {currentListingId && (
        <CheckInPhotosManager listingId={currentListingId} />
      )}

      <ListingWifiFields
        formData={formData}
        onChange={handleChange}
      />
      
      <ListingRulesFields
        formData={formData}
        onChange={handleChange}
      />

      <ListingHostFields
        formData={formData}
        onChange={handleChange}
      />

      {currentListingId && (
        <RecommendationsManager
          listingId={currentListingId}
          address={formData.address}
        />
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {id ? "Save Changes" : "Create Listing"}
        </Button>
      </div>
    </div>
  );
};

export default EditListingForm;