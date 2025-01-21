import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ScopeOfWork = ({ formData, setFormData }: any) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Scope of Work</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="services">Services Provided</Label>
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
          <Label htmlFor="locations">Key Locations and Routes</Label>
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
          <Label htmlFor="considerations">Special Considerations</Label>
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