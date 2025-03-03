
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
import { Button } from "@/components/ui/button";
import { Activity, FileDown, Share, MoreHorizontal, Save, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActivityLog } from "@/components/SSSPForm/ActivityLog/ActivityLog";

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
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleExit = () => {
    navigate('/');
  };

  const debouncedSave = useCallback(async (showToast = false) => {
    const now = Date.now();
    if (now - lastSaveTime < SAVE_DEBOUNCE_MS) {
      return;
    }
    
    setLastSaveTime(now);
    setSaveButtonText("Saving...");
    await handleSave(showToast);
    setSaveButtonText("Saved!");
    
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

  const handleActivityLogOpen = () => {
    if (!id) {
      toast({
        title: "SSSP not saved",
        description: "Please save your SSSP first to view the activity log.",
        variant: "destructive",
      });
      return;
    }
    setActivityLogOpen(true);
    // Close the dropdown menu if it's open
    setIsDropdownOpen(false);
  };

  const handleActivityLogClose = () => {
    setActivityLogOpen(false);
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export functionality will be available soon.",
    });
    // Close the dropdown menu
    setIsDropdownOpen(false);
  };

  const handleShareDocument = () => {
    if (!id) {
      toast({
        title: "SSSP not saved",
        description: "Please save your SSSP first to share it.",
        variant: "destructive",
      });
      return;
    }
    // Close the dropdown menu
    setIsDropdownOpen(false);
    navigate(`/share/${id}`);
  };

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
      <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4">
        <div className="flex justify-between items-center">
          <FormHeader
            id={id}
            title={formData.title || "Untitled SSSP"}
            status={formData.status || "draft"}
            isNew={isNew}
            isLoading={isSaving}
            currentStep={currentStep}
          />

          <div className="flex items-center space-x-2">
            {/* Cancel Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            
            {/* Save Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSaveWithFeedback(true)}
              disabled={isSaving}
              className="gap-1"
            >
              <Save className="h-4 w-4" />
              {saveButtonText}
            </Button>
            
            {/* Actions Button */}
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <MoreHorizontal className="h-4 w-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleActivityLogOpen();
                  }} 
                  className="cursor-pointer"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Activity Log
                </DropdownMenuItem>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      onSelect={(e) => {
                        e.preventDefault();
                        setIsDropdownOpen(false);
                      }} 
                      className="cursor-pointer"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Export SSSP as PDF?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will generate a PDF of your SSSP. Do you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleExportPDF}>Export</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShareDocument();
                  }} 
                  className="cursor-pointer"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share SSSP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Activity Log Dialog - Fixed to prevent propagation issues */}
      <Dialog 
        open={activityLogOpen} 
        onOpenChange={(open) => {
          // Only handle the close event here, open is handled by handleActivityLogOpen
          if (!open) {
            handleActivityLogClose();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Log</DialogTitle>
            <DialogDescription>
              View all activities and changes for this SSSP
            </DialogDescription>
          </DialogHeader>
          {id && <ActivityLog sssp_id={id} />}
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => {
                handleActivityLogClose();
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-6 mb-16">
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {renderStepContent()}
        </ScrollArea>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="container mx-auto max-w-6xl px-4">
          <FormNavigation
            currentStep={currentStep}
            totalSteps={10}
            saveForm={handleSave}
            formData={formData}
            onStepChange={handleStepChange}
            isValid={isValid}
            hideMainSaveButton={true}
            onActivityLogOpen={handleActivityLogOpen}
          />
        </div>
      </div>
    </div>
  );
}
