
import React from "react";
import { Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import type { SectionComponentProps } from "@/types/sssp/ui";

export const AssemblyPoints = ({ value, onChange }: SectionComponentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <Users className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Assembly Points</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Specify emergency assembly points and evacuation routes
          </p>
          <QuickFillButton
            fieldId="assemblyPoints"
            fieldName="Assembly Points"
            onSelect={(value) => onChange(value)}
          />
        </div>
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="List primary and secondary assembly points..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
