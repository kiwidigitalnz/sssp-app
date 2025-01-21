import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";

interface SummaryScreenProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const SummaryScreen = ({ formData }: SummaryScreenProps) => {
  const handleSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem("sssp-form", JSON.stringify(formData));
    toast.success("Form saved successfully");
  };

  const handleSubmit = () => {
    // In a real app, this would submit to a backend
    toast.success("Form submitted successfully");
  };

  const handlePrintPDF = () => {
    // In a real app, this would generate a PDF
    toast.success("PDF generation started");
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Summary</h2>
        <div className="flex gap-4">
          <Button onClick={handleSave} variant="outline">
            <Save className="mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="mr-2" />
            Submit
          </Button>
          <Button onClick={handlePrintPDF} variant="secondary">
            <Printer className="mr-2" />
            Print PDF
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Company Information</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.companyInfo, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Scope of Work</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.scopeOfWork, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Health and Safety</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.healthAndSafety, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Hazard Management</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.hazardManagement, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Emergency Procedures</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.emergencyProcedures, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Training Requirements</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.trainingRequirements, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Health and Safety Policies</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.healthAndSafetyPolicies, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Site Safety Rules</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.siteSafetyRules, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Communication</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.communication, null, 2)}
            </pre>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Monitoring and Review</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData.monitoringReview, null, 2)}
            </pre>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};