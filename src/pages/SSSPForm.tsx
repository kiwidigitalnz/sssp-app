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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, X, HelpCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
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
    }
  }, [id, navigate, toast]);

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

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    navigate("/");
  };

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">
            {id ? "Edit SSSP" : "Create New SSSP"}
          </h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="gap-2"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="outline"
              className="gap-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save & Exit"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fill out this section with relevant information for your SSSP</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-blue-600 rounded transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

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

          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isLoading}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button 
                onClick={handleNext} 
                className="gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
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
            <AlertDialogAction onClick={confirmCancel}>
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SSSPForm;
