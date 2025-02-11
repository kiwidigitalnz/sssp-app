
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, GitCommit, ClipboardList, Bell } from "lucide-react";
import { ReviewSchedule } from "./MonitoringComponents/ReviewSchedule";
import { CorrectiveActions } from "./MonitoringComponents/CorrectiveActions";
import { AuditsSection } from "./MonitoringComponents/AuditsSection";
import { ReviewTriggers } from "./MonitoringComponents/ReviewTriggers";

interface MonitoringReviewProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const MonitoringReview = ({ formData, setFormData }: MonitoringReviewProps) => {
  const handleUpdateMonitoring = (section: string, data: any) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...formData.monitoring_review,
        [section]: data,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring and Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TabsTrigger value="schedule" className="space-x-2">
                <CalendarRange className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="actions" className="space-x-2">
                <GitCommit className="h-4 w-4" />
                <span>Actions</span>
              </TabsTrigger>
              <TabsTrigger value="audits" className="space-x-2">
                <ClipboardList className="h-4 w-4" />
                <span>Audits</span>
              </TabsTrigger>
              <TabsTrigger value="triggers" className="space-x-2">
                <Bell className="h-4 w-4" />
                <span>Triggers</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <ReviewSchedule
                data={formData.monitoring_review?.review_schedule}
                onChange={(data) => handleUpdateMonitoring("review_schedule", data)}
              />
            </TabsContent>

            <TabsContent value="actions">
              <CorrectiveActions
                data={formData.monitoring_review?.corrective_actions}
                onChange={(data) => handleUpdateMonitoring("corrective_actions", data)}
              />
            </TabsContent>

            <TabsContent value="audits">
              <AuditsSection
                data={formData.monitoring_review?.audits}
                onChange={(data) => handleUpdateMonitoring("audits", data)}
              />
            </TabsContent>

            <TabsContent value="triggers">
              <ReviewTriggers
                data={formData.monitoring_review?.review_triggers}
                onChange={(data) => handleUpdateMonitoring("review_triggers", data)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
