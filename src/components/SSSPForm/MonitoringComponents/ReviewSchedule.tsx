
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addMonths, addWeeks, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ReviewScheduleData {
  frequency: string;
  last_review: string | null;
  next_review: string | null;
  responsible_person: string | null;
}

interface ReviewScheduleProps {
  data: ReviewScheduleData;
  onChange: (data: ReviewScheduleData) => void;
}

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannually", label: "Bi-annually" },
  { value: "annually", label: "Annually" },
];

export const ReviewSchedule = ({ data, onChange }: ReviewScheduleProps) => {
  const { toast } = useToast();
  
  // Initialize default values if not present
  const reviewData = {
    frequency: data?.frequency || "",
    last_review: data?.last_review || null,
    next_review: data?.next_review || null,
    responsible_person: data?.responsible_person || null
  };

  const handleInputChange = (field: keyof ReviewScheduleData, value: string | null) => {
    const updatedData = { ...reviewData, [field]: value };
    
    // If the last_review field is updated, calculate the next_review date based on frequency
    if (field === "last_review" && value) {
      try {
        const date = parseISO(value);
        let nextDate;
        
        switch (reviewData.frequency) {
          case "weekly":
            nextDate = addWeeks(date, 1);
            break;
          case "monthly":
            nextDate = addMonths(date, 1);
            break;
          case "quarterly":
            nextDate = addMonths(date, 3);
            break;
          case "biannually":
            nextDate = addMonths(date, 6);
            break;
          case "annually":
            nextDate = addMonths(date, 12);
            break;
          default:
            nextDate = addMonths(date, 3); // Default to quarterly
        }
        
        updatedData.next_review = format(nextDate, "yyyy-MM-dd");
      } catch (error) {
        console.error("Error calculating next review date:", error);
        toast({
          variant: "destructive",
          title: "Date Error",
          description: "There was a problem calculating the next review date."
        });
      }
    }
    
    // If frequency changes and there's a last_review date, recalculate next_review
    if (field === "frequency" && reviewData.last_review) {
      try {
        const date = parseISO(reviewData.last_review);
        let nextDate;
        
        switch (value) {
          case "weekly":
            nextDate = addWeeks(date, 1);
            break;
          case "monthly":
            nextDate = addMonths(date, 1);
            break;
          case "quarterly":
            nextDate = addMonths(date, 3);
            break;
          case "biannually":
            nextDate = addMonths(date, 6);
            break;
          case "annually":
            nextDate = addMonths(date, 12);
            break;
          default:
            nextDate = addMonths(date, 3); // Default to quarterly
        }
        
        updatedData.next_review = format(nextDate, "yyyy-MM-dd");
      } catch (error) {
        console.error("Error recalculating next review date:", error);
      }
    }
    
    onChange(updatedData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="review-frequency">Review Frequency</Label>
          <Select
            value={reviewData.frequency}
            onValueChange={(value) => handleInputChange("frequency", value)}
          >
            <SelectTrigger id="review-frequency">
              <SelectValue placeholder="Select review frequency" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responsible-person">Responsible Person</Label>
          <Input
            id="responsible-person"
            value={reviewData.responsible_person || ""}
            onChange={(e) => handleInputChange("responsible_person", e.target.value)}
            placeholder="Name of person responsible"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last-review">Last Review Date</Label>
          <Input
            id="last-review"
            type="date"
            value={reviewData.last_review || ""}
            onChange={(e) => handleInputChange("last_review", e.target.value || null)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="next-review">Next Review Date</Label>
          <Input
            id="next-review"
            type="date"
            value={reviewData.next_review || ""}
            onChange={(e) => handleInputChange("next_review", e.target.value || null)}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Automatically calculated based on frequency and last review date
          </p>
        </div>
      </div>
    </div>
  );
};
