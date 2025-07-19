import { useState } from "react";
import Dashboard from "./Dashboard";
import DataForm from "./DataForm";
import BusinessPlan from "./BusinessPlan";
import Settings from "./Settings";
import Navigation from "./Navigation";
import Insights from "./Insights";

const AppLayout = () => {
  const [currentModule, setCurrentModule] = useState("dashboard");

  const renderModule = () => {
    switch (currentModule) {
      case "dashboard":
        return <Dashboard onModuleChange={setCurrentModule} />;
      case "data-entry":
        return <DataForm onBack={() => setCurrentModule("dashboard")} />;
      case "business-plan":
        return <BusinessPlan onBack={() => setCurrentModule("dashboard")} />;
      case "settings":
        return <Settings onBack={() => setCurrentModule("dashboard")} />;
      case "insights":
        return <Insights onBack={() => setCurrentModule("dashboard")} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation 
          currentModule={currentModule}
          onModuleChange={setCurrentModule}
        />
        
        {/* Main content with responsive padding */}
        <main className="flex-1 md:ml-0 transition-all duration-300">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;