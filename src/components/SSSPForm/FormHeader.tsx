
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface FormHeaderProps {
  id?: string;
  title: string;
  status: string;
  isNew: boolean;
  isLoading?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export const FormHeader = ({ id, title, status, isNew, isLoading, onSave, onCancel }: FormHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">
          {title || "Untitled SSSP"}
        </h1>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
            {status || "draft"}
          </span>
        </div>
      </div>
      
      {(onSave || onCancel) && (
        <div className="flex gap-4">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="gap-2"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
          {onSave && (
            <Button
              onClick={onSave}
              variant="outline"
              className="gap-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save & Exit"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
