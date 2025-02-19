
import { format } from "date-fns";
import { Activity, FileText, Share, Edit } from "lucide-react";
import { useState } from "react";
import { ActivityDetailDialog } from "./ActivityDetailDialog";

interface ActivityItemProps {
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
  };
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "created":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "updated":
        return <Edit className="h-4 w-4 text-blue-500" />;
      case "shared":
        return <Share className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItemProps['activity']) => {
    const userName = activity.profiles?.first_name 
      ? `${activity.profiles.first_name} ${activity.profiles.last_name}`
      : 'A user';
    
    switch (activity.action) {
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
    <>
      <div 
        className="flex items-start space-x-4 p-2 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="mt-1 p-2 rounded-full bg-muted/20">
          {getActivityIcon(activity.action)}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-gray-900">{getActivityText(activity)}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(activity.created_at), 'PPp')}
          </p>
        </div>
      </div>

      <ActivityDetailDialog 
        activity={activity}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}
