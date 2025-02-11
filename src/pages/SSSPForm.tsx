import { useState, useEffect, lazy, Suspense, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormHeader } from "@/components/SSSPForm/FormHeader";
import { FormProgress } from "@/components/SSSPForm/FormProgress";
import { FormNavigation } from "@/components/SSSPForm/FormNavigation";
import { FormDialogs } from "@/components/SSSPForm/FormDialogs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useMemo } from "react";

// Lazy load form steps with type assertion to ensure correct default export handling
const ProjectDetails = lazy(() => import("@/components/SSSPForm/ProjectDetails").then(module => ({ default: module.ProjectDetails })));
const CompanyInfo = lazy(() => import("@/components/SSSPForm/CompanyInfo").then(module => ({ default: module.CompanyInfo })));
const ScopeOfWork = lazy(() => import("@/components/SSSPForm/ScopeOfWork").then(module => ({ default: module.ScopeOfWork })));
const HealthAndSafety = lazy(() => import("@/components/SSSPForm/HealthAndSafety").then(module => ({ default: module.HealthAndSafety })));
const HazardManagement = lazy(() => import("@/components/SSSPForm/HazardManagement").then(module => ({ default: module.HazardManagement })));
const EmergencyProcedures = lazy(() => import("@/components/SSSPForm/EmergencyProcedures").then(module => ({ default: module.EmergencyProcedures })));
const TrainingRequirements = lazy(() => import("@/components/SSSPForm/TrainingRequirements"));
const HealthAndSafetyPolicies = lazy(() => import("@/components/SSSPForm/HealthAndSafetyPolicies").then(module => ({ default: module.HealthAndSafetyPolicies })));
const SiteSafetyRules = lazy(() => import("@/components/SSSPForm/SiteSafetyRules").then(module => ({ default: module.SiteSafetyRules })));
const Communication = lazy(() => import("@/components/SSSPForm/Communication").then(module => ({ default: module.Communication })));
const MonitoringReview = lazy(() => import("@/components/SSSPForm/MonitoringReview").then(module => ({ default: module.MonitoringReview })));
const SummaryScreen = lazy(() => import("@/components/SSSPForm/SummaryScreen").then(module => ({ default: module.SummaryScreen })));

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
  </div>
);

interface SSSPFormData {
  [key: string]: any;
}

// Form steps configuration
const formSteps = [
  { title: "Project Details", Component: ProjectDetails },
  { title: "Company Information", Component: CompanyInfo },
  { title: "Scope of Work", Component: ScopeOfWork },
  { title: "Health and Safety Responsibilities", Component: HealthAndSafety },
  { title: "Hazard and Risk Management", Component: HazardManagement },
  { title: "Incident and Emergency Procedures", Component: EmergencyProcedures },
  { title: "Training and Competency Requirements", Component: TrainingRequirements },
  { title: "Health and Safety Policies", Component: HealthAndSafetyPolicies },
  { title: "Site-Specific Safety Rules", Component: SiteSafetyRules },
  { title: "Communication and Consultation", Component: Communication },
  { title: "Monitoring and Review", Component: MonitoringReview },
  { title: "Review and Submit", Component: SummaryScreen }
];

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
    isLoading,
    save,
    error
  } = useFormPersistence<SSSPFormData>({
    key: id || 'new-form',
    initialData: {}
  });

  // Memoize current step component
  const CurrentStepComponent = useMemo(() => {
    const { Component } = formSteps[currentStep];
    return Component;
  }, [currentStep]);

  const handleSave = useCallback(async () => {
    try {
      await save();
      clearSavedData();
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: error.message || "There was an error saving your progress",
      });
    }
  }, [save, clearSavedData, navigate, toast]);

  const handleNext = useCallback(() => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  }, [currentStep]);

  const handleCancel = useCallback(() => {
    clearSavedData();
    navigate("/");
  }, [clearSavedData, navigate]);

  // Optimize resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      
      const { width, height } = entry.contentRect;
      container.dataset.prevWidth = width.toString();
      container.dataset.prevHeight = height.toString();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Update the useEffect for preloading
  useEffect(() => {
    if (currentStep < formSteps.length - 1) {
      const nextComponent = formSteps[currentStep + 1].Component;
      if (nextComponent && typeof nextComponent === 'function' && 'preload' in nextComponent) {
        try {
          nextComponent.preload();
        } catch (error) {
          console.warn('Preload not available:', error);
        }
      }
    }
  }, [currentStep]);

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
              <CurrentStepComponent
                formData={formData}
                setFormData={setFormData}
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
