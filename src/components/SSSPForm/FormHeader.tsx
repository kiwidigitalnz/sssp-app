import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface FormHeaderProps {
  id?: string;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const FormHeader = ({ id, isLoading, onSave, onCancel }: FormHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold">
        {id ? "Edit SSSP" : "Create New SSSP"}
      </h1>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="gap-2"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="outline"
          className="gap-2"
          disabled={isLoading}
        >
          <Save className="h-4 w-4" />
          {isLoading ? "Saving..." : "Save & Exit"}
        </Button>
      </div>
    </div>
  );
};