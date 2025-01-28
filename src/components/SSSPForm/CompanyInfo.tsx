import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, MapPin, User, Phone } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
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
      companyName: formData.companyName || "",
      address: formData.address || "",
      contactPerson: formData.contactPerson || "",
      contactEmail: formData.contactEmail || "",
      contactPhone: formData.contactPhone || ""
    }
  });

  useEffect(() => {
    if (sssp) {
      setValue("companyName", sssp.company_name || "");
      setValue("address", sssp.company_address || "");
      setValue("contactPerson", sssp.company_contact_name || "");
      setValue("contactEmail", sssp.company_contact_email || "");
      setValue("contactPhone", sssp.company_contact_phone || "");

      setFormData({
        ...formData,
        companyName: sssp.company_name,
        address: sssp.company_address,
        contactPerson: sssp.company_contact_name,
        contactEmail: sssp.company_contact_email,
        contactPhone: sssp.company_contact_phone
      });
    }
  }, [sssp, setValue, setFormData]);

  const handleFieldChange = async (field: keyof CompanyInfoFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
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
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="companyName" className="text-base font-medium">Company Name</Label>
              <QuickFillButton
                fieldId="companyName"
                fieldName="Company Name"
                onSelect={(value) => handleFieldChange("companyName", value)}
              />
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                {...register("companyName")}
                className={`pl-9 ${errors.companyName ? "border-destructive" : ""}`}
                placeholder="Enter company name"
                onChange={(e) => handleFieldChange("companyName", e.target.value)}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address" className="text-base font-medium">Address</Label>
              <QuickFillButton
                fieldId="address"
                fieldName="Address"
                onSelect={(value) => handleFieldChange("address", value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                {...register("address")}
                className={`pl-9 ${errors.address ? "border-destructive" : ""}`}
                placeholder="Enter company address"
                onChange={(e) => handleFieldChange("address", e.target.value)}
              />
              {errors.address && (
                <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contactPerson" className="text-base font-medium">Contact Person</Label>
                <QuickFillButton
                  fieldId="contactPerson"
                  fieldName="Contact Person"
                  onSelect={(value) => handleFieldChange("contactPerson", value)}
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPerson"
                  {...register("contactPerson")}
                  className={`pl-9 ${errors.contactPerson ? "border-destructive" : ""}`}
                  placeholder="Enter contact person name"
                  onChange={(e) => handleFieldChange("contactPerson", e.target.value)}
                />
                {errors.contactPerson && (
                  <p className="text-sm text-destructive mt-1">{errors.contactPerson.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contactEmail" className="text-base font-medium">Contact Email</Label>
                <QuickFillButton
                  fieldId="contactEmail"
                  fieldName="Contact Email"
                  onSelect={(value) => handleFieldChange("contactEmail", value)}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  className={`pl-9 ${errors.contactEmail ? "border-destructive" : ""}`}
                  placeholder="Enter contact email"
                  onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contactPhone" className="text-base font-medium">Contact Phone</Label>
                <QuickFillButton
                  fieldId="contactPhone"
                  fieldName="Contact Phone"
                  onSelect={(value) => handleFieldChange("contactPhone", value)}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPhone"
                  {...register("contactPhone")}
                  className={`pl-9 ${errors.contactPhone ? "border-destructive" : ""}`}
                  placeholder="Enter contact phone"
                  onChange={(e) => handleFieldChange("contactPhone", e.target.value)}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-destructive mt-1">{errors.contactPhone.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};