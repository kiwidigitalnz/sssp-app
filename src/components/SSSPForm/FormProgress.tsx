
import { StepIndicator } from "./StepIndicator";
import { formSteps } from "./FormSteps";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-center">{stepTitle}</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "bg-muted hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/20",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
            disabled={isLoading}
          >
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-[280px] max-h-[400px] overflow-y-auto"
          >
            {formSteps.map((step, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onStepClick?.(index)}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer",
                  currentStep === index && "bg-primary/10"
                )}
              >
                {currentStep === index && (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                )}
                <span className={cn(
                  "flex-1",
                  currentStep === index && "font-medium text-primary"
                )}>
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {index + 1}/{totalSteps}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
