
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Building2 } from "lucide-react";

interface CompanyNameSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CompanyNameSection = ({ value, onChange, error }: CompanyNameSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="companyName" className="text-base font-medium">Company Name</Label>
        <QuickFillButton
          fieldId="companyName"
          fieldName="Company Name"
          onSelect={onChange}
        />
      </div>
      <div className="relative">
        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="companyName"
          value={value}
          className={`pl-9 ${error ? "border-destructive" : ""}`}
          placeholder="Enter company name"
          onChange={(e) => onChange(e.target.value)}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};
