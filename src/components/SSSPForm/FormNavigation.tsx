import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const FormNavigation = ({
  currentStep,
  totalSteps,
  isLoading,
  onNext,
  onPrevious,
}: FormNavigationProps) => {
  if (currentStep >= totalSteps - 1) return null;

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || isLoading}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <Button 
        onClick={onNext} 
        className="gap-2"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Next"}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};