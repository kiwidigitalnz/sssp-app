
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkerConsultationProps {
  data: {
    method: string;
    frequency: string;
    last_consultation: string | null;
  };
  onChange: (data: any) => void;
}

export const WorkerConsultation = ({ data, onChange }: WorkerConsultationProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Consultation Method</Label>
        <Textarea
          value={data?.method || ""}
          onChange={(e) => onChange({ ...data, method: e.target.value })}
          placeholder="How do you consult with workers? (e.g., toolbox talks, safety meetings)"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Frequency</Label>
        <Input
          value={data?.frequency || ""}
          onChange={(e) => onChange({ ...data, frequency: e.target.value })}
          placeholder="How often do consultations occur?"
        />
      </div>

      <div className="space-y-2">
        <Label>Last Consultation Date</Label>
        <Input
          type="date"
          value={data?.last_consultation || ""}
          onChange={(e) => onChange({ ...data, last_consultation: e.target.value })}
        />
      </div>
    </div>
  );
};
