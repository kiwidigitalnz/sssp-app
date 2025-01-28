import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { ClipboardList } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { ProjectDetailsFormData } from "../validation/projectDetailsSchema";

interface DescriptionSectionProps {
  register: UseFormRegister<ProjectDetailsFormData>;
  error?: string;
  onValueChange: (value: string) => void;
}

export const DescriptionSection = ({ register, error, onValueChange }: DescriptionSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="projectDescription" className="text-base font-medium">Project Description</Label>
        <QuickFillButton
          fieldId="projectDescription"
          fieldName="Project Description"
          onSelect={onValueChange}
        />
      </div>
      <div className="relative">
        <ClipboardList className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Textarea
          id="projectDescription"
          {...register("projectDescription")}
          className={`min-h-[100px] pl-9 resize-none ${error ? "border-destructive" : ""}`}
          placeholder="Enter project description"
          onChange={(e) => onValueChange(e.target.value)}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};