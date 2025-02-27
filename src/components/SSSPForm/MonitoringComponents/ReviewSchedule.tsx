
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addMonths, addWeeks, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Check, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  const handleCompleteReview = () => {
    if (!reviewData.frequency) {
      toast({
        title: "Missing Information",
        description: "Please select a review frequency before marking as completed",
        variant: "destructive"
      });
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    let nextDate;
    
    // Calculate next review date based on frequency
    switch (reviewData.frequency) {
      case "weekly":
        nextDate = addWeeks(new Date(), 1);
        break;
      case "monthly":
        nextDate = addMonths(new Date(), 1);
        break;
      case "quarterly":
        nextDate = addMonths(new Date(), 3);
        break;
      case "biannually":
        nextDate = addMonths(new Date(), 6);
        break;
      case "annually":
        nextDate = addMonths(new Date(), 12);
        break;
      default:
        nextDate = addMonths(new Date(), 3); // Default to quarterly
    }

    const nextReviewDate = format(nextDate, 'yyyy-MM-dd');
    
    // Update review schedule data
    const updatedData = {
      ...reviewData,
      last_review: today,
      next_review: nextReviewDate
    };
    
    onChange(updatedData);
    
    toast({
      title: "Review Completed",
      description: `The review has been marked as completed. Next review scheduled for ${nextReviewDate}.`
    });
  };

  // Calculate how many days until next review (if dates are valid)
  const daysUntilNextReview = reviewData.next_review ? 
    Math.ceil((new Date(reviewData.next_review).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  const isOverdue = daysUntilNextReview !== null && daysUntilNextReview < 0;
  const isUpcoming = daysUntilNextReview !== null && daysUntilNextReview >= 0 && daysUntilNextReview <= 7;

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

      {reviewData.next_review && (
        <Card className={`mt-4 ${isOverdue ? 'border-red-400' : isUpcoming ? 'border-amber-400' : ''}`}>
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className={`h-5 w-5 ${isOverdue ? 'text-red-500' : isUpcoming ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium">
                  {isOverdue 
                    ? `Overdue by ${Math.abs(daysUntilNextReview || 0)} days` 
                    : isUpcoming 
                      ? `Due soon: ${daysUntilNextReview} days remaining` 
                      : `Next review in ${daysUntilNextReview} days`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Next review date: {reviewData.next_review}
                </p>
              </div>
            </div>
            
            <Button onClick={handleCompleteReview} className="gap-2">
              <Check className="h-4 w-4" />
              Mark Review as Completed
            </Button>
          </CardContent>
        </Card>
      )}

      {!reviewData.next_review && (
        <Button onClick={handleCompleteReview} className="gap-2 mt-4">
          <Check className="h-4 w-4" />
          Mark Review as Completed
        </Button>
      )}
    </div>
  );
};
