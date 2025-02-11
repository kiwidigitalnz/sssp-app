
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, ClipboardList } from "lucide-react";
import { ReviewSchedule } from "./MonitoringComponents/ReviewSchedule";
import { AuditsSection } from "./MonitoringComponents/AuditsSection";

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

  // Memoize the monitoring review data
  const monitoringData = useMemo(() => ({
    review_schedule: formData.monitoring_review?.review_schedule || {},
    audits: formData.monitoring_review?.audits || []
  }), [formData.monitoring_review]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring and Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="grid grid-cols-2 gap-4">
              <TabsTrigger value="schedule" className="space-x-2">
                <CalendarRange className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="audits" className="space-x-2">
                <ClipboardList className="h-4 w-4" />
                <span>Audits</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <ReviewSchedule
                data={monitoringData.review_schedule}
                onChange={(data) => handleUpdateMonitoring("review_schedule", data)}
              />
            </TabsContent>

            <TabsContent value="audits">
              <AuditsSection
                data={monitoringData.audits}
                onChange={(data) => handleUpdateMonitoring("audits", data)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
