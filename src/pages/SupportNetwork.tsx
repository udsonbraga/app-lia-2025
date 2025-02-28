
import { useState } from "react";
import Header from "@/components/support-network/Header";
import TabNavigation from "@/components/support-network/TabNavigation";
import LocationCard from "@/components/support-network/LocationCard";
import RightsInformation from "@/components/support-network/RightsInformation";
import { ActiveTab } from "@/features/support-network/types";
import { getFilteredLocations } from "@/features/support-network/data";

const SupportNetwork = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("police");
  const filteredLocations = getFilteredLocations(activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-16">
      <Header />

      <div className="container mx-auto px-4 pt-20">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab !== "rights" ? (
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <RightsInformation />
        )}
      </div>
    </div>
  );
};

export default SupportNetwork;
