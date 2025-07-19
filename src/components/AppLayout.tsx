import { useState, ReactNode } from "react";
import Dashboard from "./Dashboard";
import DataForm from "./DataForm";
import BusinessPlan from "./BusinessPlan";
import Settings from "./Settings";
import Navigation from "./Navigation";
import Insights from "./Insights";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AppLayout = ({ children }: { children?: ReactNode }) => {
  const [currentModule, setCurrentModule] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
      <header className="flex justify-between items-center p-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold">Prediktor</h1>
        <Button variant="outline" onClick={handleLogout}>
          Déconnexion
        </Button>
      </header>
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