
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { AuditTable } from "./MonitoringComponents/AuditTable";
import { TextSection } from "./MonitoringComponents/TextSection";

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

  const {
    setValue,
    trigger,
    formState: { errors }
  } = useForm<MonitoringFormData>({
    resolver: zodResolver(monitoringSchema),
    defaultValues: {
      audits: formData.audits || [],
      correctiveActions: formData.correctiveActions || "",
      annualReview: formData.annualReview || ""
    }
  });

  useEffect(() => {
    // Initialize demo data if fields are empty
    if (!formData.correctiveActions) {
      const demoCorrectiveActions = "Our corrective actions process involves immediate documentation of identified issues, assignment of responsibility, setting timeframes for completion, and follow-up verification. All actions are tracked in our digital system and reviewed monthly to ensure completion and effectiveness. Serious issues are escalated to senior management for review and resource allocation.";
      setFormData({ ...formData, correctiveActions: demoCorrectiveActions });
    }

    if (!formData.annualReview) {
      const demoAnnualReview = "The SSSP undergoes a comprehensive annual review led by our Health & Safety team. This includes analyzing incident data, audit findings, and worker feedback. Updates are made to reflect changing site conditions, new hazards, and lessons learned. All stakeholders participate in the review process, and changes are communicated through toolbox meetings and formal training sessions.";
      setFormData({ ...formData, annualReview: demoAnnualReview });
    }
  }, []);

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

  const removeAudit = (index: number) => {
    const newAudits = audits.filter((_, i) => i !== index);
    setAudits(newAudits);
    setFormData({ ...formData, audits: newAudits });
  };

  const addAudit = () => {
    const newAudits = [...audits, { type: "", frequency: "", responsible: "", lastDate: "", nextDate: "" }];
    setAudits(newAudits);
    setFormData({ ...formData, audits: newAudits });
    setValue("audits", newAudits);
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
            <AuditTable 
              audits={audits}
              updateAudit={updateAudit}
              removeAudit={removeAudit}
            />
            <Button onClick={addAudit} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Audit
            </Button>
          </div>

          <TextSection
            title="Corrective Actions"
            fieldId="correctiveActions"
            value={formData.correctiveActions || ""}
            onChange={(value) => setFormData({ ...formData, correctiveActions: value })}
            placeholder="Document how corrective actions are managed and tracked..."
          />

          <TextSection
            title="Annual Review Process"
            fieldId="annualReview"
            value={formData.annualReview || ""}
            onChange={(value) => setFormData({ ...formData, annualReview: value })}
            placeholder="Document the annual SSSP review process..."
          />
        </CardContent>
      </Card>
    </div>
  );
};
