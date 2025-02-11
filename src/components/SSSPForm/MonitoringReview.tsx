
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { AuditSelection } from "./AuditSelection";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { AuditTable } from "./MonitoringComponents/AuditTable";
import { TextSection } from "./MonitoringComponents/TextSection";
import { supabase } from "@/integrations/supabase/client";

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
  const [previousAudits, setPreviousAudits] = useState<any[]>([]);

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
    const fetchPreviousAudits = async () => {
      const { data: sssps, error } = await supabase
        .from('sssps')
        .select('audits')
        .not('audits', 'is', null)
        .limit(5);

      if (error) {
        console.error('Error fetching previous audits:', error);
        return;
      }

      const allAudits = sssps?.flatMap(sssp => sssp.audits || []) || [];
      const uniqueAudits = Array.from(new Set(allAudits.map(JSON.stringify)))
        .map(str => JSON.parse(str));
      
      setPreviousAudits(uniqueAudits);
    };

    fetchPreviousAudits();
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
            <AuditTable 
              audits={audits}
              updateAudit={updateAudit}
              removeAudit={removeAudit}
            />
            <Button onClick={addAudit} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Audit
            </Button>
            <AuditSelection
              previousAudits={previousAudits}
              onSelect={addMultipleAudits}
            />
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
