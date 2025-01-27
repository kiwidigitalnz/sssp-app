import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CompanyBasicInfo } from "./CompanyBasicInfo";
import { CompanyAddress } from "./CompanyAddress";
import { CompanyContact } from "./CompanyContact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyLogo } from "./CompanyLogo";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const companyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Please enter a valid URL"),
  logo_url: z.string().nullable(),
  address: z.object({
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  }),
  contact: z.object({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
  }),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyInfoProps {
  onSubmit?: (values: CompanyFormValues) => Promise<void>;
  defaultValues?: Partial<CompanyFormValues>;
  isLoading?: boolean;
  companyId?: string;
}

export function CompanyInfo({ defaultValues, isLoading = false }: CompanyInfoProps) {
  const { toast } = useToast();
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data: companyAccess, error: accessError } = await supabase
          .from('company_access')
          .select('company_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (accessError) throw accessError;

        if (companyAccess?.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyAccess.company_id)
            .single();

          if (companyError) throw companyError;
          setCompany(companyData);
          
          // Update form with company data
          form.reset({
            name: companyData.name,
            website: companyData.website || "",
            logo_url: companyData.logo_url,
            address: {
              street: companyData.address || "",
              city: companyData.address || "", // Fixed: Using address field instead of non-existent city
              postalCode: companyData.address || "", // Fixed: Using address field instead of non-existent postal_code
            },
            contact: {
              email: companyData.email || "",
              phone: companyData.phone || "",
            },
          });
        }
      } catch (error: any) {
        console.error('Error fetching company data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load company data",
        });
      }
    };

    fetchCompanyData();
  }, []);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      website: "",
      logo_url: null,
      address: {
        street: "",
        city: "",
        postalCode: "",
      },
      contact: {
        email: "",
        phone: "",
      },
      ...defaultValues,
    },
  });

  const handleLogoUpload = async (filePath: string) => {
    form.setValue("logo_url", filePath);
    toast({
      title: "Logo updated",
      description: "Your company logo has been updated successfully.",
    });

    // Update company logo in database
    if (company?.id) {
      const { error } = await supabase
        .from('companies')
        .update({ logo_url: filePath })
        .eq('id', company.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update company logo",
        });
      }
    }
  };

  const handleSubmit = async (values: CompanyFormValues) => {
    try {
      if (company?.id) {
        const { error } = await supabase
          .from('companies')
          .update({
            name: values.name,
            website: values.website,
            logo_url: values.logo_url,
            address: values.address.street,
            email: values.contact.email,
            phone: values.contact.phone,
          })
          .eq('id', company.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Company information updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <CompanyLogo
              logoUrl={form.watch("logo_url")}
              companyId={company?.id}
              onUploadSuccess={handleLogoUpload}
              isLoading={isLoading}
            />
            <CompanyBasicInfo control={form.control} isLoading={isLoading} />
            <CompanyAddress control={form.control} isLoading={isLoading} />
            <CompanyContact control={form.control} isLoading={isLoading} />
            
            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}