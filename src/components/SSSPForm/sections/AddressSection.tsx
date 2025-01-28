import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { MapPin } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { ProjectDetailsFormData } from "../validation/projectDetailsSchema";

interface AddressSectionProps {
  register: UseFormRegister<ProjectDetailsFormData>;
  error?: string;
  onValueChange: (value: string) => void;
}

export const AddressSection = ({ register, error, onValueChange }: AddressSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="siteAddress" className="text-base font-medium">Site Address</Label>
        <QuickFillButton
          fieldId="siteAddress"
          fieldName="Site Address"
          onSelect={onValueChange}
        />
      </div>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="siteAddress"
          {...register("siteAddress")}
          className={`pl-9 ${error ? "border-destructive" : ""}`}
          placeholder="Enter site address"
          onChange={(e) => onValueChange(e.target.value)}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};