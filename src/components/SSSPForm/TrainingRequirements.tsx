import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { TrainingSelection } from "./TrainingSelection";
import { GraduationCap, BookOpen, Award, ClipboardCheck } from "lucide-react";

export const TrainingRequirements = ({ formData, setFormData }: any) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-md border-l-4 border-l-primary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            Training and Competency Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Required Training Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <BookOpen className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Required Training</h3>
            </div>
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <TrainingSelection
                  previousTrainings={formData.requiredTraining || []}
                  onSelect={(training) =>
                    setFormData({ ...formData, requiredTraining: training })
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Competency Requirements Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Award className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Competency Requirements</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Specify required competencies and qualifications
                </p>
                <QuickFillButton
                  fieldId="competencyRequirements"
                  fieldName="Competency Requirements"
                  onSelect={(value) =>
                    setFormData({ ...formData, competencyRequirements: value })
                  }
                />
              </div>
              <Textarea
                value={formData.competencyRequirements || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    competencyRequirements: e.target.value,
                  })
                }
                placeholder="List required certifications, licenses, and experience levels..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          {/* Training Records Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <ClipboardCheck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Training Records</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Document training record keeping procedures
                </p>
                <QuickFillButton
                  fieldId="trainingRecords"
                  fieldName="Training Records"
                  onSelect={(value) =>
                    setFormData({ ...formData, trainingRecords: value })
                  }
                />
              </div>
              <Textarea
                value={formData.trainingRecords || ""}
                onChange={(e) =>
                  setFormData({ ...formData, trainingRecords: e.target.value })
                }
                placeholder="Describe how training records will be maintained and verified..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};