
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon, InfoIcon, AlertCircle, CheckCircle, Clock, HelpCircle } from "lucide-react";
import { addWeeks, addMonths, addQuarters, addYears, format, parseISO, differenceInDays, isBefore, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ReviewScheduleProps {
  data: {
    frequency: string;
    last_review: string | null;
    next_review: string | null;
    responsible_person: string | null;
    notes?: string;
  };
  onChange: (data: any) => void;
}

export const ReviewSchedule = ({ data, onChange }: ReviewScheduleProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'ontrack' | 'upcoming' | 'overdue' | 'notset'>('notset');

  // Calculate next review date based on frequency and last review date
  const calculateNextReviewDate = (frequency: string, lastReviewDate: string): string => {
    try {
      const date = parseISO(lastReviewDate);
      let nextDate;
      
      switch (frequency) {
        case 'weekly':
          nextDate = addWeeks(date, 1);
          break;
        case 'monthly':
          nextDate = addMonths(date, 1);
          break;
        case 'quarterly':
          nextDate = addQuarters(date, 1);
          break;
        case 'biannually':
          nextDate = addMonths(date, 6);
          break;
        case 'annually':
          nextDate = addYears(date, 1);
          break;
        default:
          nextDate = addMonths(date, 1); // Default to monthly
      }
      
      return format(nextDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error("Error calculating next review date:", error);
      return "";
    }
  };

  // Update next review date when frequency or last review changes
  useEffect(() => {
    if (data.last_review && data.frequency) {
      const nextDate = calculateNextReviewDate(data.frequency, data.last_review);
      if (nextDate !== data.next_review) {
        onChange({ ...data, next_review: nextDate });
      }
    }
  }, [data.frequency, data.last_review]);

  // Determine review status
  useEffect(() => {
    if (!data.next_review) {
      setStatus('notset');
      return;
    }

    try {
      const nextReviewDate = parseISO(data.next_review);
      const today = new Date();
      const daysUntilReview = differenceInDays(nextReviewDate, today);

      if (isPast(nextReviewDate)) {
        setStatus('overdue');
      } else if (daysUntilReview <= 30) {
        setStatus('upcoming');
      } else {
        setStatus('ontrack');
      }
    } catch (error) {
      console.error("Error determining review status:", error);
      setStatus('notset');
    }
  }, [data.next_review]);

  const handleMarkComplete = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const nextDate = calculateNextReviewDate(data.frequency, today);
    
    onChange({
      ...data,
      last_review: today,
      next_review: nextDate
    });

    toast({
      title: "SSSP Review Completed",
      description: `Next review scheduled for ${format(parseISO(nextDate), 'PPP')}`,
    });
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'ontrack':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>On track</span>
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="h-5 w-5" />
            <span>Due soon</span>
          </div>
        );
      case 'overdue':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Overdue</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-slate-500">
            <HelpCircle className="h-5 w-5" />
            <span>Not scheduled</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b">
        <h3 className="text-xl font-medium">SSSP Review</h3>
        <div className="mt-2 md:mt-0">
          {getStatusIndicator()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Review Frequency</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Select
                      value={data?.frequency || "monthly"}
                      onValueChange={(value) => onChange({ ...data, frequency: value })}
                    >
                      <SelectTrigger id="frequency">
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
                    <InfoIcon className="h-4 w-4 absolute right-10 top-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  How often the SSSP needs to be reviewed
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible_person">Responsible Person</Label>
            <Input
              id="responsible_person"
              value={data?.responsible_person || ""}
              onChange={(e) => onChange({ ...data, responsible_person: e.target.value })}
              placeholder="Name of responsible person"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="last_review">Last Review Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.last_review && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.last_review ? format(parseISO(data.last_review), 'PPP') : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.last_review ? parseISO(data.last_review) : undefined}
                  onSelect={(date) => onChange({ 
                    ...data, 
                    last_review: date ? format(date, 'yyyy-MM-dd') : null 
                  })}
                  disabled={(date) => isBefore(new Date(), date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_review">Next Review Due</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.next_review && "text-muted-foreground",
                    status === 'overdue' && "border-red-500 text-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.next_review ? format(parseISO(data.next_review), 'PPP') : "Not scheduled"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.next_review ? parseISO(data.next_review) : undefined}
                  onSelect={(date) => onChange({ 
                    ...data, 
                    next_review: date ? format(date, 'yyyy-MM-dd') : null 
                  })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Review Notes</Label>
        <Textarea
          id="notes"
          value={data?.notes || ""}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Enter any notes about the SSSP review process..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleMarkComplete} className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Mark Review Complete
        </Button>
      </div>

      {data.last_review && (
        <div className="rounded-lg border p-4 bg-muted/50">
          <h4 className="font-medium mb-2">Review History</h4>
          <div className="text-sm">
            <p>Last reviewed on {data.last_review ? format(parseISO(data.last_review), 'PPP') : 'N/A'}</p>
            {data.responsible_person && <p>Reviewed by: {data.responsible_person}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
