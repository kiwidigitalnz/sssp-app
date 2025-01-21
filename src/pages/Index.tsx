import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyInfo } from "@/components/SSSPForm/CompanyInfo";
import { ScopeOfWork } from "@/components/SSSPForm/ScopeOfWork";
import { StepIndicator } from "@/components/SSSPForm/StepIndicator";
import { toast } from "sonner";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const totalSteps = 2; // We'll add more steps later

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      toast.success("Progress saved!");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Site-Specific Safety Plan (SSSP)
          </h1>
          <p className="mt-2 text-gray-600">
            Complete the form below to create your SSSP
          </p>
        </div>

        <Card className="p-6">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          <div className="space-y-8">
            {currentStep === 1 && (
              <CompanyInfo formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 2 && (
              <ScopeOfWork formData={formData} setFormData={setFormData} />
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button onClick={handleNext} disabled={currentStep === totalSteps}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;