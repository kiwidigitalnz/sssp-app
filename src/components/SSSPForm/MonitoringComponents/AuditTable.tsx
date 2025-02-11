
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Calendar, Users, Clock, AlertCircle } from "lucide-react";

interface AuditTableProps {
  audits: any[];
  updateAudit: (index: number, field: string, value: string) => void;
  removeAudit: (index: number) => void;
}

export const AuditTable = ({ audits, updateAudit, removeAudit }: AuditTableProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {audits.map((audit: any, index: number) => (
        <Card key={index} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeAudit(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Audit Type</span>
                </div>
                <Input
                  value={audit.type}
                  onChange={(e) => updateAudit(index, "type", e.target.value)}
                  placeholder="Type of audit..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Frequency</span>
                </div>
                <Input
                  value={audit.frequency}
                  onChange={(e) => updateAudit(index, "frequency", e.target.value)}
                  placeholder="Audit frequency..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span>Responsible Person</span>
                </div>
                <Input
                  value={audit.responsible}
                  onChange={(e) => updateAudit(index, "responsible", e.target.value)}
                  placeholder="Person responsible..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last Done</span>
                  </div>
                  <Input
                    type="date"
                    value={audit.lastDate}
                    onChange={(e) => updateAudit(index, "lastDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Next Due</span>
                  </div>
                  <Input
                    type="date"
                    value={audit.nextDate}
                    onChange={(e) => updateAudit(index, "nextDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
