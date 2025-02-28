
import React, { useState, useEffect, useCallback } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityLogging";
import type { SSSP } from "@/types/sssp";

// Add a debounce delay for save operations to prevent rapid successive saves
const SAVE_DEBOUNCE_MS = 2000;

export default function SSSPForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [lastSaveTime, setLastSaveTime] = useState(0);

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

  // Handle step change and scroll to top
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    // Scroll to top when the step changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate('/');
  };

  // Handle exit button click - navigate back to dashboard
  const handleExit = () => {
    navigate('/');
  };

  // Debounced save function to prevent multiple rapid saves
  const debouncedSave = useCallback(async (showToast = false) => {
    const now = Date.now();
    // Only save if it's been more than SAVE_DEBOUNCE_MS since the last save
    if (now - lastSaveTime < SAVE_DEBOUNCE_MS) {
      return;
    }
    
    setLastSaveTime(now);
    setSaveButtonText("Saving...");
    await handleSave(showToast);
    setSaveButtonText("Saved!");
    
    // Reset the button text after a delay
    setTimeout(() => {
      setSaveButtonText("Save");
    }, 2000);
  }, [lastSaveTime]);

  const handleSaveWithFeedback = async (showToast = false) => {
    await debouncedSave(showToast);
  };

  const handleSave = async (showToast = false) => {
    setIsSaving(true);
    
    try {
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

          // Ensure required fields are present
          const newSSSP = {
            ...formData,
            created_by: user.id,
            modified_by: user.id,
            user_id: user.id,
            title: formData.title || "Untitled SSSP",
            company_name: formData.company_name || "Unknown Company",
            status: formData.status || "draft"
          };

          const { data, error } = await supabase
            .from("sssps")
            .insert(newSSSP as any)
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

          if (showToast) {
            toast({
              title: "SSSP Created",
              description: "Your SSSP has been created successfully.",
            });
          }

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
        await save();
        
        if (showToast) {
          toast({
            title: "Changes saved",
            description: "Your SSSP has been saved successfully.",
          });
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Memorize component rendering to prevent unnecessary re-renders
  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 0:
        return <ProjectDetails formData={formData} setFormData={setFormData as any} />;
      case 1:
        return <CompanyInfo formData={formData} setFormData={setFormData as any} />;
      case 2:
        return <ScopeOfWork formData={formData} setFormData={setFormData as any} />;
      case 3:
        return <EmergencyProcedures formData={formData} setFormData={setFormData as any} />;
      case 4:
        return <HealthAndSafetyPolicies formData={formData} setFormData={setFormData as any} />;
      case 5:
        return <TrainingRequirements formData={formData} setFormData={setFormData as any} isLoading={isLoading} />;
      case 6:
        return <HazardManagement formData={formData} setFormData={setFormData as any} />;
      case 7:
        return <SiteSafetyRules formData={formData} setFormData={setFormData as any} />;
      case 8:
        return <Communication formData={formData} setFormData={setFormData as any} />;
      case 9:
        return <MonitoringReview formData={formData} setFormData={setFormData as any} isLoading={isLoading} />;
      case 10:
        return <SummaryScreen formData={formData} setFormData={setFormData as any} />;
      default:
        return <ProjectDetails formData={formData} setFormData={setFormData as any} />;
    }
  }, [currentStep, formData, setFormData, isLoading]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <FormHeader
        id={id}
        title={formData.title || "Untitled SSSP"}
        status={formData.status || "draft"}
        isNew={isNew}
        isLoading={isSaving}
        onCancel={handleCancel}
        onSave={handleSaveWithFeedback}
        currentStep={currentStep}
        saveButtonText={saveButtonText}
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
          onStepChange={handleStepChange}
          isValid={isValid}
          hideMainSaveButton={true}
        />
      </div>
    </div>
  );
}
