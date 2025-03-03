
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyNameSection } from "./CompanyComponents/CompanyNameSection";
import { AddressSection } from "./CompanyComponents/AddressSection";
import { ContactDetails } from "./CompanyComponents/ContactDetails";

const companyInfoSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Contact phone is required")
});

type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;

const fetchSSSP = async (id: string) => {
  const { data, error } = await supabase
    .from('sssps')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const CompanyInfo = ({ formData, setFormData }: any) => {
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
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      company_name: formData.company_name || "",
      address: formData.company_address || "",
      contactPerson: formData.company_contact_name || "",
      contactEmail: formData.company_contact_email || "",
      contactPhone: formData.company_contact_phone || ""
    }
  });

  useEffect(() => {
    if (sssp) {
      setValue("company_name", sssp.company_name || "");
      setValue("address", sssp.company_address || "");
      setValue("contactPerson", sssp.company_contact_name || "");
      setValue("contactEmail", sssp.company_contact_email || "");
      setValue("contactPhone", sssp.company_contact_phone || "");

      setFormData({
        ...formData,
        company_name: sssp.company_name,
        company_address: sssp.company_address,
        company_contact_name: sssp.company_contact_name,
        company_contact_email: sssp.company_contact_email,
        company_contact_phone: sssp.company_contact_phone
      });
    }
  }, [sssp, setValue, setFormData, formData]);

  const handleFieldChange = async (field: keyof CompanyInfoFormData, value: string) => {
    // Create a copy of formData to update
    const updatedFormData = { ...formData };
    
    // Map form fields to database fields
    switch (field) {
      case "company_name":
        updatedFormData.company_name = value;
        break;
      case "address":
        updatedFormData.address = value;
        updatedFormData.company_address = value;
        break;
      case "contactPerson":
        updatedFormData.contactPerson = value;
        updatedFormData.company_contact_name = value;
        break;
      case "contactEmail":
        updatedFormData.contactEmail = value;
        updatedFormData.company_contact_email = value;
        break;
      case "contactPhone":
        updatedFormData.contactPhone = value;
        updatedFormData.company_contact_phone = value;
        break;
    }
    
    setFormData(updatedFormData);
    setValue(field, value);
    const result = await trigger(field);
    if (!result) {
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
        <CardHeader>
          <CardTitle>Loading company information...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CompanyNameSection
          value={formData.company_name || ""}
          onChange={(value) => handleFieldChange("company_name", value)}
          error={errors.company_name?.message}
        />

        <AddressSection
          value={formData.company_address || ""}
          onChange={(value) => handleFieldChange("address", value)}
          error={errors.address?.message}
        />

        <ContactDetails
          contactPerson={formData.company_contact_name || ""}
          contactEmail={formData.company_contact_email || ""}
          contactPhone={formData.company_contact_phone || ""}
          onUpdate={handleFieldChange}
          errors={{
            contactPerson: errors.contactPerson?.message,
            contactEmail: errors.contactEmail?.message,
            contactPhone: errors.contactPhone?.message
          }}
        />
      </CardContent>
    </Card>
  );
};
