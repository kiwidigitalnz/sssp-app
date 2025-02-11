
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface ReviewTriggersProps {
  data: string[];
  onChange: (data: string[]) => void;
}

export const ReviewTriggers = ({ data = [], onChange }: ReviewTriggersProps) => {
  const handleAddTrigger = () => {
    onChange([...data, ""]);
  };

  const handleRemoveTrigger = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleUpdateTrigger = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {data.map((trigger, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={trigger}
              onChange={(e) => handleUpdateTrigger(index, e.target.value)}
              placeholder="e.g., Incident occurs"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTrigger(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={handleAddTrigger} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Review Trigger
      </Button>
    </div>
  );
};
