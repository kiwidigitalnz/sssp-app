import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export const FormProgress = ({ currentStep, totalSteps, stepTitle }: FormProgressProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-semibold">
          Step {currentStep + 1} of {totalSteps}: {stepTitle}
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
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};