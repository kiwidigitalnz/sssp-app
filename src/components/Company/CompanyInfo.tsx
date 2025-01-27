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
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  defaultValues?: Partial<CompanyFormValues>;
  isLoading?: boolean;
  companyId?: string;
}

export function CompanyInfo({ onSubmit, defaultValues, isLoading = false, companyId }: CompanyInfoProps) {
  const { toast } = useToast();
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CompanyLogo
              logoUrl={form.watch("logo_url")}
              companyId={companyId}
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