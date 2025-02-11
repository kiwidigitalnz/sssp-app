
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CorrectiveActionsProps {
  data: {
    process: string;
    tracking_method: string;
    responsible_person: string | null;
  };
  onChange: (data: any) => void;
}

export const CorrectiveActions = ({ data, onChange }: CorrectiveActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Process Description</Label>
        <Textarea
          value={data?.process || ""}
          onChange={(e) => onChange({ ...data, process: e.target.value })}
          placeholder="Describe the process for managing corrective actions..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Tracking Method</Label>
        <Input
          value={data?.tracking_method || ""}
          onChange={(e) => onChange({ ...data, tracking_method: e.target.value })}
          placeholder="How are corrective actions tracked?"
        />
      </div>

      <div className="space-y-2">
        <Label>Responsible Person</Label>
        <Input
          value={data?.responsible_person || ""}
          onChange={(e) => onChange({ ...data, responsible_person: e.target.value })}
          placeholder="Who is responsible for managing corrective actions?"
        />
      </div>
    </div>
  );
};
