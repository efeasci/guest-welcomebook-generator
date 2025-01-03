import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CountryCodeSelect } from "./CountryCodeSelect";

interface ListingHostFieldsProps {
  formData: {
    host_name: string;
    host_about: string;
    host_email: string;
    host_phone: string;
  };
  onChange: (field: string, value: string) => void;
}

const ListingHostFields = ({ formData, onChange }: ListingHostFieldsProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  const handlePhoneChange = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/^\+\d+\s*/, '');
    onChange("host_phone", `${selectedCountryCode} ${cleanNumber}`);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Your Host</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="host_name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="host_name"
            value={formData.host_name || ""}
            onChange={(e) => onChange("host_name", e.target.value)}
            placeholder="Enter host name"
          />
        </div>
        <div>
          <label htmlFor="host_about" className="text-sm font-medium">
            About
          </label>
          <Textarea
            id="host_about"
            value={formData.host_about || ""}
            onChange={(e) => onChange("host_about", e.target.value)}
            placeholder="Enter information about the host"
          />
        </div>
        <div>
          <label htmlFor="host_email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="host_email"
            type="email"
            value={formData.host_email || ""}
            onChange={(e) => onChange("host_email", e.target.value)}
            placeholder="Enter host email"
          />
        </div>
        <div>
          <label htmlFor="host_phone" className="text-sm font-medium">
            Phone
          </label>
          <div className="flex gap-2">
            <CountryCodeSelect
              value={selectedCountryCode}
              onValueChange={(value) => {
                setSelectedCountryCode(value);
                handlePhoneChange(formData.host_phone?.replace(/^\+\d+\s*/, '') || '');
              }}
            />
            <Input
              id="host_phone"
              type="tel"
              value={formData.host_phone?.replace(/^\+\d+\s*/, '') || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingHostFields;