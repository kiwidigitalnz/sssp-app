
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Check, X } from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: any;
  fieldKey: string;
  isEditing: boolean;
  tempValue: string;
  onEdit: (key: string, value: any) => void;
  onSave: (key: string) => void;
  onCancel: () => void;
  onValueChange: (value: string) => void;
  isTextArea?: boolean;
  isDate?: boolean;
}

export const EditableField = ({
  label,
  value,
  fieldKey,
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onValueChange,
  isTextArea,
  isDate
}: EditableFieldProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
      <div className="flex-1">
        <span className="text-sm font-medium">{label}</span>
        <div className="mt-1">
          {isEditing ? (
            isTextArea ? (
              <Textarea
                value={tempValue}
                onChange={(e) => onValueChange(e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <Input
                type={isDate ? "date" : "text"}
                value={tempValue}
                onChange={(e) => onValueChange(e.target.value)}
              />
            )
          ) : (
            <div className="text-sm text-muted-foreground">
              {value ? (
                isDate ? 
                  new Date(value).toLocaleDateString() : 
                  value
              ) : (
                <span className="italic text-muted-foreground">Not provided</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSave(fieldKey)}
              className="h-8 w-8 shrink-0"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(fieldKey, value)}
            className="h-8 w-8 shrink-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
