
import React from "react";
import { FormSteps } from "./FormSteps";

export const FormProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <nav aria-label="Progress">
        <FormSteps currentStep={currentStep} totalSteps={totalSteps} />
      </nav>
    </div>
  );
};
