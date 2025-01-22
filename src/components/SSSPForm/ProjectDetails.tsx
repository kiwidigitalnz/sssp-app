import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin, ClipboardList } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const projectDetailsSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string()
    .min(1, "End date is required")
    .refine((date) => new Date(date) > new Date(), {
      message: "End date must be in the future"
    }),
  projectDescription: z.string().min(10, "Project description must be at least 10 characters long")
});

type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;

export const ProjectDetails = ({ formData, setFormData }: any) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<ProjectDetailsFormData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      projectName: formData.projectName || "",
      siteAddress: formData.siteAddress || "",
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      projectDescription: formData.projectDescription || ""
    }
  });

  useEffect(() => {
    setValue("projectName", formData.projectName || "");
    setValue("siteAddress", formData.siteAddress || "");
    setValue("startDate", formData.startDate || "");
    setValue("endDate", formData.endDate || "");
    setValue("projectDescription", formData.projectDescription || "");
  }, [formData, setValue]);

  const handleFieldChange = async (field: keyof ProjectDetailsFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setValue(field, value);
    const result = await trigger(field);
    if (!result && errors[field]) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors[field]?.message
      });
    }
  };

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
                onSelect={(value) => handleFieldChange("projectName", value)}
              />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="projectName"
                {...register("projectName")}
                className={`pl-9 ${errors.projectName ? "border-destructive" : ""}`}
                placeholder="Enter project name"
                onChange={(e) => handleFieldChange("projectName", e.target.value)}
              />
              {errors.projectName && (
                <p className="text-sm text-destructive mt-1">{errors.projectName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="siteAddress" className="text-base font-medium">Site Address</Label>
              <QuickFillButton
                fieldId="siteAddress"
                fieldName="Site Address"
                onSelect={(value) => handleFieldChange("siteAddress", value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="siteAddress"
                {...register("siteAddress")}
                className={`pl-9 ${errors.siteAddress ? "border-destructive" : ""}`}
                placeholder="Enter site address"
                onChange={(e) => handleFieldChange("siteAddress", e.target.value)}
              />
              {errors.siteAddress && (
                <p className="text-sm text-destructive mt-1">{errors.siteAddress.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="startDate" className="text-base font-medium">Start Date</Label>
                <QuickFillButton
                  fieldId="startDate"
                  fieldName="Start Date"
                  onSelect={(value) => handleFieldChange("startDate", value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className={`pl-9 ${errors.startDate ? "border-destructive" : ""}`}
                  onChange={(e) => handleFieldChange("startDate", e.target.value)}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate" className="text-base font-medium">End Date</Label>
                <QuickFillButton
                  fieldId="endDate"
                  fieldName="End Date"
                  onSelect={(value) => handleFieldChange("endDate", value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className={`pl-9 ${errors.endDate ? "border-destructive" : ""}`}
                  onChange={(e) => handleFieldChange("endDate", e.target.value)}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="projectDescription" className="text-base font-medium">Project Description</Label>
              <QuickFillButton
                fieldId="projectDescription"
                fieldName="Project Description"
                onSelect={(value) => handleFieldChange("projectDescription", value)}
              />
            </div>
            <div className="relative">
              <ClipboardList className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="projectDescription"
                {...register("projectDescription")}
                className={`min-h-[100px] pl-9 resize-none ${errors.projectDescription ? "border-destructive" : ""}`}
                placeholder="Enter project description"
                onChange={(e) => handleFieldChange("projectDescription", e.target.value)}
              />
              {errors.projectDescription && (
                <p className="text-sm text-destructive mt-1">{errors.projectDescription.message}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};