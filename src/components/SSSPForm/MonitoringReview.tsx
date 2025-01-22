import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { AuditSelection } from "./AuditSelection";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const auditSchema = z.object({
  type: z.string().min(1, "Audit type is required"),
  frequency: z.string().min(1, "Frequency is required"),
  responsible: z.string().min(1, "Responsible person is required"),
  lastDate: z.string().min(1, "Last audit date is required"),
  nextDate: z.string().min(1, "Next audit date is required")
});

const monitoringSchema = z.object({
  audits: z.array(auditSchema).min(1, "At least one audit is required"),
  correctiveActions: z.string()
    .min(10, "Corrective actions must be at least 10 characters long")
    .max(1000, "Corrective actions must not exceed 1000 characters"),
  annualReview: z.string()
    .min(10, "Annual review process must be at least 10 characters long")
    .max(1000, "Annual review process must not exceed 1000 characters")
});

type MonitoringFormData = z.infer<typeof monitoringSchema>;

interface MonitoringReviewProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const MonitoringReview = ({ formData, setFormData }: MonitoringReviewProps) => {
  const { toast } = useToast();
  const [audits, setAudits] = useState(formData.audits || []);
  const [previousAudits, setPreviousAudits] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<MonitoringFormData>({
    resolver: zodResolver(monitoringSchema),
    defaultValues: {
      audits: formData.audits || [],
      correctiveActions: formData.correctiveActions || "",
      annualReview: formData.annualReview || ""
    }
  });

  useEffect(() => {
    const storedSSSPs = localStorage.getItem("sssps");
    if (storedSSSPs) {
      const sssps = JSON.parse(storedSSSPs);
      const allAudits = [];
      
      sssps.forEach((sssp: any) => {
        if (sssp.audits) {
          allAudits.push(...sssp.audits);
        }
      });
      
      setPreviousAudits(allAudits);
    }
  }, []);

  const handleFieldChange = async (field: keyof MonitoringFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setValue(field, value);
    const result = await trigger(field);
    if (!result && errors[field]) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors[field]?.message
      });
    }
  };

  const updateAudit = async (index: number, field: string, value: string) => {
    const newAudits = [...audits];
    newAudits[index] = {
      ...newAudits[index],
      [field]: value
    };
    setAudits(newAudits);
    setFormData({ ...formData, audits: newAudits });
    setValue("audits", newAudits);
    
    const result = await trigger("audits");
    if (!result) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check all audit fields"
      });
    }
  };

  const addAudit = () => {
    const newAudits = [...audits, { type: "", frequency: "", responsible: "", lastDate: "", nextDate: "" }];
    setAudits(newAudits);
    setFormData({ ...formData, audits: newAudits });
    setValue("audits", newAudits);
  };

  const addMultipleAudits = async (selectedAudits: any[]) => {
    const newAudits = [...audits, ...selectedAudits];
    setAudits(newAudits);
    setFormData({ ...formData, audits: newAudits });
    setValue("audits", newAudits);
    
    const result = await trigger("audits");
    if (!result) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check all audit fields"
      });
    }
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
            <AuditSelection
              previousAudits={previousAudits}
              onSelect={addMultipleAudits}
            />
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
