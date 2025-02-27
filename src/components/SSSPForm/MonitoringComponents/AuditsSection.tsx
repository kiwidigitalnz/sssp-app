
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronDown, ChevronUp, Check, AlertCircle, Edit } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format, addDays, addWeeks, addMonths, addQuarters, addYears, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Audit {
  id?: string;
  type: string;
  frequency: string;
  responsible: string;
  last_completed: string;
  next_due: string;
  findings: string;
  status: 'draft' | 'pending' | 'completed';
}

interface AuditsSectionProps {
  data: Audit[];
  onChange: (data: Audit[]) => void;
}

export const AuditsSection = ({ data = [], onChange }: AuditsSectionProps) => {
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate unique ID for each audit if not already present
  const audits = data.map(audit => ({
    ...audit,
    id: audit.id || `audit-${Math.random().toString(36).substring(2, 11)}`,
    status: audit.status || 'pending'
  }));

  const handleAddAudit = () => {
    const newAudit: Audit = {
      id: `audit-${Math.random().toString(36).substring(2, 11)}`,
      type: "",
      frequency: "monthly",
      responsible: "",
      last_completed: "",
      next_due: "",
      findings: "",
      status: 'draft'
    };
    
    onChange([...audits, newAudit]);
    setExpandedAuditId(newAudit.id);
  };

  const handleRemoveAudit = (id: string) => {
    onChange(audits.filter(audit => audit.id !== id));
    if (expandedAuditId === id) {
      setExpandedAuditId(null);
    }
  };

  const handleUpdateAudit = (id: string, field: keyof Audit, value: string) => {
    const newData = audits.map(audit => {
      if (audit.id === id) {
        return { ...audit, [field]: value };
      }
      return audit;
    });
    onChange(newData);
  };

  const calculateNextDueDate = (frequency: string, fromDate: string): string => {
    try {
      const date = parseISO(fromDate);
      let nextDate;
      
      switch (frequency) {
        case 'daily':
          nextDate = addDays(date, 1);
          break;
        case 'weekly':
          nextDate = addWeeks(date, 1);
          break;
        case 'monthly':
          nextDate = addMonths(date, 1);
          break;
        case 'quarterly':
          nextDate = addQuarters(date, 1);
          break;
        case 'annually':
          nextDate = addYears(date, 1);
          break;
        default:
          nextDate = addMonths(date, 1); // Default to monthly
      }
      
      return format(nextDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error("Error calculating next due date:", error);
      return "";
    }
  };

  const handleCompleteAudit = (audit: Audit) => {
    if (!audit.findings) {
      toast({
        title: "Missing Information",
        description: "Please add findings before completing this audit",
        variant: "destructive"
      });
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const nextDueDate = calculateNextDueDate(audit.frequency, today);
    
    // Update the current audit
    const completedAudit = {
      ...audit,
      last_completed: today,
      status: 'completed' as const
    };
    
    // Create a new pending audit for the next cycle
    const newAudit: Audit = {
      id: `audit-${Math.random().toString(36).substring(2, 11)}`,
      type: audit.type,
      frequency: audit.frequency,
      responsible: audit.responsible,
      last_completed: today,
      next_due: nextDueDate,
      findings: "",
      status: 'pending' as const
    };
    
    // Update the data with both the completed audit and the new pending one
    const updatedAudits = audits.map(a => a.id === audit.id ? completedAudit : a);
    onChange([...updatedAudits, newAudit]);
    
    toast({
      title: "Audit Completed",
      description: `The ${audit.type} audit has been marked as completed. A new audit has been scheduled for ${nextDueDate}.`
    });

    // Close the current expanded audit
    setExpandedAuditId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Edit className="h-5 w-5 text-slate-500" />;
    }
  };

  const getCardStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return "border-l-4 border-l-green-500";
      case 'pending':
        return "border-l-4 border-l-amber-500";
      default:
        return "border-l-4 border-l-slate-300";
    }
  };

  // Sort audits: drafts first, then pending (by due date), then completed
  const sortedAudits = [...audits].sort((a, b) => {
    // First, sort by status
    if (a.status !== b.status) {
      if (a.status === 'draft') return -1;
      if (b.status === 'draft') return 1;
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
    }
    
    // Then sort by next_due date for pending ones
    if (a.status === 'pending' && b.status === 'pending') {
      return a.next_due.localeCompare(b.next_due);
    }
    
    // Then sort by last_completed date for completed ones (most recent first)
    if (a.status === 'completed' && b.status === 'completed') {
      return b.last_completed.localeCompare(a.last_completed);
    }
    
    return 0;
  });

  const pendingAudits = sortedAudits.filter(audit => audit.status === 'pending' || audit.status === 'draft');
  const completedAudits = sortedAudits.filter(audit => audit.status === 'completed');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4">Pending & Draft Audits</h3>
        <div className="grid gap-4">
          {pendingAudits.map((audit) => (
            <Collapsible 
              key={audit.id} 
              open={expandedAuditId === audit.id}
              onOpenChange={(open) => setExpandedAuditId(open ? audit.id : null)}
              className={cn("rounded-lg border shadow-sm", getCardStyles(audit.status))}
            >
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(audit.status)}
                  <div>
                    <h4 className="font-medium">{audit.type || "New Audit"}</h4>
                    <div className="text-sm text-muted-foreground">
                      {audit.next_due ? (
                        <>Due: {audit.next_due}</>
                      ) : (
                        <>No due date set</>
                      )}
                      {audit.responsible && <> • {audit.responsible}</>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveAudit(audit.id!)} 
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {expandedAuditId === audit.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Audit Type</Label>
                      <Input
                        value={audit.type}
                        onChange={(e) => handleUpdateAudit(audit.id!, "type", e.target.value)}
                        placeholder="e.g., Site Safety Inspection"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={audit.frequency}
                        onValueChange={(value) => handleUpdateAudit(audit.id!, "frequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Responsible Person</Label>
                      <Input
                        value={audit.responsible}
                        onChange={(e) => handleUpdateAudit(audit.id!, "responsible", e.target.value)}
                        placeholder="Who conducts this audit?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Last Completed</Label>
                      <Input
                        type="date"
                        value={audit.last_completed}
                        onChange={(e) => handleUpdateAudit(audit.id!, "last_completed", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Next Due</Label>
                      <Input
                        type="date"
                        value={audit.next_due}
                        onChange={(e) => handleUpdateAudit(audit.id!, "next_due", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Findings/Notes</Label>
                      <Textarea
                        value={audit.findings}
                        onChange={(e) => handleUpdateAudit(audit.id!, "findings", e.target.value)}
                        placeholder="Summary of audit findings..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex justify-end md:col-span-2">
                      <Button 
                        onClick={() => handleCompleteAudit(audit)}
                        className="gap-2"
                        disabled={audit.status === 'completed'}
                      >
                        <Check className="h-4 w-4" />
                        Mark as Completed
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          {pendingAudits.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-muted-foreground">
                No pending audits. Add a new audit to get started.
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {completedAudits.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Completed Audits</h3>
          <div className="grid gap-4">
            {completedAudits.map((audit) => (
              <Collapsible 
                key={audit.id} 
                open={expandedAuditId === audit.id}
                onOpenChange={(open) => setExpandedAuditId(open ? audit.id : null)}
                className={cn("rounded-lg border shadow-sm", getCardStyles(audit.status))}
              >
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(audit.status)}
                    <div>
                      <h4 className="font-medium">{audit.type}</h4>
                      <div className="text-sm text-muted-foreground">
                        Completed: {audit.last_completed}
                        {audit.responsible && <> • {audit.responsible}</>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveAudit(audit.id!)} 
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {expandedAuditId === audit.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Findings/Notes</Label>
                        <Textarea
                          value={audit.findings}
                          onChange={(e) => handleUpdateAudit(audit.id!, "findings", e.target.value)}
                          className="min-h-[80px]"
                          readOnly
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Audit Type</Label>
                          <p>{audit.type}</p>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Frequency</Label>
                          <p>{audit.frequency}</p>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Responsible Person</Label>
                          <p>{audit.responsible}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleAddAudit} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Audit
      </Button>
    </div>
  );
};
