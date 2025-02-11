
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import type { SectionComponentProps } from "@/types/sssp/ui";

export const EmergencyResponsePlan = ({ value, onChange }: SectionComponentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <AlertTriangle className="h-4 w-4" />
        <h3 className="text-base font-medium">Emergency Response Plan</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Document your emergency response procedures and protocols
          </p>
          <QuickFillButton
            fieldId="emergencyPlan"
            fieldName="Emergency Response Plan"
            onSelect={(value) => onChange(value)}
          />
        </div>
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Detail step-by-step emergency response procedures..."
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};
