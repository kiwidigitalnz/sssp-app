import { ControllerRenderProps } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyMemberFormValues } from "@/types/company";

interface RoleSelectorProps {
  field: ControllerRenderProps<CompanyMemberFormValues, "role">;
  disabled: boolean;
}

export function RoleSelector({ field, disabled }: RoleSelectorProps) {
  return (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}