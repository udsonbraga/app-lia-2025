
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportLocation } from "@/features/support-network/types";
import { openMap } from "@/features/support-network/data";

interface LocationCardProps {
  location: SupportLocation;
}

const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{location.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{location.address}</p>
          <p className="text-sm text-gray-600 mt-1">{location.phone}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-red-500 border-red-200"
          onClick={() => openMap(location)}
        >
          <MapPin className="h-4 w-4" />
          <span>Navegar</span>
        </Button>
      </div>
    </div>
  );
};

export default LocationCard;
