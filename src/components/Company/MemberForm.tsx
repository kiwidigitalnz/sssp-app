import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "./RoleSelector";
import { CompanyMemberFormValues, companyMemberSchema } from "@/types/company";

interface MemberFormProps {
  onSubmit: (values: CompanyMemberFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function MemberForm({ onSubmit, isLoading, onCancel }: MemberFormProps) {
  const form = useForm<CompanyMemberFormValues>({
    resolver: zodResolver(companyMemberSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="member@company.com" 
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <RoleSelector 
              field={field}
              disabled={!!isLoading}
            />
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { CompanyMemberFormValues };