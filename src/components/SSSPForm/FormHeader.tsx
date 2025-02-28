
import React from "react";
import { FormSteps } from "./FormSteps";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/SSSPForm/StatusBadge";
import { FormBreadcrumb } from "./FormBreadcrumb";

interface FormHeaderProps {
  id?: string;
  title: string;
  status: string;
  isNew: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSave: (showToast?: boolean) => Promise<void>;
  currentStep: number;
  saveButtonText: string;
}

export function FormHeader({
  id,
  title,
  status,
  isNew,
  isLoading,
  onCancel,
  onSave,
  currentStep,
  saveButtonText = "Save",
}: FormHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <FormBreadcrumb title={title} id={id} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 truncate max-w-2xl">
              {title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={status} />
              {!isNew && (
                <span className="text-sm text-gray-500">ID: {id}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave(true)}
              disabled={isLoading}
            >
              {saveButtonText}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <FormSteps currentStep={currentStep} totalSteps={11} />
      </div>
    </div>
  );
}
