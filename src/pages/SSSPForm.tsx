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

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const SSSPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadSSSPData(id);
    }
  }, [id]);

  const loadSSSPData = async (ssspId: string) => {
    try {
      setIsLoading(true);
      // Mock data loading - replace with actual API call
      const mockSSSPData = {
        1: {
          companyName: "City Center Construction",
          address: "123 Main St",
          contactPerson: "John Doe",
          contactEmail: "john@example.com",
        },
        2: {
          companyName: "Harbor Bridge Maintenance",
          address: "456 Harbor Way",
          contactPerson: "Jane Smith",
          contactEmail: "jane@example.com",
        },
      };

      const numericId = parseInt(ssspId, 10);
      const ssspData = mockSSSPData[numericId];
      
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load SSSP data",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      localStorage.setItem(`sssp-${id || 'draft'}`, JSON.stringify(formData));
      toast({
        title: "Progress saved",
        description: "Your SSSP has been saved successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "There was an error saving your progress",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < formSteps.length - 1) {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
        onCancel={() => navigate("/")}
      />
    </div>
  );
};

export default SSSPForm;