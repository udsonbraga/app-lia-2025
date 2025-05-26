
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  location: string;
  onChange: (value: string) => void;
}

const LocationInput = ({ location, onChange }: LocationInputProps) => {
  return (
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
        Local da Ocorrência
      </label>
      <div className="mt-1 flex items-center">
        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          id="location"
          value={location}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Onde ocorreu o incidente?"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default LocationInput;
