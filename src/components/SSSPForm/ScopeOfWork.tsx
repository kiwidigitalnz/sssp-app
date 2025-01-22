import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, AlertCircle } from "lucide-react";

export const ScopeOfWork = ({ formData, setFormData }: any) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          Scope of Work
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="services" className="text-base font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Services Provided
              </Label>
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
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="locations" className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Key Locations and Routes
              </Label>
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
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="considerations" className="text-base font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Special Considerations
              </Label>
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
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};