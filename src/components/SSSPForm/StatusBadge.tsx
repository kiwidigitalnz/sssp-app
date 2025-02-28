
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Archive, 
  Eye, 
  PenTool 
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: "Draft",
      variant: "outline" as const,
      icon: Clock,
    },
    published: {
      label: "Published",
      variant: "default" as const,
      icon: CheckCircle,
    },
    review: {
      label: "In Review",
      variant: "secondary" as const,
      icon: Eye,
    },
    revision: {
      label: "Needs Revision",
      variant: "destructive" as const,
      icon: PenTool,
    },
    expired: {
      label: "Expired",
      variant: "destructive" as const,
      icon: AlertCircle,
    },
    archived: {
      label: "Archived",
      variant: "outline" as const,
      icon: Archive,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-0.5 text-xs font-medium">
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
