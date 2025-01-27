import { format } from "date-fns";
import { Activity, FileText, Share } from "lucide-react";

interface ActivityItemProps {
  activity: {
    id: string;
    action: string;
    created_at: string;
    sssps: { title: string };
    profiles?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "created":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "updated":
        return <Activity className="h-4 w-4 text-blue-500" />;
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
    <div className="flex items-start space-x-4">
      <div className="mt-1">{getActivityIcon(activity.action)}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{getActivityText(activity)}</p>
        <p className="text-xs text-gray-500">
          {format(new Date(activity.created_at), 'PPp')}
        </p>
      </div>
    </div>
  );
}