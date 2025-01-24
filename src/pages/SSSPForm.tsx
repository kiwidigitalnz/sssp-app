import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetails } from "@/components/SSSPForm/ProjectDetails";
import { CompanyInfo } from "@/components/SSSPForm/CompanyInfo";
import { ScopeOfWork } from "@/components/SSSPForm/ScopeOfWork";
import { HealthAndSafety } from "@/components/SSSPForm/HealthAndSafety";
import { HazardManagement } from "@/components/SSSPForm/HazardManagement";
import { EmergencyProcedures } from "@/components/SSSPForm/EmergencyProcedures";
import { TrainingRequirements } from "@/components/SSSPForm/TrainingRequirements";
import { HealthAndSafetyPolicies } from "@/components/SSSPForm/HealthAndSafetyPolicies";
import { SiteSafetyRules } from "@/components/SSSPForm/SiteSafetyRules";
import { Communication } from "@/components/SSSPForm/Communication";
import { MonitoringReview } from "@/components/SSSPForm/MonitoringReview";
import { SummaryScreen } from "@/components/SSSPForm/SummaryScreen";
import { FormHeader } from "@/components/SSSPForm/FormHeader";
import { FormProgress } from "@/components/SSSPForm/FormProgress";
import { FormNavigation } from "@/components/SSSPForm/FormNavigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const steps = [
    { title: "Project Details", component: ProjectDetails },
    { title: "Company Information", component: CompanyInfo },
    { title: "Scope of Work", component: ScopeOfWork },
    { title: "Health and Safety Responsibilities", component: HealthAndSafety },
    { title: "Hazard and Risk Management", component: HazardManagement },
    { title: "Incident and Emergency Procedures", component: EmergencyProcedures },
    { title: "Training and Competency Requirements", component: TrainingRequirements },
    { title: "Health and Safety Policies", component: HealthAndSafetyPolicies },
    { title: "Site-Specific Safety Rules", component: SiteSafetyRules },
    { title: "Communication and Consultation", component: Communication },
    { title: "Monitoring and Review", component: MonitoringReview },
    { title: "Review and Submit", component: SummaryScreen }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  useEffect(() => {
    if (id) {
      loadSSSPData(id);
    }
  }, [id]);

  const loadSSSPData = async (ssspId: string) => {
    try {
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
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
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
    if (currentStep < steps.length - 1) {
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
            totalSteps={steps.length}
            stepTitle={steps[currentStep].title}
          />

          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <CurrentStepComponent 
                formData={formData} 
                setFormData={setFormData}
                onStepChange={setCurrentStep}
                isLoading={isLoading}
              />
            </Suspense>
          </ErrorBoundary>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            isLoading={isLoading}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/")}>
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SSSPForm;