import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin, ClipboardList } from "lucide-react";

export const ProjectDetails = ({ formData, setFormData }: any) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          Project Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="projectName" className="text-base font-medium">Project Name</Label>
              <QuickFillButton
                fieldId="projectName"
                fieldName="Project Name"
                onSelect={(value) =>
                  setFormData({ ...formData, projectName: value })
                }
              />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="projectName"
                value={formData.projectName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                placeholder="Enter project name"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="siteAddress" className="text-base font-medium">Site Address</Label>
              <QuickFillButton
                fieldId="siteAddress"
                fieldName="Site Address"
                onSelect={(value) =>
                  setFormData({ ...formData, siteAddress: value })
                }
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="siteAddress"
                value={formData.siteAddress || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siteAddress: e.target.value })
                }
                placeholder="Enter site address"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="startDate" className="text-base font-medium">Start Date</Label>
                <QuickFillButton
                  fieldId="startDate"
                  fieldName="Start Date"
                  onSelect={(value) =>
                    setFormData({ ...formData, startDate: value })
                  }
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate" className="text-base font-medium">End Date</Label>
                <QuickFillButton
                  fieldId="endDate"
                  fieldName="End Date"
                  onSelect={(value) =>
                    setFormData({ ...formData, endDate: value })
                  }
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="projectDescription" className="text-base font-medium">Project Description</Label>
              <QuickFillButton
                fieldId="projectDescription"
                fieldName="Project Description"
                onSelect={(value) =>
                  setFormData({ ...formData, projectDescription: value })
                }
              />
            </div>
            <div className="relative">
              <ClipboardList className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="projectDescription"
                value={formData.projectDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, projectDescription: e.target.value })
                }
                placeholder="Enter project description"
                className="min-h-[100px] pl-9 resize-none"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};