import { Input } from "@/components/ui/input";

interface ListingWifiFieldsProps {
  formData: {
    wifi_network: string;
    wifi_password: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingWifiFields = ({ formData, onChange }: ListingWifiFieldsProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">WiFi Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="wifi_network" className="text-sm font-medium">
            WiFi Network Name
          </label>
          <Input
            id="wifi_network"
            value={formData.wifi_network}
            onChange={(e) => onChange("wifi_network", e.target.value)}
            placeholder="Enter WiFi network name"
          />
        </div>
        <div>
          <label htmlFor="wifi_password" className="text-sm font-medium">
            WiFi Password
          </label>
          <Input
            id="wifi_password"
            value={formData.wifi_password}
            onChange={(e) => onChange("wifi_password", e.target.value)}
            placeholder="Enter WiFi password"
          />
        </div>
      </div>
    </div>
  );
};

export default ListingWifiFields;