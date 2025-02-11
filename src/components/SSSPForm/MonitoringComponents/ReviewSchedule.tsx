
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReviewScheduleProps {
  data: {
    frequency: string;
    last_review: string | null;
    next_review: string | null;
    responsible_person: string | null;
  };
  onChange: (data: any) => void;
}

export const ReviewSchedule = ({ data, onChange }: ReviewScheduleProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Review Frequency</Label>
          <Select
            value={data?.frequency || "monthly"}
            onValueChange={(value) => onChange({ ...data, frequency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="biannually">Bi-annually</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Responsible Person</Label>
          <Input
            value={data?.responsible_person || ""}
            onChange={(e) => onChange({ ...data, responsible_person: e.target.value })}
            placeholder="Name of responsible person"
          />
        </div>

        <div className="space-y-2">
          <Label>Last Review Date</Label>
          <Input
            type="date"
            value={data?.last_review || ""}
            onChange={(e) => onChange({ ...data, last_review: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Next Review Due</Label>
          <Input
            type="date"
            value={data?.next_review || ""}
            onChange={(e) => onChange({ ...data, next_review: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
