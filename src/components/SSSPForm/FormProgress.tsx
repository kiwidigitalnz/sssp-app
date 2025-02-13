
import { StepIndicator } from "./StepIndicator";
import { formSteps } from "./FormSteps";
import { cn } from "@/lib/utils";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onStepClick?: (stepIndex: number) => void;
  isLoading?: boolean;
}

export const FormProgress = ({
  currentStep,
  totalSteps,
  stepTitle,
  onStepClick,
  isLoading
}: FormProgressProps) => {
  return (
    <div className="mb-8">
      <StepIndicator currentStep={currentStep + 1} totalSteps={totalSteps} />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">{stepTitle}</h2>
        
        <div className="flex flex-wrap justify-center gap-2 px-4">
          {formSteps.map((step, index) => (
            <button
              key={index}
              onClick={() => onStepClick?.(index)}
              disabled={isLoading}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-colors",
                "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                currentStep === index 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {step.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
