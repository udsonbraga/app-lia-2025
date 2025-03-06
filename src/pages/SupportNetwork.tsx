
import { useState } from "react";
import { openMap } from "@/features/support-network/data";
import { ActiveTab, SupportLocation } from "@/features/support-network/types";
import Header from "@/components/support-network/Header";
import TabNavigation from "@/components/support-network/TabNavigation";
import LocationCard from "@/components/support-network/LocationCard";
import RightsInformation from "@/components/support-network/RightsInformation";
import { policeLocations, hospitalLocations, ngoLocations, rightsLocations } from "@/features/support-network/data";

// Function to get support locations based on tab
const getSupportLocationsWithMapUrl = (tab: ActiveTab): SupportLocation[] => {
  switch (tab) {
    case "police":
      return policeLocations;
    case "hospitals":
      return hospitalLocations;
    case "ngos":
      return ngoLocations;
    case "rights":
      return rightsLocations;
    default:
      return [];
  }
};

const SupportNetwork = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("police");
  const locationsData = getSupportLocationsWithMapUrl(activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady-light to-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === "rights" ? (
          <RightsInformation />
        ) : (
          <div className="space-y-4">
            {locationsData.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportNetwork;
