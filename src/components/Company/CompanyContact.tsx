import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CompanyFormValues } from "./CompanyInfo";

interface CompanyContactProps {
  control: Control<CompanyFormValues>;
  isLoading: boolean;
}

export function CompanyContact({ control, isLoading }: CompanyContactProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="contact.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input placeholder="contact@company.com" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contact.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}