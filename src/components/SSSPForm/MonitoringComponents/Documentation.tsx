
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DocumentationProps {
  data: {
    storage_location: string;
    retention_period: string;
    access_details: string;
  };
  onChange: (data: any) => void;
}

export const Documentation = ({ data, onChange }: DocumentationProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Storage Location</Label>
        <Input
          value={data?.storage_location || ""}
          onChange={(e) => onChange({ ...data, storage_location: e.target.value })}
          placeholder="Where are SSSP documents stored?"
        />
      </div>

      <div className="space-y-2">
        <Label>Retention Period</Label>
        <Input
          value={data?.retention_period || ""}
          onChange={(e) => onChange({ ...data, retention_period: e.target.value })}
          placeholder="How long are documents kept?"
        />
      </div>

      <div className="space-y-2">
        <Label>Access Details</Label>
        <Textarea
          value={data?.access_details || ""}
          onChange={(e) => onChange({ ...data, access_details: e.target.value })}
          placeholder="How can workers access these documents?"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
