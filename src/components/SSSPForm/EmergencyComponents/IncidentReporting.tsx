
import React from "react";
import { BellRing } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import type { SectionComponentProps } from "@/types/sssp/ui";

export const IncidentReporting = ({ value, onChange }: SectionComponentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <BellRing className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Incident Reporting</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Outline the incident reporting and notification process
          </p>
          <QuickFillButton
            fieldId="incidentReporting"
            fieldName="Incident Reporting"
            onSelect={(value) => onChange(value)}
          />
        </div>
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Detail the steps for reporting and documenting incidents..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
