
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";

interface TextSectionProps {
  title: string;
  fieldId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextSection = ({ title, fieldId, value, onChange, placeholder }: TextSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <QuickFillButton
          fieldId={fieldId}
          fieldName={title}
          onSelect={onChange}
        />
      </div>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
      />
    </div>
  );
};
