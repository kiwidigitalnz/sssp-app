
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormSteps } from "./FormSteps";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Play, 
  Activity, 
  FileDown, 
  Share,
  X,
  Check
} from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { logActivity } from "@/utils/activityLogging";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLog } from "./ActivityLog/ActivityLog";
import { Badge } from "@/components/ui/badge";

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
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
      // Auto-save when moving to next step
      handleSave();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSave = () => {
    saveForm();
    setLastSaved(new Date());
    toast({
      title: "Changes saved",
      description: "Your SSSP has been saved successfully.",
    });
  };

  const handleActivityLogOpen = async () => {
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

    setActivityLogOpen(true);
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

  // Returns the appropriate button text based on the current step
  const getNextButtonText = () => {
    if (isLastStep) return "Complete";
    if (currentStep === totalSteps - 1) return "Review";
    return "Next";
  };

  // Get the right icon for the next button
  const getNextButtonIcon = () => {
    if (isLastStep) return <Check className="h-4 w-4" />;
    return <ChevronRight className="h-4 w-4" />;
  };

  return (
    <>
      {/* Activity Log Dialog */}
      <Dialog open={activityLogOpen} onOpenChange={setActivityLogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Log</DialogTitle>
            <DialogDescription>
              View all activities and changes for this SSSP
            </DialogDescription>
          </DialogHeader>
          {id && <ActivityLog sssp_id={id} />}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setActivityLogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Navigation Bar */}
      <div className="border-t pt-6 mt-8">
        {/* Last Saved Indicator */}
        {lastSaved && (
          <div className="flex justify-end mb-4">
            <Badge variant="outline" className="text-xs text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={isFirstStep}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Center - Progress steps */}
          <div className="hidden md:flex flex-1 justify-center">
            <FormSteps
              totalSteps={totalSteps}
              currentStep={currentStep}
            />
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-2">
            {/* Primary button group */}
            <div className="flex items-center space-x-2 mr-4">
              <Button
                variant="outline"
                onClick={handleSave}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>

              <Button
                variant={isLastStep ? "default" : "outline"}
                onClick={handleNext}
                disabled={isLastStep || !isValid}
                className="gap-1"
              >
                {getNextButtonText()}
                {getNextButtonIcon()}
              </Button>
            </div>

            {/* Secondary action buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={handleActivityLogOpen}
                className="gap-1"
                size="sm"
              >
                <Activity className="h-4 w-4" />
                Activity
              </Button>

              {!isFirstStep && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className="gap-1" size="sm">
                        <FileDown className="h-4 w-4" />
                        Export
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
                    variant="ghost"
                    onClick={handleShareDocument}
                    className="gap-1"
                    size="sm"
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile progress indicator */}
        <div className="block md:hidden mt-4">
          <div className="text-center text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps + 1}
          </div>
        </div>
      </div>
    </>
  );
};
