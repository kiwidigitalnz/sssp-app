
import { FileText, AlertTriangle, CheckCircle, ClipboardCheck } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { addDays } from "date-fns";

interface DashboardStatsProps {
  sssps: Array<{
    status: string;
    updated_at: string;
  }>;
}

export function DashboardStats({ sssps }: DashboardStatsProps) {
  const totalSssps = sssps.length;
  const draftSssps = sssps.filter(sssp => sssp.status === 'draft').length;
  const publishedSssps = sssps.filter(sssp => sssp.status === 'published').length;
  const recentSssps = sssps.filter(sssp => {
    const date = new Date(sssp.updated_at);
    const thirtyDaysAgo = addDays(new Date(), -30);
    return date > thirtyDaysAgo;
  }).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total SSSPs"
        value={totalSssps}
        icon={FileText}
        className="sm:col-span-1"
      />
      <StatsCard
        title="Draft"
        value={draftSssps}
        icon={ClipboardCheck}
        iconColor="text-yellow-500"
        className="sm:col-span-1"
      />
      <StatsCard
        title="Published"
        value={publishedSssps}
        icon={CheckCircle}
        iconColor="text-green-500"
        className="sm:col-span-1"
      />
      <StatsCard
        title="Updated (30d)"
        value={recentSssps}
        icon={AlertTriangle}
        iconColor="text-blue-500"
        className="sm:col-span-1"
      />
    </div>
  );
}
