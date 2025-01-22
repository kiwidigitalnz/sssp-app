import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Send, Printer } from "lucide-react";
import { toast } from "sonner";

interface SummaryScreenProps {
  formData: any;
  setFormData: (data: any) => void;
  onStepChange: (step: number) => void;
}

export const SummaryScreen = ({ formData, onStepChange }: SummaryScreenProps) => {
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

  const sections = [
    { title: "Project Details", data: formData.projectDetails, step: 0 },
    { title: "Company Information", data: formData.companyInfo, step: 1 },
    { title: "Scope of Work", data: formData.scopeOfWork, step: 2 },
    { title: "Health and Safety", data: formData.healthAndSafety, step: 3 },
    { title: "Hazard Management", data: formData.hazardManagement, step: 4 },
    { title: "Emergency Procedures", data: formData.emergencyProcedures, step: 5 },
    { title: "Training Requirements", data: formData.trainingRequirements, step: 6 },
    { title: "Health and Safety Policies", data: formData.healthAndSafetyPolicies, step: 7 },
    { title: "Site Safety Rules", data: formData.siteSafetyRules, step: 8 },
    { title: "Communication", data: formData.communication, step: 9 },
    { title: "Monitoring and Review", data: formData.monitoringReview, step: 10 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Final Review</h2>
        <div className="flex gap-4">
          <Button onClick={handleSave} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
          <Button onClick={handlePrintPDF} variant="secondary">
            <Printer className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onStepChange(section.step)}
                >
                  Edit
                </Button>
              </div>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(section.data, null, 2)}
              </pre>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};