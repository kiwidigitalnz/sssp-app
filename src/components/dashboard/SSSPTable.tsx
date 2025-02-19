import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Share2, Copy, Printer, Trash2, Users } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";
import { ShareSSSP } from "@/components/SSSPForm/ShareSSSP";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface SSSPTableProps {
  ssspList: SSSP[];
}

export function SSSPTable({ ssspList }: SSSPTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ssspToDelete, setSsspToDelete] = useState<string | null>(null);
  const [ssspToClone, setSsspToClone] = useState<SSSP | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const { data: sharingInfo, refetch: refetchSharing } = useQuery({
    queryKey: ['sssp-sharing'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('sssp_access')
          .select('sssp_id, user_id')
          .in('sssp_id', ssspList.map(sssp => sssp.id));
        
        if (error) throw error;
        
        const counts: Record<string, number> = {};
        data?.forEach(access => {
          counts[access.sssp_id] = (counts[access.sssp_id] || 0) + 1;
        });
        
        return counts;
      } catch (error) {
        console.error('Error fetching sharing info:', error);
        return {};
      }
    },
    enabled: ssspList.length > 0,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 1
  });

  const handleClone = async (sssp: SSSP) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to clone an SSSP",
      });
      return;
    }

    try {
      setIsCloning(true);
      console.log('Starting clone operation for SSSP:', sssp);

      const { 
        id,
        created_at,
        updated_at,
        version,
        version_history,
        status,
        created_by,
        modified_by,
        ...cloneData 
      } = sssp;

      const newSSPP = {
        title: `Clone - ${sssp.title}`,
        description: sssp.description,
        company_name: sssp.company_name,
        company_address: sssp.company_address,
        company_contact_name: sssp.company_contact_name,
        company_contact_email: sssp.company_contact_email,
        company_contact_phone: sssp.company_contact_phone,
        services: sssp.services,
        locations: sssp.locations,
        considerations: sssp.considerations,
        pcbu_duties: sssp.pcbu_duties,
        site_supervisor_duties: sssp.site_supervisor_duties,
        worker_duties: sssp.worker_duties,
        contractor_duties: sssp.contractor_duties,
        emergency_plan: sssp.emergency_plan,
        assembly_points: sssp.assembly_points,
        emergency_equipment: sssp.emergency_equipment,
        incident_reporting: sssp.incident_reporting,
        emergency_contacts: Array.isArray(sssp.emergency_contacts) ? [...sssp.emergency_contacts] : [],
        competency_requirements: sssp.competency_requirements,
        training_records: sssp.training_records,
        required_training: Array.isArray(sssp.required_training) ? [...sssp.required_training] : [],
        drug_and_alcohol: sssp.drug_and_alcohol,
        fatigue_management: sssp.fatigue_management,
        ppe: sssp.ppe,
        mobile_phone: sssp.mobile_phone,
        entry_exit_procedures: sssp.entry_exit_procedures,
        speed_limits: sssp.speed_limits,
        parking_rules: sssp.parking_rules,
        site_specific_ppe: sssp.site_specific_ppe,
        communication_methods: sssp.communication_methods,
        toolbox_meetings: sssp.toolbox_meetings,
        reporting_procedures: sssp.reporting_procedures,
        communication_protocols: sssp.communication_protocols,
        visitor_rules: sssp.visitor_rules,
        hazards: Array.isArray(sssp.hazards) ? [...sssp.hazards] : [],
        meetings_schedule: Array.isArray(sssp.meetings_schedule) ? [...sssp.meetings_schedule] : [],
        monitoring_review: sssp.monitoring_review ? JSON.parse(JSON.stringify(sssp.monitoring_review)) : null,
        start_date: sssp.start_date,
        end_date: sssp.end_date,
        status: 'draft',
        created_by: user.id,
        modified_by: user.id,
        version: 1,
        version_history: []
      };

      console.log('Prepared cloned SSSP data:', newSSPP);

      const { data, error } = await supabase
        .from('sssps')
        .insert(newSSPP)
        .select()
        .single();

      if (error) throw error;

      console.log('Successfully cloned SSSP:', data);

      toast({
        title: "SSSP Cloned",
        description: "The SSSP has been cloned successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['sssps'] });
      
      if (data) {
        navigate(`/edit-sssp/${data.id}`);
      }
    } catch (error) {
      console.error('Error cloning SSSP:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clone SSSP. Please try again.",
      });
    } finally {
      setIsCloning(false);
      setSsspToClone(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sssps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "SSSP deleted",
        description: "The SSSP has been successfully deleted",
      });

      queryClient.invalidateQueries({ queryKey: ['sssps'] });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete SSSP",
      });
    }
    setSsspToDelete(null);
  };

  const handleExportPDF = async (sssp: SSSP) => {
    toast({
      title: "Coming Soon",
      description: "PDF export functionality will be available in the next update",
    });
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <CardTitle>Site-Specific Safety Plans</CardTitle>
        <Button 
          onClick={() => navigate("/create-sssp")}
          className="w-full sm:w-auto transition-all hover:scale-105"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New SSSP
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[140px] font-semibold">Title</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Created Date</TableHead>
                    <TableHead className="font-semibold w-[100px]">Status</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Shared With</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Last Modified</TableHead>
                    <TableHead className="text-right font-semibold w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ssspList.map((sssp) => (
                    <TableRow 
                      key={sssp.id} 
                      className="transition-colors hover:bg-muted/50 border-t"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <button 
                            onClick={() => navigate(`/edit-sssp/${sssp.id}`)}
                            className="text-left hover:underline truncate max-w-[200px]"
                          >
                            {sssp.title}
                          </button>
                          {isMobile && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {new Date(sssp.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(sssp.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            sssp.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {sssp.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {sharingInfo && sharingInfo[sssp.id] ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{sharingInfo[sssp.id]} users</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not shared</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(sssp.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right p-2">
                        <TooltipProvider>
                          <div className="flex items-center justify-end gap-2">
                            <ShareSSSP ssspId={sssp.id} onShare={() => refetchSharing()}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 p-0 flex items-center justify-center"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Share SSSP</p>
                                </TooltipContent>
                              </Tooltip>
                            </ShareSSSP>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSsspToClone(sssp)}
                                  className="h-8 w-8 p-0 flex items-center justify-center"
                                  disabled={isCloning}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Clone SSSP</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleExportPDF(sssp)}
                                  className="h-8 w-8 p-0 flex items-center justify-center"
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Export as PDF</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSsspToDelete(sssp.id)}
                                  className="h-8 w-8 p-0 flex items-center justify-center text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete SSSP</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Clone Confirmation Dialog */}
      <AlertDialog open={!!ssspToClone} onOpenChange={() => setSsspToClone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clone SSSP</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new copy of the SSSP with all its data. The new SSSP will be in draft status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ssspToClone && handleClone(ssspToClone)}
              disabled={isCloning}
            >
              {isCloning ? "Cloning..." : "Clone"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!ssspToDelete} onOpenChange={() => setSsspToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the SSSP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ssspToDelete && handleDelete(ssspToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
