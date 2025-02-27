
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, ClipboardList } from "lucide-react";
import { ReviewSchedule } from "./MonitoringComponents/ReviewSchedule";
import { AuditsSection } from "./MonitoringComponents/AuditsSection";

interface MonitoringReviewProps {
  formData: any;
  setFormData: (data: any) => void;
  isLoading?: boolean;
}

export const MonitoringReview = ({ formData, setFormData, isLoading = false }: MonitoringReviewProps) => {
  const handleUpdateMonitoring = (section: string, data: any) => {
    // Create a properly structured monitoring_review object that matches the Supabase schema
    const updatedMonitoringReview = {
      ...(formData.monitoring_review || {}),
      [section]: data,
    };
    
    setFormData({
      ...formData,
      monitoring_review: updatedMonitoringReview,
    });
    
    // Log the data structure for debugging
    console.log("Updated monitoring_review:", updatedMonitoringReview);
  };

  // Ensure the audits have the required status field
  const normalizedAudits = useMemo(() => {
    if (!formData.monitoring_review?.audits) return [];
    
    return formData.monitoring_review.audits.map((audit: any) => ({
      ...audit,
      status: audit.status || (audit.last_completed ? 'completed' : 'pending')
    }));
  }, [formData.monitoring_review?.audits]);

  // Memoize the monitoring review data
  const monitoringData = useMemo(() => ({
    review_schedule: formData.monitoring_review?.review_schedule || {
      frequency: "",
      last_review: null,
      next_review: null,
      responsible_person: null
    },
    audits: normalizedAudits
  }), [formData.monitoring_review, normalizedAudits]);

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
                <span>SSSP Review</span>
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
