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
import { useQuery } from "@tanstack/react-query";

const companyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Please enter a valid URL").optional().nullable(),
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

export function CompanyInfo() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: companyData, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company-data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { data: companyAccess, error: accessError } = await supabase
        .from('company_access')
        .select('company_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (accessError) throw accessError;
      if (!companyAccess?.company_id) return null;

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyAccess.company_id)
        .maybeSingle();

      if (companyError) throw companyError;
      return company;
    },
  });

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
    },
  });

  useEffect(() => {
    if (companyData) {
      const addressParts = companyData.address ? companyData.address.split(',').map(part => part.trim()) : ['', '', ''];
      
      form.reset({
        name: companyData.name,
        website: companyData.website,
        logo_url: companyData.logo_url,
        address: {
          street: addressParts[0] || '',
          city: addressParts[1] || '',
          postalCode: addressParts[2] || '',
        },
        contact: {
          email: companyData.email || '',
          phone: companyData.phone || '',
        },
      });
    }
  }, [companyData, form]);

  const handleLogoUpload = async (filePath: string) => {
    try {
      form.setValue("logo_url", filePath);

      if (companyData?.id) {
        const { error } = await supabase
          .from('companies')
          .update({ logo_url: filePath })
          .eq('id', companyData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Company logo updated successfully",
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

  const handleSubmit = async (values: CompanyFormValues) => {
    try {
      setIsLoading(true);
      if (companyData?.id) {
        const { error } = await supabase
          .from('companies')
          .update({
            name: values.name,
            website: values.website,
            logo_url: values.logo_url,
            address: `${values.address.street}, ${values.address.city}, ${values.address.postalCode}`,
            email: values.contact.email,
            phone: values.contact.phone,
          })
          .eq('id', companyData.id);

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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCompany) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading company information...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

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
              companyId={companyData?.id}
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