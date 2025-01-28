import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { projectDetailsSchema, type ProjectDetailsFormData } from "./validation/projectDetailsSchema";
import { ProjectNameSection } from "./sections/ProjectNameSection";
import { AddressSection } from "./sections/AddressSection";
import { DateSection } from "./sections/DateSection";
import { DescriptionSection } from "./sections/DescriptionSection";

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
    formState: { errors },
    setValue,
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