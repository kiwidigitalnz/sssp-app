
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormSteps } from "./FormSteps";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  X,
  Check,
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  saveForm: (showToast?: boolean) => void;
  formData: any;
  onStepChange: (step: number) => void;
  isValid?: boolean;
  hideMainSaveButton?: boolean;
  onActivityLogOpen?: () => void;
}

export const FormNavigation = ({
  currentStep,
  totalSteps,
  saveForm,
  formData,
  onStepChange,
  isValid = true,
  hideMainSaveButton = false,
  onActivityLogOpen,
}: FormNavigationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Scroll to top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
      // Auto-save when moving to next step (no toast)
      saveForm(false);
      // Scroll to top of the page
      scrollToTop();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
      // Scroll to top of the page
      scrollToTop();
    }
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
    <TooltipProvider>
      <>
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
                onStepChange={onStepChange}
              />
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center space-x-2">
              {/* Primary button group */}
              <div className="flex items-center space-x-2 mr-4">
                {!hideMainSaveButton && (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      saveForm(true);
                    }}
                    className="gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                )}

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
            </div>
          </div>

          {/* Mobile progress indicator */}
          <div className="block md:hidden mt-4">
            <div className="text-center text-sm text-gray-500">
              Step {currentStep + 1} of {totalSteps + 1}
            </div>
          </div>
        </div>

        {/* Floating navigation buttons for mobile and scrolling */}
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
          <div className="flex space-x-2">
            {!isFirstStep && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePrev}
                    size="icon"
                    variant="outline"
                    className="rounded-full shadow-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous step</TooltipContent>
              </Tooltip>
            )}
            
            {!isLastStep && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    size="icon"
                    variant="default"
                    className="rounded-full shadow-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {getNextButtonText()}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </>
    </TooltipProvider>
  );
};
