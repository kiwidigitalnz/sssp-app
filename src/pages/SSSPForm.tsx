
import { useState, useEffect, Suspense, useRef, useCallback } from "react";
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
  [key: string]: any;
}

const SSSPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    formData,
    setFormData,
    clearSavedData,
    isLoading
  } = useFormPersistence<SSSPFormData>({
    key: id || 'new-form',
    initialData: {}
  });

  const handleSave = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem(`sssp-${id || 'draft'}`, JSON.stringify(formData));
      toast({
        title: "Progress saved",
        description: "Your SSSP has been saved successfully",
      });
      clearSavedData();
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "There was an error saving your progress",
      });
    }
  }, [id, formData, toast, clearSavedData, navigate]);

  const handleNext = useCallback(async () => {
    if (currentStep < formSteps.length - 1) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentStep(prevStep => prevStep + 1);
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
  }, [currentStep, toast]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  }, [currentStep]);

  const handleCancel = useCallback(() => {
    clearSavedData();
    navigate("/");
  }, [clearSavedData, navigate]);

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;
      
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const { width, height } = entry.contentRect;
        const currentWidth = container.dataset.prevWidth;
        const currentHeight = container.dataset.prevHeight;

        if (currentWidth !== width.toString() || currentHeight !== height.toString()) {
          container.dataset.prevWidth = width.toString();
          container.dataset.prevHeight = height.toString();
        }
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const container = containerRef.current;

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="container mx-auto py-8 px-4" ref={containerRef}>
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
