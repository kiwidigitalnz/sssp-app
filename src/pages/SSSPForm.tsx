import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormHeader } from "@/components/SSSPForm/FormHeader";
import { FormProgress } from "@/components/SSSPForm/FormProgress";
import { FormNavigation } from "@/components/SSSPForm/FormNavigation";
import { FormSteps, formSteps } from "@/components/SSSPForm/FormSteps";
import { FormDialogs } from "@/components/SSSPForm/FormDialogs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useFormPersistence } from "@/hooks/useFormPersistence";

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
  </div>
);

interface SSSPFormData {
  // Add your form data structure here
  [key: string]: any;
}

const SSSPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const {
    formData,
    setFormData,
    clearSavedData,
    isLoading
  } = useFormPersistence<SSSPFormData>({
    key: id || 'new-form',
    initialData: {}
  });

  const handleSave = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      localStorage.setItem(`sssp-${id || 'draft'}`, JSON.stringify(formData));
      toast({
        title: "Progress saved",
        description: "Your SSSP has been saved successfully",
      });
      clearSavedData(); // Clear autosave data after successful save
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "There was an error saving your progress",
      });
    }
  };

  const handleNext = async () => {
    if (currentStep < formSteps.length - 1) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentStep(currentStep + 1);
        toast({
          title: "Progress saved",
          description: "Your changes have been saved",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error saving your progress",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    clearSavedData();
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <FormHeader
          id={id}
          isLoading={isLoading}
          onSave={handleSave}
          onCancel={() => setShowCancelDialog(true)}
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <FormProgress
            currentStep={currentStep}
            totalSteps={formSteps.length}
            stepTitle={formSteps[currentStep].title}
          />

          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <FormSteps
                currentStep={currentStep}
                formData={formData}
                setFormData={setFormData}
                onStepChange={setCurrentStep}
                isLoading={isLoading}
              />
            </Suspense>
          </ErrorBoundary>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={formSteps.length}
            isLoading={isLoading}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>

      <FormDialogs
        showCancelDialog={showCancelDialog}
        setShowCancelDialog={setShowCancelDialog}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SSSPForm;
