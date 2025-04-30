
import { ReactNode, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NavigationCardProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}

export function NavigationCard({ id, title, description, icon, onClick }: NavigationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg ${
        isHovered ? "scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Monochromatic background */}
      <div className="absolute inset-0 bg-safelady opacity-5"></div>
      
      {/* Button content with reduced padding */}
      <div className="relative z-10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon with circular background */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-safelady text-white">
            {icon}
          </div>
          
          {/* Text content */}
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
            <p className="text-gray-600 text-xs">{description}</p>
          </div>
        </div>
        
        {/* Arrow icon that appears on hover */}
        <div className={`transition-all duration-300 ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
        }`}>
          <ArrowRight className="h-4 w-4 text-safelady" />
        </div>
      </div>
    </Card>
  );
}
