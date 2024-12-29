import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { countryCodes } from "./countryCodesData";

interface CountryCodeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CountryCodeSelect = ({ value, onValueChange }: CountryCodeSelectProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCountries = countryCodes.filter(country => 
    country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <span>{value}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 pb-2">
          <Input
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {filteredCountries.map((country) => (
            <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.code}</span>
                <span className="text-muted-foreground">({country.country})</span>
              </div>
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};