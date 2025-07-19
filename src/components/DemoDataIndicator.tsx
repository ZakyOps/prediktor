import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface DemoDataIndicatorProps {
  className?: string;
}

const DemoDataIndicator = ({ className = "" }: DemoDataIndicatorProps) => {
  return (
    <div className={`flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <Info className="h-4 w-4 text-blue-600" />
      <div className="flex-1">
        <Badge variant="secondary" className="mb-1">
          Données de démonstration
        </Badge>
        <p className="text-sm text-blue-800">
          L'API Gemini a atteint sa limite. Ces données sont générées localement pour la démonstration.
        </p>
      </div>
    </div>
  );
};

export default DemoDataIndicator; 