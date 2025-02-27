
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addMonths, addWeeks, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Check, CalendarClock, ChevronDown, ChevronUp, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ReviewRecord {
  date: string;
  reviewer: string;
  reviewer_id?: string;
  findings: string;
  changes_made: string;
}

interface ReviewScheduleData {
  frequency: string;
  last_review: string | null;
  next_review: string | null;
  responsible_person: string | null;
  past_reviews?: ReviewRecord[];
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
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const [newReviewFindings, setNewReviewFindings] = useState("");
  const [newReviewChanges, setNewReviewChanges] = useState("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  
  // Get the current logged-in user on component mount
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        // Get the user's profile info
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
          
        if (profileData) {
          const fullName = [profileData.first_name, profileData.last_name]
            .filter(Boolean)
            .join(' ');
          setCurrentUserName(fullName || user.email || 'Unknown user');
        } else {
          setCurrentUserName(user.email || 'Unknown user');
        }
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Initialize default values if not present
  const reviewData = {
    frequency: data?.frequency || "",
    last_review: data?.last_review || null,
    next_review: data?.next_review || null,
    responsible_person: data?.responsible_person || null,
    past_reviews: data?.past_reviews || []
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

    if (!newReviewFindings.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your findings for this review",
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
    
    // Create a new review record
    const newReviewRecord: ReviewRecord = {
      date: today,
      reviewer: currentUserName,
      reviewer_id: currentUserId,
      findings: newReviewFindings,
      changes_made: newReviewChanges
    };
    
    // Update review schedule data
    const updatedData = {
      ...reviewData,
      last_review: today,
      next_review: nextReviewDate,
      past_reviews: [...reviewData.past_reviews, newReviewRecord]
    };
    
    onChange(updatedData);
    
    // Clear the form fields
    setNewReviewFindings("");
    setNewReviewChanges("");
    
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
  
  // Sort past reviews by date (most recent first)
  const sortedPastReviews = [...reviewData.past_reviews].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
          <CardContent className="py-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
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
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="review-findings">Review Findings</Label>
                <Textarea 
                  id="review-findings" 
                  value={newReviewFindings}
                  onChange={(e) => setNewReviewFindings(e.target.value)}
                  placeholder="Enter findings from your review..."
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  Note any issues, observations, or recommendations from your review.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review-changes">Changes Made</Label>
                <Textarea 
                  id="review-changes" 
                  value={newReviewChanges}
                  onChange={(e) => setNewReviewChanges(e.target.value)}
                  placeholder="Document any changes made to the SSSP during this review..."
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  Document any updates or modifications made to the SSSP as a result of this review.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleCompleteReview} className="gap-2">
                  <Check className="h-4 w-4" />
                  Mark Review as Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!reviewData.next_review && (
        <div className="space-y-3 mt-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="review-findings">Review Findings</Label>
            <Textarea 
              id="review-findings" 
              value={newReviewFindings}
              onChange={(e) => setNewReviewFindings(e.target.value)}
              placeholder="Enter findings from your review..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="review-changes">Changes Made</Label>
            <Textarea 
              id="review-changes" 
              value={newReviewChanges}
              onChange={(e) => setNewReviewChanges(e.target.value)}
              placeholder="Document any changes made to the SSSP during this review..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleCompleteReview} className="gap-2">
              <Check className="h-4 w-4" />
              Mark Review as Completed
            </Button>
          </div>
        </div>
      )}

      {/* Past Reviews Section */}
      {sortedPastReviews.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Past Reviews</h3>
          <div className="space-y-3">
            {sortedPastReviews.map((review, index) => (
              <Collapsible 
                key={`${review.date}-${index}`} 
                open={expandedReviewId === `${review.date}-${index}`}
                onOpenChange={(open) => setExpandedReviewId(open ? `${review.date}-${index}` : null)}
                className="border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Review on {review.date}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        <span>{review.reviewer}</span>
                      </div>
                    </div>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {expandedReviewId === `${review.date}-${index}` ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Findings</h5>
                      <p className="text-sm whitespace-pre-wrap">{review.findings}</p>
                    </div>
                    
                    {review.changes_made && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Changes Made</h5>
                        <p className="text-sm whitespace-pre-wrap">{review.changes_made}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
