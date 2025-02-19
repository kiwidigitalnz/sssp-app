
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Activity, FileText, Share, Edit } from "lucide-react";

interface ActivityDetailDialogProps {
  activity: {
    id: string;
    action: string;
    created_at: string;
    details?: any;
    sssps: { title: string };
    profiles?: {
      first_name?: string;
      last_name?: string;
    };
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailDialog({ activity, open, onOpenChange }: ActivityDetailDialogProps) {
  if (!activity) return null;

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "created":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "updated":
        return <Edit className="h-5 w-5 text-blue-500" />;
      case "shared":
        return <Share className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTitle = (action: string) => {
    const userName = activity.profiles?.first_name 
      ? `${activity.profiles.first_name} ${activity.profiles.last_name}`
      : 'A user';
    
    switch (action) {
      case 'created':
        return `${userName} created "${activity.sssps.title}"`;
      case 'updated':
        return `${userName} updated "${activity.sssps.title}"`;
      case 'shared':
        return `${userName} shared "${activity.sssps.title}"`;
      default:
        return `${userName} performed an action on "${activity.sssps.title}"`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 rounded-full bg-muted/20">
              {getActivityIcon(activity.action)}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                {getActivityTitle(activity.action)}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(activity.created_at), 'PPp')}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {activity.details && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(activity.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
