import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Settings, Menu, X } from "lucide-react";

interface NavigationProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const Navigation = ({ currentModule, onModuleChange }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const modules = [
    { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
    { id: "data-entry", label: "Saisir Données", icon: BarChart3 },
    { id: "business-plan", label: "Business Plan", icon: FileText },
    { id: "insights", label: "Insights IA", icon: BarChart3 },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-card border-card-border"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navigation menu */}
      <nav className={`
        fixed md:static top-0 left-0 h-full w-64 bg-card border-r border-card-border
        transform transition-transform duration-300 ease-in-out z-50
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground">SME Predictor</h2>
            <p className="text-sm text-muted-foreground">Prédicteur de croissance</p>
          </div>

          <div className="space-y-2">
            {modules.map((module) => (
              <Button
                key={module.id}
                variant={currentModule === module.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onModuleChange(module.id);
                  setMobileMenuOpen(false);
                }}
              >
                <module.icon className="h-4 w-4 mr-3" />
                {module.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;