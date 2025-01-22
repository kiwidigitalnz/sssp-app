import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";

export const ScopeOfWork = ({ formData, setFormData }: any) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Scope of Work</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="services">Services Provided</Label>
            <QuickFillButton
              fieldId="services"
              fieldName="Services Provided"
              onSelect={(value) =>
                setFormData({ ...formData, services: value })
              }
            />
          </div>
          <Textarea
            id="services"
            value={formData.services || ""}
            onChange={(e) =>
              setFormData({ ...formData, services: e.target.value })
            }
            placeholder="Describe the trucking services provided"
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="locations">Key Locations and Routes</Label>
            <QuickFillButton
              fieldId="locations"
              fieldName="Key Locations and Routes"
              onSelect={(value) =>
                setFormData({ ...formData, locations: value })
              }
            />
          </div>
          <Textarea
            id="locations"
            value={formData.locations || ""}
            onChange={(e) =>
              setFormData({ ...formData, locations: e.target.value })
            }
            placeholder="List key locations and routes covered"
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="considerations">Special Considerations</Label>
            <QuickFillButton
              fieldId="considerations"
              fieldName="Special Considerations"
              onSelect={(value) =>
                setFormData({ ...formData, considerations: value })
              }
            />
          </div>
          <Textarea
            id="considerations"
            value={formData.considerations || ""}
            onChange={(e) =>
              setFormData({ ...formData, considerations: e.target.value })
            }
            placeholder="Note any special considerations (e.g., hazardous goods transport)"
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};