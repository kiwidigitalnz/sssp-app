
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormSteps } from "./FormSteps";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, Save, Play, Activity, FileDown, Share } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { logActivity } from "@/utils/activityLogging";
import { supabase } from "@/integrations/supabase/client";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  saveForm: () => void;
  formData: any;
  onStepChange: (step: number) => void;
  isValid?: boolean;
}

export const FormNavigation = ({
  currentStep,
  totalSteps,
  saveForm,
  formData,
  onStepChange,
  isValid = true,
}: FormNavigationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSave = () => {
    saveForm();
    toast({
      title: "Changes saved",
      description: "Your SSSP has been saved successfully.",
    });
  };

  const handleActivityLogClick = async () => {
    if (!id) {
      toast({
        title: "SSSP not saved",
        description: "Please save your SSSP first to view the activity log.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await logActivity(id, 'viewed', user.id, {
          description: 'Viewed activity log',
          section: 'Activity Log',
          severity: 'minor'
        }, 'system');
      }
    } catch (error) {
      console.error('Error logging activity view:', error);
    }

    onStepChange(totalSteps + 1);
  };

  const handleExportPDF = async () => {
    // Handle PDF export (future functionality)
    toast({
      title: "Export PDF",
      description: "PDF export functionality will be available soon.",
    });
  };

  const handleShareDocument = () => {
    // Handle document sharing (future functionality)
    if (!id) {
      toast({
        title: "SSSP not saved",
        description: "Please save your SSSP first to share it.",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/share/${id}`);
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps;
  const isReviewStep = currentStep === totalSteps;
  const isActivityLogStep = currentStep === totalSteps + 1;

  // Returns the appropriate button text based on the current step
  const getNextButtonText = () => {
    if (isLastStep) return "Complete";
    if (currentStep === totalSteps - 1) return "Review";
    return "Next";
  };

  return (
    <div className="flex items-center justify-between border-t pt-4 mt-8">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={isFirstStep || isActivityLogStep}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <FormSteps
          totalSteps={totalSteps}
          currentStep={currentStep > totalSteps ? totalSteps : currentStep}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={handleSave}
          className="gap-1"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>

        <Button
          variant="outline"
          onClick={handleActivityLogClick}
          className="gap-1"
        >
          <Activity className="h-4 w-4" />
          Activity Log
        </Button>

        {!isFirstStep && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <FileDown className="h-4 w-4" />
                  Export PDF
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Export SSSP as PDF?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will generate a PDF of your SSSP. Do you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExportPDF}>Export</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="outline"
              onClick={handleShareDocument}
              className="gap-1"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </>
        )}

        {!isActivityLogStep && (
          <Button
            onClick={handleNext}
            disabled={isLastStep || !isValid}
            className="gap-1"
          >
            {getNextButtonText()}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
