import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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
                      <Input
                        value={audit.type}
                        onChange={(e) => {
                          const newAudits = [...audits];
                          newAudits[index].type = e.target.value;
                          setAudits(newAudits);
                          setFormData({ ...formData, audits: newAudits });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={audit.frequency}
                        onChange={(e) => {
                          const newAudits = [...audits];
                          newAudits[index].frequency = e.target.value;
                          setAudits(newAudits);
                          setFormData({ ...formData, audits: newAudits });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={audit.responsible}
                        onChange={(e) => {
                          const newAudits = [...audits];
                          newAudits[index].responsible = e.target.value;
                          setAudits(newAudits);
                          setFormData({ ...formData, audits: newAudits });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={audit.lastDate}
                        onChange={(e) => {
                          const newAudits = [...audits];
                          newAudits[index].lastDate = e.target.value;
                          setAudits(newAudits);
                          setFormData({ ...formData, audits: newAudits });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={audit.nextDate}
                        onChange={(e) => {
                          const newAudits = [...audits];
                          newAudits[index].nextDate = e.target.value;
                          setAudits(newAudits);
                          setFormData({ ...formData, audits: newAudits });
                        }}
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
            <h3 className="text-lg font-semibold mb-4">Corrective Actions</h3>
            <Textarea
              placeholder="Document how corrective actions are managed and tracked..."
              value={formData.correctiveActions || ""}
              onChange={(e) => setFormData({ ...formData, correctiveActions: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Annual Review Process</h3>
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