
import { Building, Hospital, PhoneCall, Info } from "lucide-react";
import { ActiveTab } from "@/features/support-network/types";

interface TabNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="flex overflow-x-auto">
        <button
          onClick={() => setActiveTab("police")}
          className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
            activeTab === "police" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
          }`}
        >
          <Building className="h-5 w-5 mb-1" />
          Delegacias
        </button>
        <button
          onClick={() => setActiveTab("hospitals")}
          className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
            activeTab === "hospitals" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
          }`}
        >
          <Hospital className="h-5 w-5 mb-1" />
          Hospitais
        </button>
        <button
          onClick={() => setActiveTab("ngos")}
          className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
            activeTab === "ngos" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
          }`}
        >
          <PhoneCall className="h-5 w-5 mb-1" />
          ONGs
        </button>
        <button
          onClick={() => setActiveTab("rights")}
          className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
            activeTab === "rights" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
          }`}
        >
          <Info className="h-5 w-5 mb-1" />
          Seus Direitos
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
