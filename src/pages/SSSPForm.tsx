
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { FormNavigation } from "@/components/SSSPForm/FormNavigation";
import { FormHeader } from "@/components/SSSPForm/FormHeader";
import { ProjectDetails } from "@/components/features/sssp/ProjectDetails";
import { CompanyInfo } from "@/components/SSSPForm/CompanyInfo";
import { ScopeOfWork } from "@/components/features/sssp/ScopeOfWork";
import { EmergencyProcedures } from "@/components/SSSPForm/EmergencyProcedures";
import { HealthAndSafetyPolicies } from "@/components/features/sssp/HealthAndSafetyPolicies";
import { TrainingRequirements } from "@/components/SSSPForm/TrainingRequirements";
import { HazardManagement } from "@/components/SSSPForm/HazardManagement";
import { SiteSafetyRules } from "@/components/features/sssp/SiteSafetyRules";
import { Communication } from "@/components/SSSPForm/Communication";
import { MonitoringReview } from "@/components/SSSPForm/MonitoringReview";
import { SummaryScreen } from "@/components/SSSPForm/SummaryScreen";
import { ActivityLogTab } from "@/components/SSSPForm/ActivityLogTab";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityLogging";

export default function SSSPForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const [isNew, setIsNew] = useState(true);

  // Total number of steps in the form (0-indexed, so 10 means 11 steps)
  const totalSteps = 10;

  const {
    formData,
    setFormData,
    save,
    isLoading,
    error,
  } = useFormPersistence({
    key: id || "new-sssp",
    initialData: {
      title: "",
      company_name: "",
      hazards: [],
      emergency_contacts: [],
      status: "draft",
    },
  });

  useEffect(() => {
    // Check if this is a new SSSP or editing an existing one
    if (id) {
      setIsNew(false);
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "There was a problem loading the form data.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSave = async () => {
    // If new SSSP, need to create it first
    if (isNew) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to create an SSSP.",
            variant: "destructive",
          });
          return;
        }

        const newSSSP = {
          ...formData,
          created_by: user.id,
          modified_by: user.id,
          user_id: user.id
        };

        const { data, error } = await supabase
          .from("sssps")
          .insert(newSSSP)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Log the creation activity
        await logActivity(data.id, 'created', user.id, {
          description: 'Created new SSSP',
          severity: 'major'
        });

        toast({
          title: "SSSP Created",
          description: "Your SSSP has been created successfully.",
        });

        // Navigate to the new SSSP edit page
        navigate(`/sssp/${data.id}`);
        setIsNew(false);
      } catch (error) {
        console.error("Error creating SSSP:", error);
        toast({
          title: "Error",
          description: "There was a problem creating your SSSP.",
          variant: "destructive",
        });
      }
    } else {
      // Just save changes
      save();
    }
  };

  // Render the appropriate step content based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProjectDetails formData={formData} setFormData={setFormData} />;
      case 1:
        return <CompanyInfo formData={formData} setFormData={setFormData} />;
      case 2:
        return <ScopeOfWork formData={formData} setFormData={setFormData} />;
      case 3:
        return <EmergencyProcedures formData={formData} setFormData={setFormData} />;
      case 4:
        return <HealthAndSafetyPolicies formData={formData} setFormData={setFormData} />;
      case 5:
        return <TrainingRequirements formData={formData} setFormData={setFormData} />;
      case 6:
        return <HazardManagement formData={formData} setFormData={setFormData} />;
      case 7:
        return <SiteSafetyRules formData={formData} setFormData={setFormData} />;
      case 8:
        return <Communication formData={formData} setFormData={setFormData} />;
      case 9:
        return <MonitoringReview formData={formData} setFormData={setFormData} />;
      case 10:
        return <SummaryScreen formData={formData} setFormData={setFormData} />;
      case 11:
        return <ActivityLogTab />;
      default:
        return <ProjectDetails formData={formData} setFormData={setFormData} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <FormHeader
        title={formData.title || "Untitled SSSP"}
        status={formData.status}
        isNew={isNew}
      />

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-6">
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {renderStepContent()}
        </ScrollArea>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          saveForm={handleSave}
          formData={formData}
          onStepChange={setCurrentStep}
          isValid={isValid}
        />
      </div>
    </div>
  );
}
