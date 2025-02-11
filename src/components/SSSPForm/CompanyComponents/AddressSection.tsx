
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { MapPin } from "lucide-react";

interface AddressSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const AddressSection = ({ value, onChange, error }: AddressSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="address" className="text-base font-medium">Address</Label>
        <QuickFillButton
          fieldId="address"
          fieldName="Address"
          onSelect={onChange}
        />
      </div>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="address"
          value={value}
          className={`pl-9 ${error ? "border-destructive" : ""}`}
          placeholder="Enter company address"
          onChange={(e) => onChange(e.target.value)}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};
