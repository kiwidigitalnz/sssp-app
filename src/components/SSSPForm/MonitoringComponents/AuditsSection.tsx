
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AuditsSectionProps {
  data: Array<{
    type: string;
    frequency: string;
    responsible: string;
    last_completed: string;
    next_due: string;
    findings: string;
  }>;
  onChange: (data: any) => void;
}

export const AuditsSection = ({ data = [], onChange }: AuditsSectionProps) => {
  const handleAddAudit = () => {
    onChange([
      ...data,
      {
        type: "",
        frequency: "monthly",
        responsible: "",
        last_completed: "",
        next_due: "",
        findings: "",
      },
    ]);
  };

  const handleRemoveAudit = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleUpdateAudit = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {data.map((audit, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Audit Type</Label>
                  <Input
                    value={audit.type}
                    onChange={(e) => handleUpdateAudit(index, "type", e.target.value)}
                    placeholder="e.g., Site Safety Inspection"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={audit.frequency}
                    onValueChange={(value) => handleUpdateAudit(index, "frequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Responsible Person</Label>
                  <Input
                    value={audit.responsible}
                    onChange={(e) => handleUpdateAudit(index, "responsible", e.target.value)}
                    placeholder="Who conducts this audit?"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Last Completed</Label>
                  <Input
                    type="date"
                    value={audit.last_completed}
                    onChange={(e) => handleUpdateAudit(index, "last_completed", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Next Due</Label>
                  <Input
                    type="date"
                    value={audit.next_due}
                    onChange={(e) => handleUpdateAudit(index, "next_due", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Findings/Notes</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={audit.findings}
                      onChange={(e) => handleUpdateAudit(index, "findings", e.target.value)}
                      placeholder="Summary of audit findings..."
                      className="min-h-[80px]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAudit(index)}
                      className="h-10 w-10"
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
      <Button onClick={handleAddAudit} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Audit
      </Button>
    </div>
  );
};
