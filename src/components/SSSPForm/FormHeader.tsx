
import { Button } from "@/components/ui/button";
import { Save, X, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface FormHeaderProps {
  id?: string;
  title: string;
  status: string;
  isNew: boolean;
  isLoading?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  currentStep?: number;
}

export const FormHeader = ({ 
  id, 
  title, 
  status, 
  isNew, 
  isLoading, 
  onSave, 
  onCancel,
  currentStep
}: FormHeaderProps) => {
  // Map status to appropriate color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Get section name based on current step
  const getSectionName = (step?: number) => {
    if (step === undefined) return "";
    
    const sections = [
      "Project Details",
      "Company Info",
      "Scope of Work",
      "Emergency Procedures",
      "Health & Safety",
      "Training Requirements",
      "Hazard Management",
      "Site Safety Rules",
      "Communication",
      "Monitoring & Review",
      "SSSP Summary"
    ];
    
    return sections[step] || "";
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Link to="/" className="flex items-center hover:text-gray-700">
          <Home className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">
          {isNew ? "Create SSSP" : title || "Edit SSSP"}
        </span>
        {currentStep !== undefined && (
          <>
            <span className="mx-2">/</span>
            <span>{getSectionName(currentStep)}</span>
          </>
        )}
      </div>
      
      {/* Main header content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {title || "Untitled SSSP"}
          </h1>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
              {status || "draft"}
            </span>
            {!isNew && id && (
              <span className="text-xs text-gray-500">ID: {id.slice(0, 8)}</span>
            )}
          </div>
        </div>
        
        {(onSave || onCancel) && (
          <div className="flex gap-4">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="gap-2"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
            {onSave && (
              <Button
                onClick={onSave}
                variant="outline"
                className="gap-2"
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save & Exit"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
