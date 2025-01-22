import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";

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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <QuickFillButton
                        fieldId={`training-requirement-${index}`}
                        fieldName="Training Requirement"
                        onSelect={(value) => updateTraining(index, "requirement", value)}
                      />
                    </div>
                    <Input
                      value={training.requirement}
                      onChange={(e) => updateTraining(index, "requirement", e.target.value)}
                      placeholder="e.g., Class 2 License"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <QuickFillButton
                        fieldId={`training-description-${index}`}
                        fieldName="Training Description"
                        onSelect={(value) => updateTraining(index, "description", value)}
                      />
                    </div>
                    <Input
                      value={training.description}
                      onChange={(e) => updateTraining(index, "description", e.target.value)}
                      placeholder="e.g., Heavy vehicle operation license"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <QuickFillButton
                        fieldId={`training-frequency-${index}`}
                        fieldName="Training Frequency"
                        onSelect={(value) => updateTraining(index, "frequency", value)}
                      />
                    </div>
                    <Input
                      value={training.frequency}
                      onChange={(e) => updateTraining(index, "frequency", e.target.value)}
                      placeholder="e.g., Every 5 years"
                    />
                  </div>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <QuickFillButton
              fieldId="trainingNotes"
              fieldName="Training Notes"
              onSelect={(value) =>
                setFormData({ ...formData, trainingNotes: value })
              }
            />
          </div>
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