import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Calendar } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { ProjectDetailsFormData } from "../validation/projectDetailsSchema";

interface DateSectionProps {
  register: UseFormRegister<ProjectDetailsFormData>;
  startDateError?: string;
  endDateError?: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const DateSection = ({ 
  register, 
  startDateError, 
  endDateError,
  onStartDateChange,
  onEndDateChange 
}: DateSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="startDate" className="text-base font-medium">Start Date</Label>
          <QuickFillButton
            fieldId="startDate"
            fieldName="Start Date"
            onSelect={onStartDateChange}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="startDate"
            type="date"
            {...register("startDate")}
            className={`pl-9 ${startDateError ? "border-destructive" : ""}`}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          {startDateError && (
            <p className="text-sm text-destructive mt-1">{startDateError}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="endDate" className="text-base font-medium">End Date</Label>
          <QuickFillButton
            fieldId="endDate"
            fieldName="End Date"
            onSelect={onEndDateChange}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="endDate"
            type="date"
            {...register("endDate")}
            className={`pl-9 ${endDateError ? "border-destructive" : ""}`}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
          {endDateError && (
            <p className="text-sm text-destructive mt-1">{endDateError}</p>
          )}
        </div>
      </div>
    </div>
  );
};