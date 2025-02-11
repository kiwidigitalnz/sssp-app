
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ProjectNameSection } from "@/components/SSSPForm/sections/ProjectNameSection";
import { AddressSection } from "@/components/SSSPForm/sections/AddressSection";
import { DateSection } from "@/components/SSSPForm/sections/DateSection";
import { DescriptionSection } from "@/components/SSSPForm/sections/DescriptionSection";
import { projectDetailsSchema, type ProjectDetailsFormData } from "@/components/SSSPForm/validation/projectDetailsSchema";

interface ProjectDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  isLoading?: boolean;
}

export const ProjectDetails = ({ formData, setFormData, isLoading }: ProjectDetailsProps) => {
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
    setValue,
    trigger
  } = useForm<ProjectDetailsFormData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      projectName: formData?.title || "",
      siteAddress: formData?.company_address || "",
      startDate: formData?.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : "",
      endDate: formData?.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : "",
      projectDescription: formData?.description || ""
    }
  });

  useEffect(() => {
    if (formData) {
      setValue("projectName", formData.title || "");
      setValue("siteAddress", formData.company_address || "");
      setValue("startDate", formData.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : "");
      setValue("endDate", formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : "");
      setValue("projectDescription", formData.description || "");
    }
  }, [formData, setValue]);

  const handleFieldChange = async (field: keyof ProjectDetailsFormData, value: string) => {
    const updates: any = {
      ...formData,
    };

    // Map form fields to database fields
    switch (field) {
      case "projectName":
        updates.title = value;
        break;
      case "siteAddress":
        updates.company_address = value;
        break;
      case "startDate":
        updates.start_date = value;
        break;
      case "endDate":
        updates.end_date = value;
        break;
      case "projectDescription":
        updates.description = value;
        break;
    }

    setFormData(updates);
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
          <ProjectNameSection
            register={register}
            error={errors.projectName?.message}
            onValueChange={(value) => handleFieldChange("projectName", value)}
          />

          <AddressSection
            register={register}
            error={errors.siteAddress?.message}
            onValueChange={(value) => handleFieldChange("siteAddress", value)}
          />

          <DateSection
            register={register}
            startDateError={errors.startDate?.message}
            endDateError={errors.endDate?.message}
            onStartDateChange={(value) => handleFieldChange("startDate", value)}
            onEndDateChange={(value) => handleFieldChange("endDate", value)}
          />

          <DescriptionSection
            register={register}
            error={errors.projectDescription?.message}
            onValueChange={(value) => handleFieldChange("projectDescription", value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
