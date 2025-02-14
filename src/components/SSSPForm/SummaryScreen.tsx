
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Send, Printer, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProjectDetailsSection } from "./SummaryComponents/ProjectDetailsSection";
import { CompanyInfoSection } from "./SummaryComponents/CompanyInfoSection";

interface SummaryScreenProps {
  formData: any;
  setFormData?: (data: any) => void;
  onStepChange?: (step: number) => void;
  isLoading?: boolean;
}

interface StepSummaryProps {
  title: string;
  data: any;
  step: number;
  setFormData?: (data: any) => void;
}

const StepSummary = ({ title, data, setFormData }: StepSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderSectionContent = () => {
    if (!data) return null;

    switch (title) {
      case "Project Details":
        return <ProjectDetailsSection data={data} setFormData={setFormData!} />;
      case "Company Information":
        return <CompanyInfoSection data={data} setFormData={setFormData!} />;
      default:
        return (
          <div className="text-sm text-muted-foreground">
            Content for {title} will be implemented soon
          </div>
        );
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 rounded-lg border p-4">
        {renderSectionContent()}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const SummaryScreen = ({ formData, setFormData, isLoading }: SummaryScreenProps) => {
  const handleSave = () => {
    localStorage.setItem("sssp-form", JSON.stringify(formData));
    toast.success("Form saved successfully");
  };

  const handleSubmit = () => {
    toast.success("Form submitted successfully");
  };

  const handlePrintPDF = () => {
    toast.success("PDF generation started");
    window.print();
  };

  const sections = [
    { title: "Project Details", data: formData, step: 0 },
    { title: "Company Information", data: formData, step: 1 },
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
          <Button onClick={handleSave} variant="outline" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
          <Button onClick={handlePrintPDF} variant="secondary" disabled={isLoading}>
            <Printer className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <StepSummary
              key={index}
              title={section.title}
              data={section.data}
              step={section.step}
              setFormData={setFormData}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
