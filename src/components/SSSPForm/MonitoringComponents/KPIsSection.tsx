
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPIsSectionProps {
  data: Array<{
    metric: string;
    target: string;
    current_status: string;
  }>;
  onChange: (data: any) => void;
}

export const KPIsSection = ({ data = [], onChange }: KPIsSectionProps) => {
  const handleAddKPI = () => {
    onChange([...data, { metric: "", target: "", current_status: "" }]);
  };

  const handleRemoveKPI = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleUpdateKPI = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {data.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Metric</Label>
                  <Input
                    value={kpi.metric}
                    onChange={(e) => handleUpdateKPI(index, "metric", e.target.value)}
                    placeholder="e.g., Incident Rate"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Input
                    value={kpi.target}
                    onChange={(e) => handleUpdateKPI(index, "target", e.target.value)}
                    placeholder="e.g., Zero incidents"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <div className="flex gap-2">
                    <Input
                      value={kpi.current_status}
                      onChange={(e) => handleUpdateKPI(index, "current_status", e.target.value)}
                      placeholder="e.g., On track"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveKPI(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={handleAddKPI} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add KPI
      </Button>
    </div>
  );
};
