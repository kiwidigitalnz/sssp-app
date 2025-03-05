
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
import { SSSPFormData } from "@/types/sssp/forms";

interface ProjectDetailsProps {
  formData: SSSPFormData;
  setFormData: (data: SSSPFormData) => void;
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
      projectName: formData?.title || formData?.projectName || "",
      siteAddress: formData?.site_address || formData?.siteAddress || "",
      startDate: formData?.start_date || formData?.startDate 
        ? new Date(formData.start_date || formData.startDate || "").toISOString().split('T')[0]
        : "",
      endDate: formData?.end_date || formData?.endDate
        ? new Date(formData.end_date || formData.endDate || "").toISOString().split('T')[0]
        : "",
      projectDescription: formData?.description || formData?.projectDescription || ""
    }
  });

  // Debug logged data
  useEffect(() => {
    console.log("ProjectDetails component formData:", formData);
  }, [formData]);

  useEffect(() => {
    if (formData) {
      setValue("projectName", formData.title || formData.projectName || "");
      setValue("siteAddress", formData.site_address || formData.siteAddress || "");
      setValue("startDate", (formData.start_date || formData.startDate)
        ? new Date(formData.start_date || formData.startDate || "").toISOString().split('T')[0]
        : "");
      setValue("endDate", (formData.end_date || formData.endDate)
        ? new Date(formData.end_date || formData.endDate || "").toISOString().split('T')[0]
        : "");
      setValue("projectDescription", formData.description || formData.projectDescription || "");
    }
  }, [formData, setValue]);

  const handleFieldChange = async (field: keyof ProjectDetailsFormData, value: string) => {
    // Create a copy of formData to update
    const updates: SSSPFormData = {
      ...formData,
    };

    // Map form fields to database fields - update both camelCase and snake_case versions
    switch (field) {
      case "projectName":
        updates.projectName = value;
        updates.title = value;
        break;
      case "siteAddress":
        updates.siteAddress = value;
        updates.site_address = value;
        break;
      case "startDate":
        updates.startDate = value;
        updates.start_date = value;
        break;
      case "endDate":
        updates.endDate = value;
        updates.end_date = value;
        break;
      case "projectDescription":
        updates.projectDescription = value;
        updates.description = value;
        break;
    }

    console.log("Updating ProjectDetails with:", updates);
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
