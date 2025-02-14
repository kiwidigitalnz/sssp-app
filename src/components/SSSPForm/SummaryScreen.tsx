
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Send, Printer, ChevronDown, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SummaryScreenProps {
  formData: any;
  setFormData: (data: any) => void;
  onStepChange: (step: number) => void;
}

interface StepSummaryProps {
  title: string;
  data: any;
  step: number;
  onStepChange: (step: number) => void;
}

const StepSummary = ({ title, data, step, onStepChange }: StepSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderValue = (key: string, value: any): JSX.Element => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="pl-4 border-l-2 border-muted">
              {Object.entries(item).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{k.replace(/_/g, " ")}:</span>
                  <span className="text-sm text-muted-foreground">{String(v)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([k, v]) => renderField(k, v))}
        </div>
      );
    }

    return <span className="text-sm text-muted-foreground">{String(value)}</span>;
  };

  const renderField = (key: string, value: any): JSX.Element => {
    if (value === undefined || value === null || value === "") return <></>;
    
    return (
      <div key={key} className="flex items-center justify-between gap-4 py-1">
        <div className="flex-1">
          <span className="text-sm font-medium">{key.replace(/_/g, " ")}:</span>
          {renderValue(key, value)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onStepChange(step);
          }}
          className="h-8 w-8 shrink-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    );
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
        {Object.entries(data || {}).map(([key, value]) => renderField(key, value))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const SummaryScreen = ({ formData, onStepChange }: SummaryScreenProps) => {
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
        <div className="space-y-4">
          {sections.map((section, index) => (
            <StepSummary
              key={index}
              title={section.title}
              data={section.data}
              step={section.step}
              onStepChange={onStepChange}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
