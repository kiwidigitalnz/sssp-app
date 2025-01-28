import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Briefcase } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { ProjectDetailsFormData } from "../validation/projectDetailsSchema";

interface ProjectNameSectionProps {
  register: UseFormRegister<ProjectDetailsFormData>;
  error?: string;
  onValueChange: (value: string) => void;
}

export const ProjectNameSection = ({ register, error, onValueChange }: ProjectNameSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="projectName" className="text-base font-medium">Project Name</Label>
        <QuickFillButton
          fieldId="projectName"
          fieldName="Project Name"
          onSelect={onValueChange}
        />
      </div>
      <div className="relative">
        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="projectName"
          {...register("projectName")}
          className={`pl-9 ${error ? "border-destructive" : ""}`}
          placeholder="Enter project name"
          onChange={(e) => onValueChange(e.target.value)}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};