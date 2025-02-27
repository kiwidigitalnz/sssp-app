
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

// Dynamic imports with proper type casting for lazy loading
const ProjectDetails = lazy(() => import("@/components/features/sssp/ProjectDetails").then(module => ({ default: module.ProjectDetails })));
const CompanyInfo = lazy(() => import("@/components/SSSPForm/CompanyInfo").then(module => ({ default: module.CompanyInfo })));
const ScopeOfWork = lazy(() => import("@/components/features/sssp/ScopeOfWork").then(module => ({ default: module.ScopeOfWork })));
const HealthAndSafety = lazy(() => import("@/components/features/sssp/HealthAndSafety").then(module => ({ default: module.HealthAndSafety })));
const HazardManagement = lazy(() => import("@/components/SSSPForm/HazardManagement").then(module => ({ default: module.HazardManagement })));
const EmergencyProcedures = lazy(() => import("@/components/SSSPForm/EmergencyProcedures").then(module => ({ default: module.EmergencyProcedures })));
const TrainingRequirements = lazy(() => import("@/components/SSSPForm/TrainingRequirements"));
const HealthAndSafetyPolicies = lazy(() => import("@/components/features/sssp/HealthAndSafetyPolicies").then(module => ({ default: module.HealthAndSafetyPolicies })));
const SiteSafetyRules = lazy(() => import("@/components/features/sssp/SiteSafetyRules").then(module => ({ default: module.SiteSafetyRules })));
const Communication = lazy(() => import("@/components/SSSPForm/Communication").then(module => ({ default: module.Communication })));
const MonitoringReview = lazy(() => import("@/components/SSSPForm/MonitoringReview").then(module => ({ default: module.MonitoringReview })));
const SummaryScreen = lazy(() => import("@/components/SSSPForm/SummaryScreen").then(module => ({ default: module.SummaryScreen })));

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

interface SSSPFormData {
  [key: string]: any;
}

// Form steps configuration with proper typing
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

  // Function to transform camelCase fields to snake_case before saving
  const transformFormDataForSaving = useCallback((data: SSSPFormData) => {
    const transformedData = { ...data };

    // Map company field camelCase to snake_case
    if (data.companyName !== undefined) {
      transformedData.company_name = data.companyName;
      delete transformedData.companyName;
    }
    
    if (data.contactPerson !== undefined) {
      transformedData.company_contact_name = data.contactPerson;
      delete transformedData.contactPerson;
    }
    
    if (data.contactEmail !== undefined) {
      transformedData.company_contact_email = data.contactEmail;
      delete transformedData.contactEmail;
    }
    
    if (data.contactPhone !== undefined) {
      transformedData.company_contact_phone = data.contactPhone;
      delete transformedData.contactPhone;
    }
    
    // Map emergency field camelCase to snake_case
    if (data.assemblyPoints !== undefined) {
      transformedData.assembly_points = data.assemblyPoints;
      delete transformedData.assemblyPoints;
    }
    
    if (data.emergencyPlan !== undefined) {
      transformedData.emergency_plan = data.emergencyPlan;
      delete transformedData.emergencyPlan;
    }
    
    if (data.emergencyEquipment !== undefined) {
      transformedData.emergency_equipment = data.emergencyEquipment;
      delete transformedData.emergencyEquipment;
    }
    
    if (data.incidentReporting !== undefined) {
      transformedData.incident_reporting = data.incidentReporting;
      delete transformedData.incidentReporting;
    }

    // Convert emergencyContacts array to emergency_contacts for database
    if (data.emergencyContacts) {
      transformedData.emergency_contacts = data.emergencyContacts;
      delete transformedData.emergencyContacts;
    }
    
    // Log data transformation for debugging
    console.log('Original data:', data);
    console.log('Transformed data:', transformedData);
    
    return transformedData;
  }, []);

  const handleSave = useCallback(async () => {
    try {
      // Transform data before saving
      const transformedData = transformFormDataForSaving(formData);
      
      // Save transformed data using the save function with an argument
      await save(transformedData);
      clearSavedData();
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: error.message || "There was an error saving your progress",
      });
    }
  }, [formData, save, clearSavedData, navigate, toast, transformFormDataForSaving]);

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

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Preload next step component
  useEffect(() => {
    if (currentStep < formSteps.length - 1) {
      const nextComponent = formSteps[currentStep + 1].Component;
      (nextComponent as any)._payload?._result?.preload?.();
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
            onStepClick={handleStepClick}
            isLoading={isLoading}
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
