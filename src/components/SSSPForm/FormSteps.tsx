
import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormStepsProps {
  totalSteps: number;
  currentStep: number;
  onStepChange?: (step: number) => void;
}

export const FormSteps = ({ totalSteps, currentStep, onStepChange }: FormStepsProps) => {
  // Steps for the form
  const steps = [
    { name: "Project Details", number: 0 },
    { name: "Company Info", number: 1 },
    { name: "Scope of Work", number: 2 },
    { name: "Emergency Procedures", number: 3 },
    { name: "Health & Safety", number: 4 },
    { name: "Training Requirements", number: 5 },
    { name: "Hazard Management", number: 6 },
    { name: "Site Safety Rules", number: 7 },
    { name: "Communication", number: 8 },
    { name: "Monitoring & Review", number: 9 },
    { name: "SSSP Summary", number: 10 },
    { name: "Activity Log", number: 11 }
  ];

  // We only want to display steps up to the total number specified
  const visibleSteps = steps.slice(0, totalSteps + 1);

  const handleStepClick = (stepNumber: number) => {
    if (onStepChange) {
      onStepChange(stepNumber);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex justify-center items-center w-full py-4">
        <nav aria-label="Progress" className="relative">
          <ol className="flex items-center space-x-6">
            {visibleSteps.map((step) => {
              // Define the status: upcoming, current, or completed
              const status =
                step.number < currentStep
                  ? "completed"
                  : step.number === currentStep
                  ? "current"
                  : "upcoming";

              return (
                <li key={step.name} className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleStepClick(step.number)}
                        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                        aria-label={`Go to ${step.name}`}
                      >
                        {status === "completed" ? (
                          <div className="flex items-center">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 cursor-pointer hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md">
                              <svg
                                className="h-4 w-4 text-white"
                                viewBox="0 0 12 12"
                                fill="currentColor"
                              >
                                <path d="M10.28 2.28L4 8.56l-2.28-2.28-1.42 1.41L4 11.41l8-8-1.72-1.13z" />
                              </svg>
                            </div>
                          </div>
                        ) : status === "current" ? (
                          <div
                            className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white cursor-pointer shadow-sm transition-all duration-300"
                            aria-current="step"
                          >
                            <span
                              className="h-4 w-4 rounded-full bg-primary"
                              aria-hidden="true"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                              <span
                                className="h-3 w-3 rounded-full bg-transparent"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-800 text-white px-3 py-2 rounded shadow-lg text-center">
                      <p className="text-sm font-medium">{step.name}</p>
                      <p className="text-xs text-gray-300 mt-1">Step {step.number + 1} of {visibleSteps.length}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Add connecting line between steps */}
                  {step.number < visibleSteps.length - 1 && (
                    <div 
                      className={cn(
                        "absolute top-[15px] left-[32px] h-0.5 w-6", 
                        step.number < currentStep ? "bg-primary" : "bg-gray-300"
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </TooltipProvider>
  );
};
