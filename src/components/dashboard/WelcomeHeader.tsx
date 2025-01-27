import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WelcomeHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Safety Plans Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage and track your Site-Specific Safety Plans</p>
          </div>
          <Button 
            onClick={() => navigate("/create-sssp")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New SSSP
          </Button>
        </div>
      </div>
    </div>
  );
};