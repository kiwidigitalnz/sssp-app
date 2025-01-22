import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";

interface MonitoringReviewProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const MonitoringReview = ({ formData, setFormData }: MonitoringReviewProps) => {
  const [audits, setAudits] = useState(formData.audits || []);

  const addAudit = () => {
    const newAudits = [...audits, { type: "", frequency: "", responsible: "", lastDate: "", nextDate: "" }];
    setAudits(newAudits);
    setFormData({ ...formData, audits: newAudits });
  };

  const updateAudit = (index: number, field: string, value: string) => {
    const newAudits = [...audits];
    newAudits[index] = { ...newAudits[index], [field]: value };
    setAudits(newAudits);
    setFormData({ ...formData, audits: newAudits });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring and Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Audits and Inspections</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Responsible Person</TableHead>
                  <TableHead>Last Done</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.map((audit: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <QuickFillButton
                          fieldId={`audit-type-${index}`}
                          fieldName="Audit Type"
                          onSelect={(value) => updateAudit(index, "type", value)}
                        />
                        <Input
                          value={audit.type}
                          onChange={(e) => updateAudit(index, "type", e.target.value)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <QuickFillButton
                          fieldId={`audit-frequency-${index}`}
                          fieldName="Audit Frequency"
                          onSelect={(value) => updateAudit(index, "frequency", value)}
                        />
                        <Input
                          value={audit.frequency}
                          onChange={(e) => updateAudit(index, "frequency", e.target.value)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <QuickFillButton
                          fieldId={`audit-responsible-${index}`}
                          fieldName="Responsible Person"
                          onSelect={(value) => updateAudit(index, "responsible", value)}
                        />
                        <Input
                          value={audit.responsible}
                          onChange={(e) => updateAudit(index, "responsible", e.target.value)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={audit.lastDate}
                        onChange={(e) => updateAudit(index, "lastDate", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={audit.nextDate}
                        onChange={(e) => updateAudit(index, "nextDate", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newAudits = audits.filter((_, i) => i !== index);
                          setAudits(newAudits);
                          setFormData({ ...formData, audits: newAudits });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={addAudit} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Audit
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Corrective Actions</h3>
              <QuickFillButton
                fieldId="correctiveActions"
                fieldName="Corrective Actions"
                onSelect={(value) =>
                  setFormData({ ...formData, correctiveActions: value })
                }
              />
            </div>
            <Textarea
              placeholder="Document how corrective actions are managed and tracked..."
              value={formData.correctiveActions || ""}
              onChange={(e) => setFormData({ ...formData, correctiveActions: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Annual Review Process</h3>
              <QuickFillButton
                fieldId="annualReview"
                fieldName="Annual Review Process"
                onSelect={(value) =>
                  setFormData({ ...formData, annualReview: value })
                }
              />
            </div>
            <Textarea
              placeholder="Document the annual SSSP review process..."
              value={formData.annualReview || ""}
              onChange={(e) => setFormData({ ...formData, annualReview: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};