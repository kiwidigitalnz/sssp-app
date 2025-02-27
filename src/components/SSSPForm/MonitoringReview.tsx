
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewSchedule } from "./MonitoringComponents/ReviewSchedule";
import { AuditsSection } from "./MonitoringComponents/AuditsSection";
import { useParams } from 'react-router-dom';

interface MonitoringReviewProps {
  formData: any;
  setFormData: (data: any) => void;
  isLoading?: boolean;
}

export const MonitoringReview = ({ formData, setFormData, isLoading = false }: MonitoringReviewProps) => {
  const { id: sssp_id } = useParams();
  
  // Initialize default values if data is missing
  const monitoringData = formData.monitoring_review || {
    review_schedule: {},
    kpis: [],
    audits: [],
  };

  const handleReviewScheduleChange = (data: any) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...monitoringData,
        review_schedule: data
      }
    });
  };

  const handleAuditsChange = (data: any[]) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...monitoringData,
        audits: data
      }
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Monitoring and Review</h2>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="mb-4 w-full border-b justify-start rounded-none bg-transparent">
          <TabsTrigger value="schedule" className="rounded-t-md rounded-b-none">Review Schedule</TabsTrigger>
          <TabsTrigger value="audits" className="rounded-t-md rounded-b-none">Audits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-6">
          <ReviewSchedule 
            data={monitoringData.review_schedule} 
            onChange={handleReviewScheduleChange} 
            sssp_id={sssp_id || ''} 
          />
        </TabsContent>
        
        <TabsContent value="audits" className="mt-6">
          <AuditsSection 
            data={monitoringData.audits || []} 
            onChange={handleAuditsChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
