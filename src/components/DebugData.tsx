import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DebugDataProps {
  data: any;
  title: string;
  className?: string;
}

const DebugData = ({ data, title, className = "" }: DebugDataProps) => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast({
      title: "Copié",
      description: "Les données ont été copiées dans le presse-papiers.",
      duration: 2000,
    });
  };

  const downloadData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDataType = (value: any): string => {
    if (Array.isArray(value)) return `Array[${value.length}]`;
    if (value === null) return 'null';
    if (typeof value === 'object') return 'Object';
    return typeof value;
  };

  const renderValue = (value: any, key: string): JSX.Element => {
    const type = getDataType(value);
    
    if (typeof value === 'string') {
      return <span className="text-green-600">"{value}"</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>;
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          <Badge variant="outline" className="mb-2">{type}</Badge>
          {value.map((item, index) => (
            <div key={index} className="ml-4 mb-1">
              <span className="text-gray-500">[{index}]:</span> {renderValue(item, `${key}[${index}]`)}
            </div>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="ml-4">
          <Badge variant="outline" className="mb-2">{type}</Badge>
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="ml-4 mb-1">
              <span className="text-gray-500">{k}:</span> {renderValue(v, `${key}.${k}`)}
            </div>
          ))}
        </div>
      );
    }
    
    return <span className="text-gray-400">{String(value)}</span>;
  };

  return (
    <Card className={`border-orange-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Badge variant="secondary">DEBUG</Badge>
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadData}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isVisible && (
        <CardContent className="pt-0">
          <div className="bg-gray-50 p-4 rounded-lg text-xs font-mono overflow-auto max-h-96">
            <div className="mb-2">
              <Badge variant="outline">Type: {getDataType(data)}</Badge>
            </div>
            {renderValue(data, 'root')}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DebugData; 