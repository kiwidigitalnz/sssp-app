import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, DoorOpen, Car, HardHat } from "lucide-react";

export const SiteSafetyRules = ({ formData, setFormData }: any) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Site Safety Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="entryExitProcedures" className="text-lg font-semibold flex items-center gap-2">
                <DoorOpen className="h-4 w-4" />
                Entry/Exit Procedures
              </Label>
              <QuickFillButton
                fieldId="entryExitProcedures"
                fieldName="Entry/Exit Procedures"
                onSelect={(value) =>
                  setFormData({ ...formData, entryExitProcedures: value })
                }
              />
            </div>
            <Textarea
              id="entryExitProcedures"
              value={formData.entryExitProcedures || ""}
              onChange={(e) =>
                setFormData({ ...formData, entryExitProcedures: e.target.value })
              }
              placeholder="Detail site entry and exit procedures..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speedLimits" className="text-lg font-semibold flex items-center gap-2">
                <Car className="h-4 w-4" />
                Speed Limits
              </Label>
              <QuickFillButton
                fieldId="speedLimits"
                fieldName="Speed Limits"
                onSelect={(value) =>
                  setFormData({ ...formData, speedLimits: value })
                }
              />
            </div>
            <Textarea
              id="speedLimits"
              value={formData.speedLimits || ""}
              onChange={(e) =>
                setFormData({ ...formData, speedLimits: e.target.value })
              }
              placeholder="Specify site speed limits and vehicle rules..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="parkingRules" className="text-lg font-semibold flex items-center gap-2">
                <Car className="h-4 w-4" />
                Parking Rules
              </Label>
              <QuickFillButton
                fieldId="parkingRules"
                fieldName="Parking Rules"
                onSelect={(value) =>
                  setFormData({ ...formData, parkingRules: value })
                }
              />
            </div>
            <Textarea
              id="parkingRules"
              value={formData.parkingRules || ""}
              onChange={(e) =>
                setFormData({ ...formData, parkingRules: e.target.value })
              }
              placeholder="Detail parking regulations and designated areas..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sitePPE" className="text-lg font-semibold flex items-center gap-2">
                <HardHat className="h-4 w-4" />
                Site-Specific PPE Requirements
              </Label>
              <QuickFillButton
                fieldId="sitePPE"
                fieldName="Site-Specific PPE Requirements"
                onSelect={(value) =>
                  setFormData({ ...formData, sitePPE: value })
                }
              />
            </div>
            <Textarea
              id="sitePPE"
              value={formData.sitePPE || ""}
              onChange={(e) =>
                setFormData({ ...formData, sitePPE: e.target.value })
              }
              placeholder="List required PPE for specific site areas..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};