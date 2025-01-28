import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin, ClipboardList } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const projectDetailsSchema = z.object({
  projectName: z.string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters"),
  siteAddress: z.string()
    .min(5, "Site address must be at least 5 characters")
    .max(200, "Site address must not exceed 200 characters"),
  startDate: z.string()
    .min(1, "Start date is required")
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Start date must not be in the past"
    }),
  endDate: z.string()
    .min(1, "End date is required")
    .refine((date) => new Date(date) > new Date(), {
      message: "End date must be in the future"
    }),
  projectDescription: z.string()
    .min(20, "Project description must be at least 20 characters")
    .max(1000, "Project description must not exceed 1000 characters")
});

type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;

const fetchSSSP = async (id: string) => {
  const { data, error } = await supabase
    .from('sssps')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const ProjectDetails = ({ formData, setFormData }: any) => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: sssp, isLoading } = useQuery({
    queryKey: ['sssp', id],
    queryFn: () => fetchSSSP(id!),
    enabled: !!id
  });

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
    if (sssp) {
      const startDate = sssp.start_date ? new Date(sssp.start_date).toISOString().split('T')[0] : '';
      const endDate = sssp.end_date ? new Date(sssp.end_date).toISOString().split('T')[0] : '';
      
      setValue("projectName", sssp.title);
      setValue("siteAddress", sssp.company_address || "");
      setValue("startDate", startDate);
      setValue("endDate", endDate);
      setValue("projectDescription", sssp.description || "");

      // Update parent form data
      setFormData({
        ...formData,
        projectName: sssp.title,
        siteAddress: sssp.company_address,
        startDate,
        endDate,
        projectDescription: sssp.description
      });
    }
  }, [sssp, setValue, setFormData]);

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

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

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
