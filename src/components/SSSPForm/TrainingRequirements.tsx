import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TrainingRequirements = ({ formData, setFormData }: any) => {
  const trainings = formData.trainings || [];

  const addTraining = () => {
    setFormData({
      ...formData,
      trainings: [...trainings, { requirement: "", description: "", frequency: "" }],
    });
  };

  const removeTraining = (index: number) => {
    const updatedTrainings = trainings.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, trainings: updatedTrainings });
  };

  const updateTraining = (index: number, field: string, value: string) => {
    const updatedTrainings = trainings.map((training: any, i: number) =>
      i === index ? { ...training, [field]: value } : training
    );
    setFormData({ ...formData, trainings: updatedTrainings });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Training and Competency Requirements</h2>
      
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requirement</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={training.requirement}
                    onChange={(e) => updateTraining(index, "requirement", e.target.value)}
                    placeholder="e.g., Class 2 License"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={training.description}
                    onChange={(e) => updateTraining(index, "description", e.target.value)}
                    placeholder="e.g., Heavy vehicle operation license"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={training.frequency}
                    onChange={(e) => updateTraining(index, "frequency", e.target.value)}
                    placeholder="e.g., Every 5 years"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTraining(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={addTraining}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Training Requirement
        </Button>

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            value={formData.trainingNotes || ""}
            onChange={(e) =>
              setFormData({ ...formData, trainingNotes: e.target.value })
            }
            placeholder="Add any additional notes about training requirements or competency assessments"
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};