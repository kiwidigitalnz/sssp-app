
import React from "react";
import { FireExtinguisher } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import type { SectionComponentProps } from "@/types/sssp/ui";

export const EmergencyEquipment = ({ value, onChange }: SectionComponentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <FireExtinguisher className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Emergency Equipment</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            List available emergency equipment and their locations
          </p>
          <QuickFillButton
            fieldId="emergencyEquipment"
            fieldName="Emergency Equipment"
            onSelect={(value) => onChange(value)}
          />
        </div>
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Document locations of first aid kits, fire extinguishers, etc..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
