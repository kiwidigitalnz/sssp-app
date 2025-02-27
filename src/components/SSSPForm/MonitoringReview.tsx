
import React from 'react';
import { TextSection } from "./MonitoringComponents/TextSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewSchedule } from "./MonitoringComponents/ReviewSchedule";
import { CorrectiveActions } from "./MonitoringComponents/CorrectiveActions";
import { AuditsSection } from "./MonitoringComponents/AuditsSection";
import { ReviewTriggers } from "./MonitoringComponents/ReviewTriggers";
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
    corrective_actions: {},
    audits: [],
    worker_consultation: {},
    review_triggers: [],
    documentation: {}
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

  const handleCorrectiveActionsChange = (data: any) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...monitoringData,
        corrective_actions: data
      }
    });
  };

  const handleWorkerConsultationChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...monitoringData,
        worker_consultation: {
          ...monitoringData.worker_consultation,
          [field]: value
        }
      }
    });
  };

  const handleTriggerChange = (triggers: any[]) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...monitoringData,
        review_triggers: triggers
      }
    });
  };

  const handleDocumentationChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...monitoringData,
        documentation: {
          ...monitoringData.documentation,
          [field]: value
        }
      }
    });
  };

  const handleAuditsChange = (audits: any[]) => {
    setFormData({
      ...formData,
      monitoring_review: {
        ...monitoringData,
        audits: audits
      }
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Monitoring and Review</h2>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="mb-4 w-full border-b justify-start rounded-none bg-transparent">
          <TabsTrigger value="schedule" className="rounded-t-md rounded-b-none">Review Schedule</TabsTrigger>
          <TabsTrigger value="corrective" className="rounded-t-md rounded-b-none">Corrective Actions</TabsTrigger>
          <TabsTrigger value="audits" className="rounded-t-md rounded-b-none">Audits</TabsTrigger>
          <TabsTrigger value="consultation" className="rounded-t-md rounded-b-none">Consultation Process</TabsTrigger>
          <TabsTrigger value="documentation" className="rounded-t-md rounded-b-none">Documentation</TabsTrigger>
          <TabsTrigger value="triggers" className="rounded-t-md rounded-b-none">Review Triggers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-6">
          <ReviewSchedule 
            data={monitoringData.review_schedule} 
            onChange={handleReviewScheduleChange} 
            sssp_id={sssp_id || ''} 
          />
        </TabsContent>
        
        <TabsContent value="corrective" className="mt-6">
          <CorrectiveActions 
            data={monitoringData.corrective_actions} 
            onChange={handleCorrectiveActionsChange} 
          />
        </TabsContent>
        
        <TabsContent value="audits" className="mt-6">
          <AuditsSection 
            audits={monitoringData.audits || []} 
            onChange={handleAuditsChange} 
          />
        </TabsContent>
        
        <TabsContent value="consultation" className="mt-6">
          <div className="space-y-6">
            <TextSection
              title="Consultation Method"
              fieldId="worker-consultation-method"
              value={monitoringData.worker_consultation?.method || ''}
              onChange={(value) => handleWorkerConsultationChange('method', value)}
              placeholder="Describe how workers are consulted regarding health and safety matters..."
            />
            
            <TextSection
              title="Consultation Frequency"
              fieldId="worker-consultation-frequency"
              value={monitoringData.worker_consultation?.frequency || ''}
              onChange={(value) => handleWorkerConsultationChange('frequency', value)}
              placeholder="How often are workers consulted?"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium block mb-2">Last Consultation Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={monitoringData.worker_consultation?.last_consultation || ''}
                  onChange={(e) => handleWorkerConsultationChange('last_consultation', e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-6">
          <div className="space-y-6">
            <TextSection
              title="Storage Location"
              fieldId="documentation-storage"
              value={monitoringData.documentation?.storage_location || ''}
              onChange={(value) => handleDocumentationChange('storage_location', value)}
              placeholder="Where are SSSP documents stored?"
            />
            
            <TextSection
              title="Retention Period"
              fieldId="documentation-retention"
              value={monitoringData.documentation?.retention_period || ''}
              onChange={(value) => handleDocumentationChange('retention_period', value)}
              placeholder="How long are documents retained?"
            />
            
            <TextSection
              title="Access Details"
              fieldId="documentation-access"
              value={monitoringData.documentation?.access_details || ''}
              onChange={(value) => handleDocumentationChange('access_details', value)}
              placeholder="Who has access to these documents and how?"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="triggers" className="mt-6">
          <ReviewTriggers
            triggers={monitoringData.review_triggers || []}
            onChange={handleTriggerChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
