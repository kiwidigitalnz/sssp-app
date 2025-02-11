
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { User, Mail, Phone } from "lucide-react";

interface ContactDetailsProps {
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  onUpdate: (field: 'contactPerson' | 'contactEmail' | 'contactPhone', value: string) => void;
  errors: {
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

export const ContactDetails = ({
  contactPerson,
  contactEmail,
  contactPhone,
  onUpdate,
  errors
}: ContactDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contactPerson" className="text-base font-medium">Contact Person</Label>
          <QuickFillButton
            fieldId="contactPerson"
            fieldName="Contact Person"
            onSelect={(value) => onUpdate('contactPerson', value)}
          />
        </div>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="contactPerson"
            value={contactPerson}
            className={`pl-9 ${errors.contactPerson ? "border-destructive" : ""}`}
            placeholder="Enter contact person name"
            onChange={(e) => onUpdate('contactPerson', e.target.value)}
          />
          {errors.contactPerson && (
            <p className="text-sm text-destructive mt-1">{errors.contactPerson}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contactEmail" className="text-base font-medium">Contact Email</Label>
          <QuickFillButton
            fieldId="contactEmail"
            fieldName="Contact Email"
            onSelect={(value) => onUpdate('contactEmail', value)}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            className={`pl-9 ${errors.contactEmail ? "border-destructive" : ""}`}
            placeholder="Enter contact email"
            onChange={(e) => onUpdate('contactEmail', e.target.value)}
          />
          {errors.contactEmail && (
            <p className="text-sm text-destructive mt-1">{errors.contactEmail}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contactPhone" className="text-base font-medium">Contact Phone</Label>
          <QuickFillButton
            fieldId="contactPhone"
            fieldName="Contact Phone"
            onSelect={(value) => onUpdate('contactPhone', value)}
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="contactPhone"
            value={contactPhone}
            className={`pl-9 ${errors.contactPhone ? "border-destructive" : ""}`}
            placeholder="Enter contact phone"
            onChange={(e) => onUpdate('contactPhone', e.target.value)}
          />
          {errors.contactPhone && (
            <p className="text-sm text-destructive mt-1">{errors.contactPhone}</p>
          )}
        </div>
      </div>
    </div>
  );
};
