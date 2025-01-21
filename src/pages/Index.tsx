import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyInfo } from "@/components/SSSPForm/CompanyInfo";
import { ScopeOfWork } from "@/components/SSSPForm/ScopeOfWork";
import { HealthAndSafety } from "@/components/SSSPForm/HealthAndSafety";
import { HazardManagement } from "@/components/SSSPForm/HazardManagement";
import { EmergencyProcedures } from "@/components/SSSPForm/EmergencyProcedures";
import { TrainingRequirements } from "@/components/SSSPForm/TrainingRequirements";
import { HealthAndSafetyPolicies } from "@/components/SSSPForm/HealthAndSafetyPolicies";
import { VehicleEquipment } from "@/components/SSSPForm/VehicleEquipment";
import { SiteSafetyRules } from "@/components/SSSPForm/SiteSafetyRules";
import { Communication } from "@/components/SSSPForm/Communication";
import { MonitoringReview } from "@/components/SSSPForm/MonitoringReview";
import { StepIndicator } from "@/components/SSSPForm/StepIndicator";
import { toast } from "sonner";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const totalSteps = 11;

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
            {currentStep === 3 && (
              <HealthAndSafety formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 4 && (
              <HazardManagement formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 5 && (
              <EmergencyProcedures formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 6 && (
              <TrainingRequirements formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 7 && (
              <HealthAndSafetyPolicies formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 8 && (
              <VehicleEquipment formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 9 && (
              <SiteSafetyRules formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 10 && (
              <Communication formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 11 && (
              <MonitoringReview formData={formData} setFormData={setFormData} />
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