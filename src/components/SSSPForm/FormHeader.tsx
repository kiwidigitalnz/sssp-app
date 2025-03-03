
import React from "react";
import { StatusBadge } from "@/components/SSSPForm/StatusBadge";
import { FormBreadcrumb } from "./FormBreadcrumb";

interface FormHeaderProps {
  id?: string;
  title: string;
  status: string;
  isNew: boolean;
  isLoading: boolean;
  currentStep: number;
}

export function FormHeader({
  id,
  title,
  status,
  isNew,
  isLoading,
  currentStep,
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
