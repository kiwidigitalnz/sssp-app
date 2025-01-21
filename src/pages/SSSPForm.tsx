import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CompanyInfo } from "@/components/SSSPForm/CompanyInfo";
import { ScopeOfWork } from "@/components/SSSPForm/ScopeOfWork";
import { HealthAndSafety } from "@/components/SSSPForm/HealthAndSafety";
import { HealthAndSafetyPolicies } from "@/components/SSSPForm/HealthAndSafetyPolicies";
import { SiteSafetyRules } from "@/components/SSSPForm/SiteSafetyRules";
import { TrainingRequirements } from "@/components/SSSPForm/TrainingRequirements";
import { MonitoringReview } from "@/components/SSSPForm/MonitoringReview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SSSPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  // Mock data for edit mode
  const mockSSSPData = {
    1: {
      companyName: "City Center Construction",
      address: "123 Main St",
      contactPerson: "John Doe",
      contactEmail: "john@example.com",
      // ... other form fields
    },
    2: {
      companyName: "Harbor Bridge Maintenance",
      address: "456 Harbor Way",
      contactPerson: "Jane Smith",
      contactEmail: "jane@example.com",
      // ... other form fields
    },
  };

  useEffect(() => {
    if (id) {
      // Load data for edit mode
      const ssspData = mockSSSPData[id as keyof typeof mockSSSPData];
      if (ssspData) {
        setFormData(ssspData);
        toast({
          title: "SSSP loaded",
          description: "The SSSP data has been loaded for editing",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "SSSP not found",
        });
        navigate("/");
      }
    }
  }, [id, navigate, toast]);

  const steps = [
    { title: "Company Information", component: CompanyInfo },
    { title: "Scope of Work", component: ScopeOfWork },
    { title: "Health and Safety", component: HealthAndSafety },
    { title: "Health and Safety Policies", component: HealthAndSafetyPolicies },
    { title: "Site Safety Rules", component: SiteSafetyRules },
    { title: "Training Requirements", component: TrainingRequirements },
    { title: "Monitoring and Review", component: MonitoringReview },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Progress saved",
        description: "Your changes have been saved",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    toast({
      title: "SSSP saved",
      description: "Your SSSP has been saved successfully",
    });
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {id ? "Edit SSSP" : "Create New SSSP"}
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </h2>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-blue-600 rounded transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <CurrentStepComponent formData={formData} setFormData={setFormData} />

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2" />
              Previous
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={handleSave}>
                Save
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSave}>Submit</Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSSPForm;
