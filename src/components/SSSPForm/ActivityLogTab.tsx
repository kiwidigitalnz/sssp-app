
import React from 'react';
import { ActivityLog } from './ActivityLog/ActivityLog';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ActivityLogTabProps {
  inModal?: boolean;
}

export const ActivityLogTab = ({ inModal = false }: ActivityLogTabProps) => {
  const { id: sssp_id } = useParams();

  if (!sssp_id) {
    return (
      <Card className="border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Activity Log Unavailable
          </CardTitle>
          <CardDescription>
            The activity log can only be viewed for saved SSSPs.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // If in modal, we don't need the outer spacing
  if (inModal) {
    return <ActivityLog sssp_id={sssp_id} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
      <ActivityLog sssp_id={sssp_id} />
    </div>
  );
};
