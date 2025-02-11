
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarRange,
  ClipboardList,
  Users,
  GitCommit,
  FileText,
  BarChart3,
  Bell,
} from "lucide-react";
import { ReviewSchedule } from "./MonitoringComponents/ReviewSchedule";
import { KPIsSection } from "./MonitoringComponents/KPIsSection";
import { CorrectiveActions } from "./MonitoringComponents/CorrectiveActions";
import { AuditsSection } from "./MonitoringComponents/AuditsSection";
import { WorkerConsultation } from "./MonitoringComponents/WorkerConsultation";
import { ReviewTriggers } from "./MonitoringComponents/ReviewTriggers";
import { Documentation } from "./MonitoringComponents/Documentation";

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
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <TabsTrigger value="schedule" className="space-x-2">
                <CalendarRange className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="kpis" className="space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>KPIs</span>
              </TabsTrigger>
              <TabsTrigger value="actions" className="space-x-2">
                <GitCommit className="h-4 w-4" />
                <span>Actions</span>
              </TabsTrigger>
              <TabsTrigger value="audits" className="space-x-2">
                <ClipboardList className="h-4 w-4" />
                <span>Audits</span>
              </TabsTrigger>
              <TabsTrigger value="consultation" className="space-x-2">
                <Users className="h-4 w-4" />
                <span>Consultation</span>
              </TabsTrigger>
              <TabsTrigger value="triggers" className="space-x-2">
                <Bell className="h-4 w-4" />
                <span>Triggers</span>
              </TabsTrigger>
              <TabsTrigger value="documentation" className="space-x-2">
                <FileText className="h-4 w-4" />
                <span>Documentation</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <ReviewSchedule
                data={formData.monitoring_review?.review_schedule}
                onChange={(data) => handleUpdateMonitoring("review_schedule", data)}
              />
            </TabsContent>

            <TabsContent value="kpis">
              <KPIsSection
                data={formData.monitoring_review?.kpis}
                onChange={(data) => handleUpdateMonitoring("kpis", data)}
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

            <TabsContent value="consultation">
              <WorkerConsultation
                data={formData.monitoring_review?.worker_consultation}
                onChange={(data) => handleUpdateMonitoring("worker_consultation", data)}
              />
            </TabsContent>

            <TabsContent value="triggers">
              <ReviewTriggers
                data={formData.monitoring_review?.review_triggers}
                onChange={(data) => handleUpdateMonitoring("review_triggers", data)}
              />
            </TabsContent>

            <TabsContent value="documentation">
              <Documentation
                data={formData.monitoring_review?.documentation}
                onChange={(data) => handleUpdateMonitoring("documentation", data)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
