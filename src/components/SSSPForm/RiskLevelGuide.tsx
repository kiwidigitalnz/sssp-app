import { Shield, AlertTriangle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export const RiskLevelGuide = () => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium mb-4">Risk Level Guide</h3>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700">
            <Shield className="h-6 w-6" />
            <span className="text-sm font-medium">Low Risk</span>
            <span className="text-xs text-center">Minimal impact, easily controlled</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-orange-50 text-orange-700">
            <AlertTriangle className="h-6 w-6" />
            <span className="text-sm font-medium">Medium Risk</span>
            <span className="text-xs text-center">Moderate impact, requires attention</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <span className="text-sm font-medium">High Risk</span>
            <span className="text-xs text-center">Significant impact, immediate action needed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};