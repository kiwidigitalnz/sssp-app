import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ClipboardList, Users } from "lucide-react";

export const Communication = ({ formData, setFormData }: any) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Communication and Consultation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meetings" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Safety Meetings
              </Label>
              <QuickFillButton
                fieldId="meetings"
                fieldName="Safety Meetings"
                onSelect={(value) =>
                  setFormData({ ...formData, meetings: value })
                }
              />
            </div>
            <Textarea
              id="meetings"
              value={formData.meetings || ""}
              onChange={(e) =>
                setFormData({ ...formData, meetings: e.target.value })
              }
              placeholder="Detail safety meeting schedules and procedures..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reporting" className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Incident Reporting
              </Label>
              <QuickFillButton
                fieldId="reporting"
                fieldName="Incident Reporting"
                onSelect={(value) =>
                  setFormData({ ...formData, reporting: value })
                }
              />
            </div>
            <Textarea
              id="reporting"
              value={formData.reporting || ""}
              onChange={(e) =>
                setFormData({ ...formData, reporting: e.target.value })
              }
              placeholder="Outline incident reporting procedures..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="consultation" className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Worker Consultation
              </Label>
              <QuickFillButton
                fieldId="consultation"
                fieldName="Worker Consultation"
                onSelect={(value) =>
                  setFormData({ ...formData, consultation: value })
                }
              />
            </div>
            <Textarea
              id="consultation"
              value={formData.consultation || ""}
              onChange={(e) =>
                setFormData({ ...formData, consultation: e.target.value })
              }
              placeholder="Describe worker consultation processes..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};