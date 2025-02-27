
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addMonths, addWeeks, parseISO, isAfter, isBefore, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Check, CalendarClock, ChevronDown, ChevronUp, Clock, User, CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  sssp_id: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: any;
  created_at: string;
  user_id: string;
  user_name?: string;
}

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannually", label: "Bi-annually" },
  { value: "annually", label: "Annually" },
];

export const ReviewSchedule = ({ data, onChange, sssp_id }: ReviewScheduleProps) => {
  const { toast } = useToast();
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const [newReviewFindings, setNewReviewFindings] = useState("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Initialize default values if not present
  const reviewData = {
    frequency: data?.frequency || "",
    last_review: data?.last_review || null,
    next_review: data?.next_review || null,
    responsible_person: data?.responsible_person || null,
    past_reviews: data?.past_reviews || []
  };

  // Get the current logged-in user on component mount
  useEffect(() => {
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

  // Fetch activity logs when SSSP ID changes or on initial render
  useEffect(() => {
    if (sssp_id) {
      fetchActivityLogs();
    }
  }, [sssp_id]);

  const fetchActivityLogs = async () => {
    if (!sssp_id) return;
    
    setIsLoadingActivity(true);
    try {
      // Get activity logs for this SSSP
      const { data: logs, error } = await supabase
        .from('sssp_activity')
        .select('*')
        .eq('sssp_id', sssp_id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Get user info for each log
      const logsWithUserNames = await Promise.all(logs.map(async (log) => {
        const { data: userData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', log.user_id)
          .single();
          
        let userName = 'Unknown user';
        if (userData) {
          userName = [userData.first_name, userData.last_name]
            .filter(Boolean)
            .join(' ');
        }
        
        return {
          ...log,
          user_name: userName
        };
      }));
      
      setActivityLogs(logsWithUserNames);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load activity logs"
      });
    } finally {
      setIsLoadingActivity(false);
    }
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
    
    // Get changes since last review from activity logs
    const lastReviewDate = reviewData.last_review ? new Date(reviewData.last_review) : null;
    let automaticChangeLog = "";
    
    if (lastReviewDate) {
      const changesSinceLastReview = activityLogs.filter(log => 
        new Date(log.created_at) > lastReviewDate
      );
      
      if (changesSinceLastReview.length > 0) {
        automaticChangeLog = changesSinceLastReview.map(log => {
          const date = format(new Date(log.created_at), 'yyyy-MM-dd');
          return `${date}: ${log.action} by ${log.user_name || 'unknown user'}${log.details?.updated_fields ? ` (updated: ${log.details.updated_fields.join(', ')})` : ''}`;
        }).join('\n');
      }
    }
    
    const changesMade = automaticChangeLog 
      ? `Automatic changes detected:\n${automaticChangeLog}\n\nAdditional notes:\n${newReviewFindings}` 
      : newReviewFindings;
    
    // Create a new review record
    const newReviewRecord: ReviewRecord = {
      date: today,
      reviewer: currentUserName,
      reviewer_id: currentUserId,
      findings: newReviewFindings,
      changes_made: changesMade
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
    
    toast({
      title: "Review Completed",
      description: `The review has been marked as completed. Next review scheduled for ${nextReviewDate}.`
    });
  };

  // Calculate days until next review
  const daysUntilNextReview = reviewData.next_review ? 
    differenceInDays(new Date(reviewData.next_review), new Date()) : null;

  const isOverdue = daysUntilNextReview !== null && daysUntilNextReview < 0;
  const isUpcoming = daysUntilNextReview !== null && daysUntilNextReview >= 0 && daysUntilNextReview <= 7;
  const isRecent = reviewData.last_review && differenceInDays(new Date(), new Date(reviewData.last_review)) <= 7;
  
  // Get review status for display
  const getReviewStatus = () => {
    if (isOverdue) {
      return {
        icon: <XCircle className="h-6 w-6 text-red-500" />,
        title: "Review Overdue",
        description: `Overdue by ${Math.abs(daysUntilNextReview || 0)} days`,
        class: "border-red-200 bg-red-50"
      };
    } else if (isUpcoming) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
        title: "Review Due Soon",
        description: `Due in ${daysUntilNextReview} days`,
        class: "border-amber-200 bg-amber-50"
      };
    } else if (isRecent) {
      return {
        icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
        title: "Recently Reviewed",
        description: `Last reviewed on ${reviewData.last_review}`,
        class: "border-green-200 bg-green-50"
      };
    } else if (reviewData.next_review) {
      return {
        icon: <CalendarClock className="h-6 w-6 text-blue-500" />,
        title: "Review Scheduled",
        description: `Next review in ${daysUntilNextReview} days`,
        class: "border-blue-200 bg-blue-50"
      };
    } else {
      return {
        icon: <Calendar className="h-6 w-6 text-muted-foreground" />,
        title: "No Review Scheduled",
        description: "Set up a review schedule to begin tracking",
        class: "border-gray-200 bg-gray-50"
      };
    }
  };
  
  const status = getReviewStatus();
  
  // Sort past reviews by date (most recent first)
  const sortedPastReviews = [...reviewData.past_reviews].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get changes since last review
  const getRecentChanges = () => {
    if (!reviewData.last_review) return [];
    
    const lastReviewDate = new Date(reviewData.last_review);
    return activityLogs.filter(log => 
      new Date(log.created_at) > lastReviewDate
    );
  };
  
  const recentChanges = getRecentChanges();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Schedule Settings */}
        <div className="w-full md:w-1/2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Schedule</CardTitle>
              <CardDescription>Set how often this SSSP should be reviewed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last-review">Last Review</Label>
                  <div className="text-sm font-medium">
                    {reviewData.last_review ? format(new Date(reviewData.last_review), 'dd MMM yyyy') : 'Not reviewed yet'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="next-review">Next Review</Label>
                  <div className="text-sm font-medium">
                    {reviewData.next_review ? format(new Date(reviewData.next_review), 'dd MMM yyyy') : 'Not scheduled'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Status & Actions */}
        <div className="w-full md:w-1/2 space-y-4">
          <Card className={`${status.class}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                {status.icon}
                <div>
                  <h3 className="font-semibold text-lg">{status.title}</h3>
                  <p className="text-sm text-muted-foreground">{status.description}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={() => setIsReviewModalOpen(!isReviewModalOpen)} 
                  className="w-full gap-2"
                >
                  <Check className="h-4 w-4" />
                  Complete Review Now
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {recentChanges.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Changes Since Last Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {recentChanges.slice(0, 3).map((change) => (
                    <li key={change.id} className="flex items-start gap-2">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{change.action}</span> by {change.user_name} on {format(new Date(change.created_at), 'dd MMM yyyy')}
                      </div>
                    </li>
                  ))}
                  {recentChanges.length > 3 && (
                    <li className="text-xs text-muted-foreground pl-4">
                      +{recentChanges.length - 3} more changes
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Review Form - Conditionally visible */}
      {isReviewModalOpen && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Complete SSSP Review</CardTitle>
            <CardDescription>
              Document your findings and any changes made since the last review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentChanges.length > 0 && (
              <div className="space-y-2">
                <Label>Changes Detected Since Last Review</Label>
                <Card className="bg-muted/50">
                  <CardContent className="py-3 px-4">
                    <ul className="space-y-1.5 text-sm">
                      {recentChanges.map((change) => (
                        <li key={change.id} className="flex items-start gap-2">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{change.action}</span> by {change.user_name} on {format(new Date(change.created_at), 'dd MMM yyyy')}
                            {change.details?.updated_fields && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (updated: {change.details.updated_fields.join(', ')})
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  These changes will be automatically included in your review notes
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="review-findings">Review Findings and Additional Notes</Label>
              <Textarea 
                id="review-findings" 
                value={newReviewFindings}
                onChange={(e) => setNewReviewFindings(e.target.value)}
                placeholder="Enter your findings, observations, or additional notes from this review..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteReview} className="gap-2">
                <Check className="h-4 w-4" />
                Complete Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Reviews Timeline */}
      {sortedPastReviews.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Review History</h3>
          <div className="space-y-3 relative">
            {/* Timeline connector */}
            <div className="absolute left-[19px] top-8 bottom-0 w-[2px] bg-muted" />
            
            {sortedPastReviews.map((review, index) => (
              <Collapsible 
                key={`${review.date}-${index}`} 
                open={expandedReviewId === `${review.date}-${index}`}
                onOpenChange={(open) => setExpandedReviewId(open ? `${review.date}-${index}` : null)}
                className="relative z-10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-muted-foreground flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 bg-background border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center p-4">
                      <div>
                        <h4 className="font-medium">Review on {format(new Date(review.date), 'dd MMM yyyy')}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          <span>{review.reviewer}</span>
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
                          <h5 className="text-sm font-medium mb-1">Findings & Notes</h5>
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
                  </div>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
