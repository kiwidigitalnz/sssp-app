
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Save, 
  X, 
  CheckCircle2
} from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface FormHeaderProps {
  id?: string;
  title: string;
  status: string;
  isNew: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSave: (showToast?: boolean) => void;
  currentStep: number;
  saveButtonText?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  id,
  title,
  status,
  isNew,
  isLoading,
  onCancel,
  onSave,
  currentStep,
  saveButtonText = "Save",
}) => {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Handle back button click (navigate to dashboard)
  const handleBack = () => {
    navigate('/');
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format title for display
  const formattedTitle = title || (isNew ? "New SSSP" : "Untitled SSSP");

  return (
    <>
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you exit now. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{formattedTitle}</h1>
            {status && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {isNew ? "Create a new" : "Edit your"} Site Specific Safety Plan
          </p>
        </div>

        <div className="flex flex-row space-x-2 items-center">
          {!isNew && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCancelDialog(true)}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
          
          <Button
            onClick={() => onSave(true)}
            disabled={isLoading}
            size="sm"
            className="gap-1"
          >
            {saveButtonText === "Saved!" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveButtonText}
          </Button>
        </div>
      </div>
    </>
  );
};
